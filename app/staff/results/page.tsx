import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StaffSidebar from '../components/StaffSidebar'
import AddResultModal from './AddResultModal'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function getResults() {
  return await prisma.result.findMany({
    include: {
      student: {
        include: { user: true },
      },
    },
    orderBy: { year: 'desc' },
  })
}

async function getStudents() {
  return await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { student: true },
  })
}

export default async function StaffResults() {
  const results = await getResults()
  const students = await getStudents()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />

      <div className="flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Results</h1>
            <p className="text-sm text-gray-500">Enter and manage student marks</p>
          </div>
          <AddResultModal students={students} />
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Subject</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Marks</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Grade</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Term</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Year</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No results entered yet
                  </td>
                </tr>
              ) : (
                results.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{r.student.user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{r.subject}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{r.marks}/100</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.grade === 'A' ? 'bg-green-50 text-green-700' :
                        r.grade === 'B' ? 'bg-blue-50 text-blue-700' :
                        r.grade === 'C' ? 'bg-yellow-50 text-yellow-700' :
                        r.grade === 'D' ? 'bg-orange-50 text-orange-700' :
                        'bg-red-50 text-red-700'
                      }`}>{r.grade}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">Term {r.term}</td>
                    <td className="px-6 py-4 text-gray-500">{r.year}</td>
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