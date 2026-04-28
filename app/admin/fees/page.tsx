import { PrismaClient } from '@prisma/client'
import Sidebar from '../components/Sidebar'
import AddFeeModal from './AddFeeModal'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function getFees() {
  return await prisma.feeRecord.findMany({
    include: {
      student: {
        include: { user: true },
      },
    },
    orderBy: { paidAt: 'desc' },
  })
}

async function getStudents() {
  return await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { student: true },
  })
}

export default async function FeesPage() {
  const fees = await getFees()
  const students = await getStudents()

  const totalCollected = fees.reduce((sum, f) => sum + f.amount, 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Fees</h1>
            <p className="text-sm text-gray-500">Track and record student payments</p>
          </div>
          <AddFeeModal students={students} />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Collected</p>
            <p className="text-3xl font-semibold text-blue-600">UGX {totalCollected.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Payments</p>
            <p className="text-3xl font-semibold text-purple-600">{fees.length}</p>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="text-3xl font-semibold text-green-600">{students.length}</p>
          </div>
        </div>

        {/* Fees Table */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Term</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Year</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Date Paid</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Receipt No</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No payments recorded yet
                  </td>
                </tr>
              ) : (
                fees.map(f => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{f.student.user.name}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">UGX {f.amount.toLocaleString()}</td>
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