import { PrismaClient } from '@prisma/client'
import StudentSidebar from '../components/StudentSidebar'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default async function StudentTimetable() {
  const timetable = await prisma.timetable.findMany({
    orderBy: [{ day: 'asc' }, { period: 'asc' }],
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Timetable</h1>
        <p className="text-sm text-gray-500 mb-8">Your weekly class schedule</p>

        <div className="flex flex-col gap-6">
          {DAYS.map(day => {
            const dayEntries = timetable.filter(t => t.day === day)
            return (
              <div key={day} className="bg-white rounded-2xl border overflow-hidden">
                <div className="px-6 py-3 bg-blue-50 border-b">
                  <h2 className="text-sm font-semibold text-blue-700">{day}</h2>
                </div>
                {dayEntries.length === 0 ? (
                  <p className="text-sm text-gray-400 px-6 py-4">No classes</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left px-6 py-2 text-gray-500 font-medium">Period</th>
                        <th className="text-left px-6 py-2 text-gray-500 font-medium">Subject</th>
                        <th className="text-left px-6 py-2 text-gray-500 font-medium">Teacher</th>
                        <th className="text-left px-6 py-2 text-gray-500 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayEntries.map(t => (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-6 py-3 text-gray-600">Period {t.period}</td>
                          <td className="px-6 py-3 font-medium text-gray-800">{t.subject}</td>
                          <td className="px-6 py-3 text-gray-500">{t.teacher}</td>
                          <td className="px-6 py-3 text-gray-500">{t.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}