import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export async function POST(req: Request) {
  try {
    const { day, period, subject, teacher, className, time } = await req.json()

    const entry = await prisma.timetable.create({
      data: {
        day,
        period,
        subject,
        teacher,
        className,
        time,
      },
    })

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}