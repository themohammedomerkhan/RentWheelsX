import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, IndianRupee, MapPin } from 'lucide-react'
import { vehicleAPI, bookingAPI } from '../api/axios'

const RATE_HOURS = { HOUR: 1, DAY: 24, MONTH: 24 * 30 }

export default function BookVehicle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [rentalType, setRentalType] = useState('DAY')
  const [duration, setDuration] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await vehicleAPI.getById(id)
        setVehicle(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Vehicle not found')
      } finally {
        setPageLoading(false)
      }
    }
    fetchVehicle()
  }, [id])

  const estimatedTotal = vehicle
    ? (vehicle.pricePerHour * duration * RATE_HOURS[rentalType]).toFixed(2)
    : 0

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  if (!startDate) { setError('Please select a start date/time'); return }
  setLoading(true)
  try {
    const res = await bookingAPI.create({
      vehicleId: parseInt(id, 10),
      rentalType,
      duration: parseInt(duration, 10),
      startDate: startDate.length === 16 ? `${startDate}:00` : startDate, // "2026-08-05T02:00:00"
    })
    const booking = res.data.data
    navigate(`/bookings/${booking.id}/payment`)
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create booking')
  } finally {
    setLoading(false)
  }
}

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-navy border-t-brand-orange rounded-full animate-spin" />
      </div>
    )
  }

  if (!vehicle) {
    return <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error || 'Vehicle not found'}</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book {vehicle.name}</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><MapPin size={13} /> {vehicle.currentAddress}</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rental Type</label>
            <select value={rentalType} onChange={(e) => setRentalType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50">
              <option value="HOUR">Hourly</option>
              <option value="DAY">Daily</option>
              <option value="MONTH">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Duration ({rentalType === 'HOUR' ? 'hours' : rentalType === 'DAY' ? 'days' : 'months'})
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date & Time</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-brand-light rounded-xl">
          <span className="text-sm font-semibold text-gray-700">Estimated Total</span>
          <span className="flex items-center text-xl font-bold text-brand-navy">
            <IndianRupee size={18} />{estimatedTotal}
          </span>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-60 shadow-lg shadow-brand-navy/20">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Continue to Payment'}
        </button>
      </form>
    </div>
  )
}