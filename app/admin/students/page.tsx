import { PrismaClient } from '@prisma/client'
import Sidebar from '../components/Sidebar'
import AddStudentModal from './AddStudentModal'
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function getStudents() {
  return await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { student: true },
  })
}

export default async function StudentsPage() {
  const students = await getStudents()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Students</h1>
            <p className="text-sm text-gray-500">Manage all registered students</p>
          </div>
          <AddStudentModal />
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Admission No</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    No students registered yet
                  </td>
                </tr>
              ) : (
                students.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                    <td className="px-6 py-4 text-gray-500">{s.email}</td>
                    <td className="px-6 py-4 text-gray-500">{s.student?.admissionNo ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}