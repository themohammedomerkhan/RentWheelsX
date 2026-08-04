import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Power, Trash2, Plus, MapPin } from 'lucide-react'
import { vehicleAPI } from '../api/axios'

const statusBadge = (status) =>
  status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'

const approvalBadge = (status) => ({
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-600')

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVehicles = async () => {
    try {
      const res = await vehicleAPI.getMine()
      setVehicles(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVehicles() }, [])

  const handleToggle = async (id) => {
    try {
      await vehicleAPI.toggleStatus(id)
      fetchVehicles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle permanently?')) return
    try {
      await vehicleAPI.delete(id)
      fetchVehicles()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your listed vehicles</p>
        </div>
        <Link to="/vehicles/add" className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md shadow-brand-navy/20">
          <Plus size={16} /> Add Vehicle
        </Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {vehicles.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <Car size={32} className="mx-auto mb-2 opacity-40" />
          <p>No vehicles listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{v.name}</h3>
                  <p className="text-xs text-gray-500">{v.brand} · {v.type} · {v.manufactureYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={12} /><span className="truncate">{v.currentAddress}</span>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(v.status)}`}>{v.status}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${approvalBadge(v.approvalStatus)}`}>{v.approvalStatus}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">₹{v.pricePerHour}/hr</span>
                <div className="flex gap-2">
                  <button onClick={() => handleToggle(v.id)} title="Toggle status"
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600">
                    <Power size={15} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} title="Delete"
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}