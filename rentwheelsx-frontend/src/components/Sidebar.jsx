import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Car, PlusCircle, List, CalendarCheck,
  ShieldCheck, Users, ClipboardList, LogOut, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Browse Vehicles', icon: Car, to: '/vehicles' },
  { label: 'Add Vehicle', icon: PlusCircle, to: '/vehicles/add' },
  { label: 'My Vehicles', icon: List, to: '/vehicles/my' },
  { label: 'My Bookings', icon: CalendarCheck, to: '/bookings' },
]

const adminItems = [
  { label: 'Admin Panel', icon: ShieldCheck, to: '/admin' },
  { label: 'Manage Vehicles', icon: Car, to: '/admin/vehicles' },
  { label: 'Manage Users', icon: Users, to: '/admin/users' },
  { label: 'Manage Bookings', icon: ClipboardList, to: '/admin/bookings' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-brand-navy text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } ${collapsed ? 'justify-center' : ''}`

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-200 shadow-xl
          flex flex-col transition-all duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!collapsed && <Logo size="sm" />}
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} className={linkClass} onClick={onClose}>
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}

          {isAdmin() && (
            <>
              <div className={`pt-3 pb-1 ${collapsed ? 'hidden' : ''}`}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">Admin</p>
              </div>
              {!collapsed && <div className="border-t border-gray-100 mb-1" />}
              {adminItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-gray-100">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-gray-50 mb-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-navy to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}