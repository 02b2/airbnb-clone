import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request, 
) {
  const body = await request.json();
  const { 
    email,
    name,
    password,
   } = body;

   // Check if user with the same email already exists
   const existingUser = await prisma.user.findUnique({ where: { email } });
   if (existingUser) {
     return NextResponse.json({ error: "User with this email already exists." });
   }

   const hashedPassword = await bcrypt.hash(password, 12);

   const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    }
  });

  return NextResponse.json(user);
}