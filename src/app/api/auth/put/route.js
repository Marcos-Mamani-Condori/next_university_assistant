import { NextResponse } from 'next/server';
import db from '@/libs/db';
import bcrypt from 'bcrypt'; 

export async function PUT(request) {
    try {
        const data = await request.json();
        
        if (!data.name || !data.oldEmail) {
            return NextResponse.json({
                message: "Name and old email are required"
            }, {
                status: 400
            });
        }

        const user = await db.users.findUnique({ where: { email: data.oldEmail } });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, {
                status: 404
            });
        }

        const usernameCheck = await db.users.findUnique({
            where: { 
                name: data.name,
                NOT: { email: user.email } 
            }
        });

        if (usernameCheck) {
            return NextResponse.json({
                message: "Username already exists"
            }, {
                status: 400
            });
        }

        const updatedData = {
            name: data.name,
            email: data.newEmail ? data.newEmail : user.email, 
            profile_picture_url: data.profile_picture_url 
        };

        if (data.password) {
            const salt = await bcrypt.genSalt(10); 
            updatedData.password = await bcrypt.hash(data.password, salt); 
        }

        const updatedUser = await db.users.update({
            where: { email: user.email }, 
            data: updatedData,
        });
        const { password: _, ...userWithoutPassword } = updatedUser; 

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({
            message: error.message,
        }, {
            status: 500,
        });
    }
}
