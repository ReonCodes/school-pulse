import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export async function POST(req: Request) {
  try {
    const { name, email, password, staffNo, subject } = await req.json()

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: 'TEACHER',
        staff: {
          create: {
            staffNo,
            subject,
          },
        },
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}