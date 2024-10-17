import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from 'bcrypt';
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Credentials received:", credentials);
        if (!credentials.name) {
            console.error("Username is required.");
            return null;
        }
        const userFound = await db.users.findUnique({
            where: { name: credentials.name}
        })
            if (!userFound)  throw new Error("usuario no encontrado")
            
            console.log(userFound);
            const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

            if (!matchPassword)  throw new Error("contraseña incorrecta")
            
            return {
                id: userFound.id,
                name: userFound.name,
                email: userFound.email,
                major: userFound.major,
                role: userFound.role, 
                status: userFound.status
            }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  }
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
