import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CreditCard, CheckCircle2, Phone, User, MapPin } from 'lucide-react'
import { bookingAPI } from '../api/axios'

export default function Payment() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [paid, setPaid] = useState(false)

  const fetchBooking = async () => {
    try {
      const res = await bookingAPI.getById(id)
      setBooking(res.data.data)
      if (res.data.data.paymentStatus === 'PAID') setPaid(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooking() }, [id])

  const handlePay = async () => {
    setPaying(true)
    setError('')
    try {
      const res = await bookingAPI.pay(id)
      setBooking(res.data.data)
      setPaid(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-navy border-t-brand-orange rounded-full animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {!paid ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-brand-navy" />
              <h1 className="text-xl font-bold text-gray-900">Complete Payment</h1>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-semibold">{booking.vehicleName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Rental</span><span className="font-semibold">{booking.rentalType} · {booking.duration}</span></div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-700 font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-brand-navy">₹{booking.totalPrice}</span>
              </div>
            </div>

            <button onClick={handlePay} disabled={paying}
              className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-3 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60 shadow-lg shadow-brand-orange/20">
              {paying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : `Pay ₹${booking.totalPrice}`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Simulated payment — no real transaction will occur</p>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</h1>
            <p className="text-gray-500 text-sm mb-6">Transaction ID: {booking.transactionId}</p>

            <div className="text-left bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Owner Contact Details</p>
              <div className="flex items-center gap-2 text-sm"><User size={14} className="text-gray-400" /> {booking.ownerName}</div>
              <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-gray-400" /> {booking.ownerMobile}</div>
              <div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-gray-400" /> {booking.ownerAddress}</div>
            </div>

            <Link to="/bookings" className="inline-block w-full text-center bg-brand-navy text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors">
              View My Bookings
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}