import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "text", type: "text", placeholder: "user@gmail.com" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("correo y contraseña son obligatorios.");
        }

        const userFound = await db.users.findUnique({
          where: { email: credentials.email },
        });
        console.log("User Found:", userFound);
        if (!userFound) {
          throw new Error("correo no encontrado");
        }

        const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

        if (!matchPassword) {
          throw new Error("Contraseña incorrecta");
        }

        const accessToken = jwt.sign(
          { id: userFound.id, role: userFound.role },
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '1w' } 
        );

        return {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
          role: userFound.role,
          accessToken, 
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",  
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 7, 
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken; 
        token.id = user.id;
        token.role = user.role;  
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken; 
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
