import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export async function POST(req: Request) {
  try {
    const { studentId, subject, marks, grade, term, year } = await req.json()

    const result = await prisma.result.create({
  data: {
    studentId,
    subject,
    marks,
    grade,
    term,
    year,
  },
})

    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}