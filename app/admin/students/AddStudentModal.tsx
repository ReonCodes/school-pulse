'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddStudentModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    admissionNo: '',
    parentPhone: '',
  })

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setOpen(false)
      setForm({ name: '', email: '', password: '', admissionNo: '', parentPhone: '' })
      router.refresh()
    } else {
      alert('Failed to add student')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
      >
        + Add Student
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Student</h2>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="relative">
  <input
    placeholder="Password"
    type={showPassword ? 'text' : 'password'}
    value={form.password}
    onChange={e => setForm({ ...form, password: e.target.value })}
    className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 w-full pr-10"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2.5 text-gray-400 text-xs"
  >
    {showPassword ? 'Hide' : 'Show'}
  </button>
</div>
              <input
                placeholder="Admission number e.g ADM-2024-002"
                value={form.admissionNo}
                onChange={e => setForm({ ...form, admissionNo: e.target.value })}
                className="border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                placeholder="Parent phone e.g 0700000000"
                value={form.parentPhone}
                onChange={e => setForm({ ...form, parentPhone: e.target.value })}
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
                {loading ? 'Saving...' : 'Save Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}