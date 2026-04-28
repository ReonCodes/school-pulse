import { PrismaClient } from '@prisma/client'
import Sidebar from '../components/Sidebar'
import AddTimetableModal from './AddTimetableModal'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function getTimetable() {
  return await prisma.timetable.findMany({
    orderBy: [{ day: 'asc' }, { period: 'asc' }],
  })
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default async function TimetablePage() {
  const timetable = await getTimetable()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Timetable</h1>
            <p className="text-sm text-gray-500">Manage weekly class schedule</p>
          </div>
          <AddTimetableModal />
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Day</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Period</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Subject</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Teacher</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Class</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No timetable entries yet
                  </td>
                </tr>
              ) : (
                timetable.map(t => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{t.day}</td>
                    <td className="px-6 py-4 text-gray-500">Period {t.period}</td>
                    <td className="px-6 py-4 text-gray-500">{t.subject}</td>
                    <td className="px-6 py-4 text-gray-500">{t.teacher}</td>
                    <td className="px-6 py-4 text-gray-500">{t.className}</td>
                    <td className="px-6 py-4 text-gray-500">{t.time}</td>
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