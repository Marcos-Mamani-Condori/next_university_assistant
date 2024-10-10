// app/api/auth/register.js
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, carrera } = req.body;

    if (!username || !password || !carrera) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.usuario.create({
      data: {
        nombre: username,
        password: hashedPassword,
        correo: `${username}@example.com`,
        carrera,
      },
    });

    return res.status(201).json({ message: 'User registered successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
