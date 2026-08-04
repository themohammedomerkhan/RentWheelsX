import React, { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { adminAPI } from '../../api/axios'

const rideBadge = ({
  UPCOMING: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
})

const payBadge = ({
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
})

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await adminAPI.getBookings()
        setBookings(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ClipboardList size={22} /> Manage Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">All bookings across the platform</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Rental</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Ride Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{b.userName}</td>
                <td className="px-4 py-3 text-gray-600">{b.vehicleName}</td>
                <td className="px-4 py-3 text-gray-600">{b.rentalType} · {b.duration}</td>
                <td className="px-4 py-3 text-gray-600">₹{b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payBadge[b.paymentStatus]}`}>{b.paymentStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rideBadge[b.rideStatus]}`}>{b.rideStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}