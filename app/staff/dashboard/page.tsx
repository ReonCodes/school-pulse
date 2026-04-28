import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StaffSidebar from '../components/StaffSidebar'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? '' },
    include: {
      staff: true,
    },
  })

  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } })
  const totalResults = await prisma.result.count()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />

      <div className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mb-8">Staff dashboard overview</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="text-3xl font-semibold text-green-600">{totalStudents}</p>
            <p className="text-xs text-gray-400 mt-1">Registered in system</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Results Entered</p>
            <p className="text-3xl font-semibold text-purple-600">{totalResults}</p>
            <p className="text-xs text-gray-400 mt-1">Total marks recorded</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Your Subject</p>
            <p className="text-xl font-semibold text-green-600">{user?.staff?.subject ?? '—'}</p>
            <p className="text-xs text-gray-400 mt-1">Assigned subject</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Your Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Staff Number</p>
              <p className="font-medium text-gray-800">{user?.staff?.staffNo ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="font-medium text-gray-800">{user?.staff?.subject ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}