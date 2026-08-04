import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, CalendarCheck, DollarSign, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import { vehicleAPI, bookingAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

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

export default function Dashboard() {
  const { user } = useAuth()
  const [myVehicles, setMyVehicles] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, bRes] = await Promise.all([
          vehicleAPI.getMine(),
          bookingAPI.getMine(),
        ])
        setMyVehicles(vRes.data.data || [])
        setMyBookings(bRes.data.data || [])
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeVehicles = myVehicles.filter(v => v.status === 'ACTIVE').length
  const paidBookings = myBookings.filter(b => b.paymentStatus === 'PAID').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-navy border-t-brand-orange rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your account</p>
        </div>
        <Link
          to="/vehicles/add"
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md shadow-brand-navy/20"
        >
          <Plus size={16} /> Add Vehicle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Car} label="My Vehicles" value={myVehicles.length} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={TrendingUp} label="Active Vehicles" value={activeVehicles} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={myBookings.length} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={DollarSign} label="Paid Bookings" value={paidBookings} color="text-orange-500" bg="bg-orange-50" />
      </div>

      {/* Recent Bookings & Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-brand-navy font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {myBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CalendarCheck size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.slice(0, 4).map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{b.vehicleName || 'Vehicle'}</p>
                    <p className="text-xs text-gray-500">
                      {b.rentalType} · {b.duration} {b.rentalType === 'HOUR' ? 'hrs' : b.rentalType === 'DAY' ? 'days' : 'months'}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    b.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                    b.rideStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.paymentStatus === 'PAID' ? 'Paid' : b.rideStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">My Vehicles</h2>
            <Link to="/vehicles/my" className="text-sm text-brand-navy font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {myVehicles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Car size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No vehicles listed yet</p>
              <Link to="/vehicles/add" className="mt-3 inline-block text-sm text-brand-navy font-medium hover:underline">
                + Add your first vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myVehicles.slice(0, 4).map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {v.name} <span className="text-gray-400 font-normal">· {v.type}</span>
                    </p>
                    <p className="text-xs text-gray-500">₹{v.pricePerHour}/hr · {v.currentAddress}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    v.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    v.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {v.status === 'ACTIVE' ? 'Active' : v.approvalStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
