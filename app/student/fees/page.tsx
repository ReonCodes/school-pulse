import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StudentSidebar from '../components/StudentSidebar'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default async function StudentFees() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? '' },
    include: {
      student: {
        include: { feeRecords: true },
      },
    },
  })

  const fees = user?.student?.feeRecords ?? []
  const total = fees.reduce((sum, f) => sum + f.amount, 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">My Fees</h1>
        <p className="text-sm text-gray-500 mb-8">Your payment history</p>

        {/* Summary */}
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">Total Paid</p>
          <p className="text-3xl font-semibold text-blue-600">UGX {total.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Term</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Year</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No payments recorded yet
                  </td>
                </tr>
              ) : (
                fees.map(f => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">UGX {f.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">Term {f.term}</td>
                    <td className="px-6 py-4 text-gray-500">{f.year}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(f.paidAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-500">{f.receiptNo ?? '—'}</td>
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