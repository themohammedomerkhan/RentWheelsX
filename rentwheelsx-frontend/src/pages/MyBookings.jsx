import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, IndianRupee } from 'lucide-react'
import { bookingAPI } from '../api/axios'

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

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMine()
      setBookings(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingAPI.cancel(id)
      fetchBookings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking')
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage your rentals</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <CalendarCheck size={32} className="mx-auto mb-2 opacity-40" />
          <p>No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900">{b.vehicleName}</h3>
                <p className="text-xs text-gray-500">
                  {b.rentalType} · {b.duration} {b.rentalType === 'HOUR' ? 'hrs' : b.rentalType === 'DAY' ? 'days' : 'months'} ·
                  Starts {new Date(b.startDate).toLocaleString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rideBadge[b.rideStatus]}`}>{b.rideStatus}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payBadge[b.paymentStatus]}`}>{b.paymentStatus}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center font-bold text-gray-900"><IndianRupee size={15} />{b.totalPrice}</span>
                {b.paymentStatus === 'PENDING' && b.rideStatus !== 'CANCELLED' && (
                  <Link to={`/bookings/${b.id}/payment`} className="text-sm font-semibold bg-brand-navy text-white px-3.5 py-2 rounded-xl hover:bg-blue-900 transition-colors">
                    Pay Now
                  </Link>
                )}
                {b.paymentStatus === 'PENDING' && b.rideStatus !== 'CANCELLED' && (
                  <button onClick={() => handleCancel(b.id)} className="text-sm font-semibold text-red-600 hover:underline">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}