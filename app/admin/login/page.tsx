'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) { setError('Invalid credentials'); setLoading(false); return }
    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.role === 'ADMIN') router.push('/admin/dashboard')
    else { setError('Not an admin account'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex flex-col justify-center w-full max-w-md px-10 bg-white">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
            <div>
              <p className="font-bold text-gray-800 leading-none">SchoolPulse</p>
              <p className="text-xs text-gray-400">Kampala, Uganda</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your details to sign in</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          <input
  type="email"
  placeholder="Admin email address"
  value={email}
  onChange={e => setEmail(e.target.value)}
  className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
/>
          <div className="relative">
  <input
  placeholder="Your password"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={e => setPassword(e.target.value)}
  className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 w-full pr-10 text-gray-900 bg-white"
/>
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3.5 text-gray-400 text-xs"
  >
    {showPassword ? 'Hide' : 'Show'}
  </button>
</div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded" />
            <label htmlFor="remember" className="text-sm text-gray-500">Remember me</label>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-purple-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-sm text-purple-500 cursor-pointer hover:underline">Forgot password?</p>
        </div>

        <p className="text-xs text-gray-300 mt-10 text-center">SchoolPulse Admin Portal</p>
      </div>

      {/* Right */}
      <div className="hidden md:flex flex-1 bg-purple-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-900 opacity-90" />
        <div className="relative z-10 text-center text-white px-8">
          <h2 className="text-4xl font-bold mb-4">Admin Portal</h2>
          <p className="text-purple-200 text-lg">Manage students, staff and school records</p>
        </div>
      </div>
    </div>
  )
}