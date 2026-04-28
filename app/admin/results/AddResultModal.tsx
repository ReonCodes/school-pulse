'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  name: string
  student: { id: string } | null
}

export default function AddResultModal({ students }: { students: Student[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    marks: '',
    term: '1',
    year: '2024',
  })

  function getGrade(marks: number) {
    if (marks >= 80) return 'A'
    if (marks >= 70) return 'B'
    if (marks >= 60) return 'C'
    if (marks >= 50) return 'D'
    return 'F'
  }

  async function handleSubmit() {
    setLoading(true)
    const marks = parseFloat(form.marks)
    const grade = getGrade(marks)

    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        marks,
        grade,
        term: parseInt(form.term),
        year: parseInt(form.year),
      }),
    })

    if (res.ok) {
      setOpen(false)
      setForm({ studentId: '', subject: '', marks: '', term: '1', year: '2024' })
      router.refresh()
    } else {
      alert('Failed to save result')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
      >
        + Add Result
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Student Result</h2>

            <div className="flex flex-col gap-3">
              <select
                value={form.studentId}
                onChange={e => setForm({ ...form, studentId: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s.id} value={s.student?.id ?? ''}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Subject e.g Mathematics"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Marks out of 100"
                type="number"
                min="0"
                max="100"
                value={form.marks}
                onChange={e => setForm({ ...form, marks: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              {form.marks && (
                <p className="text-sm text-gray-500 px-1">
                  Grade: <span className="font-semibold text-purple-600">{getGrade(parseFloat(form.marks))}</span>
                </p>
              )}
              <select
                value={form.term}
                onChange={e => setForm({ ...form, term: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
              <input
                placeholder="Year e.g 2024"
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
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
                {loading ? 'Saving...' : 'Save Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}