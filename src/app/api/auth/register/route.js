import { NextResponse } from 'next/server'
import db from '@/libs/db'
import bcrypt from 'bcrypt'
export async function POST(request) {
    try {
        const data = await request.json();

    const userFound = await db.user.findUnique({
        where: { 
            email: data.email
        }
    })
    if (userFound){
        return NextResponse.json({
            message: "email already exists "
        }, {
            status: 400
        })
    }
    const usernameFound = await db.user.findUnique({
        where: { 
            name: data.name
        }
    })
    if (usernameFound){
        return NextResponse.json({
            message: "username already exists "
        }, {
            status: 400
        })
    }
const hashedPassword = await bcrypt.hash(data.password, 10 )
const newUser = await db.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            major: data.major, 
            role: data.role || 'registrado', 
            status: data.status || 'inactivo'
        }
    }
)
const {password: _, ...user}=newUser
console.log("user:", JSON.stringify(user, null, 2)); 
     return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            {
            message: error.message,
        },
        {
            status: 500,
        }
    );
    }
}