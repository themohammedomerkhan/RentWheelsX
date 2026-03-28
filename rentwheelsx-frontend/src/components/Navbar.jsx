import React from 'react'
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
        >
          <Menu size={20} />
        </button>
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-navy to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </header>
  )
}