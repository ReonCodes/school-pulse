import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export async function POST(req: Request) {
  try {
    const { studentId, amount, term, year, receiptNo } = await req.json()

    const fee = await prisma.feeRecord.create({
      data: {
        studentId,
        amount,
        term,
        year,
        receiptNo,
      },
    })

    return NextResponse.json({ success: true, fee })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}