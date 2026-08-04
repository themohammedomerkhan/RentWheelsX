import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Fuel, Calendar, IndianRupee } from 'lucide-react'
import { vehicleAPI } from '../api/axios'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehicleAPI.getAll()
        setVehicles(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const types = ['ALL', ...new Set(vehicles.map(v => v.type))]

  const filtered = vehicles.filter(v => {
    const matchesSearch =
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter
    return matchesSearch && matchesType
  })

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
        <h1 className="text-2xl font-bold text-gray-900">Browse Vehicles</h1>
        <p className="text-gray-500 text-sm mt-1">Find the perfect ride for your next trip</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-white"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
        >
          {types.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</option>)}
        </select>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No vehicles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover" />
                ) : (
                  <Fuel size={32} className="text-gray-300" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{v.name}</h3>
                    <p className="text-xs text-gray-500">{v.brand} · {v.type}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-brand-light text-brand-navy rounded-full">
                    {v.manufactureYear}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={12} /> <span className="truncate">{v.currentAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="flex items-center text-lg font-bold text-gray-900">
                    <IndianRupee size={16} />{v.pricePerHour}
                    <span className="text-xs font-normal text-gray-400 ml-1">/hr</span>
                  </span>
                  <Link
                    to={`/vehicles/${v.id}/book`}
                    className="text-sm font-semibold bg-brand-navy text-white px-3.5 py-2 rounded-xl hover:bg-blue-900 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}