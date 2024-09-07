import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { compare, } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { NextApiRequest } from "next";

export async function POST(req: Request, context: any) {
    
    const data  = await req.json();
    const email = data.email;
    const password = data.password;

    console.log(email);
    const user = await db.user.findFirst({
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            companyId: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            }
        },
        where: {
            email: email,
        },
    });


    if (!user || !user?.password) {
        return new NextResponse("Usuário ou senha inválido", { status: 404 });
    }

    const isValid =  compare(password, user.password);

    if (!isValid) {
        return new NextResponse("usuario ou senha inválida", { status: 401 });
    }

    const secret = "c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2";

    const token =  sign({ sub: user.id }, secret, {
        expiresIn: "7d",
    });
    

    return  NextResponse.json({
         token, 
         user: {
            id: user.id,
            email: user.email,
            name: user.name,
            company: {
                id: user.companyId,
                name: user.company?.name,
                slug: user.company?.slug,
            }
         },
        }, 
        { status: 201 }
    );

    
}
