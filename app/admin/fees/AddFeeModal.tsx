'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  name: string
  student: { id: string } | null
}

export default function AddFeeModal({ students }: { students: Student[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    studentId: '',
    amount: '',
    term: '1',
    year: '2024',
    receiptNo: '',
  })

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch('/api/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount),
        term: parseInt(form.term),
        year: parseInt(form.year),
      }),
    })

    if (res.ok) {
      setOpen(false)
      setForm({ studentId: '', amount: '', term: '1', year: '2024', receiptNo: '' })
      router.refresh()
    } else {
      alert('Failed to record payment')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        + Record Payment
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Record Fee Payment</h2>

            <div className="flex flex-col gap-3">
              <select
                value={form.studentId}
                onChange={e => setForm({ ...form, studentId: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s.id} value={s.student?.id ?? ''}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Amount in UGX"
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.term}
                onChange={e => setForm({ ...form, term: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Receipt number (optional)"
                value={form.receiptNo}
                onChange={e => setForm({ ...form, receiptNo: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}