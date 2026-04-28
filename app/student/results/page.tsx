import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StudentSidebar from '../components/StudentSidebar'
import ReportCard from '../components/ReportCard'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default async function StudentResults() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? '' },
    include: {
      student: {
        include: { results: true },
      },
    },
  })

  const results = user?.student?.results ?? []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">My Results</h1>
        <p className="text-sm text-gray-500 mb-8">Your academic performance</p>

        <div className="bg-white rounded-2xl border overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
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
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No results yet
                  </td>
                </tr>
              ) : (
                results.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{r.subject}</td>
                    <td className="px-6 py-4 text-gray-600">{r.marks}/100</td>
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

        {results.length > 0 && (
          <ReportCard
            name={user?.name ?? ''}
            admissionNo={user?.student?.admissionNo ?? ''}
            results={results}
          />
        )}
      </div>
    </div>
  )
}