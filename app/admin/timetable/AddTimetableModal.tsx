'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function AddTimetableModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    day: 'Monday',
    period: '1',
    subject: '',
    teacher: '',
    className: '',
    time: '',
  })

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch('/api/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        period: parseInt(form.period),
      }),
    })

    if (res.ok) {
      setOpen(false)
      setForm({ day: 'Monday', period: '1', subject: '', teacher: '', className: '', time: '' })
      router.refresh()
    } else {
      alert('Failed to save timetable entry')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
      >
        + Add Entry
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Timetable Entry</h2>

            <div className="flex flex-col gap-3">
              <select
                value={form.day}
                onChange={e => setForm({ ...form, day: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input
                placeholder="Period e.g 1"
                type="number"
                min="1"
                max="8"
                value={form.period}
                onChange={e => setForm({ ...form, period: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Subject e.g Mathematics"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Teacher name e.g Mr. Reon"
                value={form.teacher}
                onChange={e => setForm({ ...form, teacher: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Class e.g S.4A"
                value={form.className}
                onChange={e => setForm({ ...form, className: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Time e.g 8:00 AM - 9:00 AM"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}