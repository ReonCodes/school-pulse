import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StudentSidebar from '../components/StudentSidebar'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? '' },
    include: {
      student: {
        include: {
          feeRecords: true,
          results: true,
        },
      },
    },
  })

  const totalFees = user?.student?.feeRecords.reduce((sum, f) => sum + f.amount, 0) ?? 0
  const totalResults = user?.student?.results.length ?? 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mb-8">Here is your academic overview</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Fees Paid</p>
            <p className="text-3xl font-semibold text-blue-600">UGX {totalFees.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Total paid this year</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Results</p>
            <p className="text-3xl font-semibold text-purple-600">{totalResults}</p>
            <p className="text-xs text-gray-400 mt-1">Subjects with marks</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Admission No</p>
            <p className="text-2xl font-semibold text-green-600">{user?.student?.admissionNo ?? '—'}</p>
            <p className="text-xs text-gray-400 mt-1">Your student ID</p>
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Results</h2>
          {user?.student?.results.length === 0 ? (
            <p className="text-sm text-gray-400">No results yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 text-gray-500 font-medium">Subject</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Marks</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Grade</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Term</th>
                </tr>
              </thead>
              <tbody>
                {user?.student?.results.map(r => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-800">{r.subject}</td>
                    <td className="py-3 text-gray-600">{r.marks}/100</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.grade === 'A' ? 'bg-green-50 text-green-700' :
                        r.grade === 'B' ? 'bg-blue-50 text-blue-700' :
                        r.grade === 'C' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>{r.grade}</span>
                    </td>
                    <td className="py-3 text-gray-500">Term {r.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}