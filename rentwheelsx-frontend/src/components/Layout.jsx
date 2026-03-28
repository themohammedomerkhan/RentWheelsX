import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuToggle={() => setSidebarOpen(true)} />
      <main className="lg:ml-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}