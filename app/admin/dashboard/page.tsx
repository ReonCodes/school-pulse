import { PrismaClient } from '@prisma/client'
import Sidebar from '../components/Sidebar'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function getStats() {
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } })
  const totalStaff = await prisma.user.count({ where: { role: 'TEACHER' } })
  return { totalStudents, totalStaff }
}

export default async function AdminDashboard() {
  const { totalStudents, totalStaff } = await getStats()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">School overview at a glance</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="text-3xl font-semibold text-purple-600">{totalStudents}</p>
            <p className="text-xs text-gray-400 mt-1">Registered in system</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Staff</p>
            <p className="text-3xl font-semibold text-green-600">{totalStaff}</p>
            <p className="text-xs text-gray-400 mt-1">Active teachers</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Fees Collected</p>
            <p className="text-3xl font-semibold text-blue-600">UGX 0</p>
            <p className="text-xs text-gray-400 mt-1">This term</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Pending Fees</p>
            <p className="text-3xl font-semibold text-red-500">UGX 0</p>
            <p className="text-xs text-gray-400 mt-1">Outstanding balance</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>System initialized — 3 users seeded</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span>Admin portal configured</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Database connected to Neon PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}