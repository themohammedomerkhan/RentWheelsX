import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Users, ClipboardList, IndianRupee, ArrowRight } from 'lucide-react'
import { adminAPI } from '../../api/axios'

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vRes, uRes, bRes] = await Promise.all([
          adminAPI.getVehicles(), adminAPI.getUsers(), adminAPI.getBookings(),
        ])
        setVehicles(vRes.data.data || [])
        setUsers(uRes.data.data || [])
        setBookings(bRes.data.data || [])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const pendingApprovals = vehicles.filter(v => v.approvalStatus === 'PENDING').length
  const revenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + Number(b.totalPrice), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-navy border-t-brand-orange rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Car} label="Total Vehicles" value={vehicles.length} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={ClipboardList} label="Pending Approvals" value={pendingApprovals} color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard icon={Users} label="Total Users" value={users.length} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={IndianRupee} label="Revenue (Paid)" value={`₹${revenue.toFixed(0)}`} color="text-green-600" bg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/vehicles" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <span className="font-semibold text-gray-800">Manage Vehicles</span><ArrowRight size={16} className="text-gray-400" />
        </Link>
        <Link to="/admin/users" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <span className="font-semibold text-gray-800">Manage Users</span><ArrowRight size={16} className="text-gray-400" />
        </Link>
        <Link to="/admin/bookings" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <span className="font-semibold text-gray-800">Manage Bookings</span><ArrowRight size={16} className="text-gray-400" />
        </Link>
      </div>
    </div>
  )
}