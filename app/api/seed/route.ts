import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const adminPass = await bcrypt.hash('admin123', 10)
    const teacherPass = await bcrypt.hash('teacher123', 10)
    const studentPass = await bcrypt.hash('student123', 10)

    await prisma.user.upsert({
      where: { email: 'admin@schoolpulse.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@schoolpulse.com',
        password: adminPass,
        role: 'ADMIN',
      },
    })

    await prisma.user.upsert({
      where: { email: 'teacher@schoolpulse.com' },
      update: {},
      create: {
        name: 'Mr. Reon',
        email: 'teacher@schoolpulse.com',
        password: teacherPass,
        role: 'TEACHER',
        staff: { create: { staffNo: 'STF-001', subject: 'Mathematics' } },
      },
    })

    await prisma.user.upsert({
      where: { email: 'student@schoolpulse.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'student@schoolpulse.com',
        password: studentPass,
        role: 'STUDENT',
        student: { create: { admissionNo: 'ADM-2024-001' } },
      },
    })

    return NextResponse.json({ message: '✅ Seeded: admin, teacher, student' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}