'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Dashboard', href: '/student/dashboard', icon: '📊' },
  { label: 'My Results', href: '/student/results', icon: '📝' },
  { label: 'My Fees', href: '/student/fees', icon: '💰' },
  { label: 'Timetable', href: '/student/timetable', icon: '📅' },
]

export default function StudentSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-white border-r flex flex-col">
      <div className="px-6 py-5 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
        <div>
          <p className="font-semibold text-gray-800 text-sm leading-none">SchoolPulse</p>
          <p className="text-xs text-gray-400">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              pathname === link.href
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">S</div>
          <div>
            <p className="text-sm font-medium text-gray-700">Student</p>
            <p className="text-xs text-gray-400">Student Portal</p>
          </div>
        </div>
      </div>
    </div>
  )
}