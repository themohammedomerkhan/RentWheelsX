import React, { useEffect, useState } from 'react'
import { Check, X, Car } from 'lucide-react'
import { adminAPI } from '../../api/axios'

const approvalBadge = ({
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
})

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVehicles = async () => {
    try {
      const res = await adminAPI.getVehicles()
      setVehicles(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVehicles() }, [])

  const handleApprove = async (id) => {
    try { await adminAPI.approveVehicle(id); fetchVehicles() }
    catch (err) { setError(err.response?.data?.message || 'Failed to approve') }
  }
  const handleReject = async (id) => {
    try { await adminAPI.rejectVehicle(id); fetchVehicles() }
    catch (err) { setError(err.response?.data?.message || 'Failed to reject') }
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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Car size={22} /> Manage Vehicles</h1>
        <p className="text-gray-500 text-sm mt-1">Approve or reject vehicle listings</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Price/hr</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Approval</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{v.name} <span className="text-gray-400 font-normal">· {v.brand}</span></td>
                <td className="px-4 py-3 text-gray-600">{v.ownerName}</td>
                <td className="px-4 py-3 text-gray-600">₹{v.pricePerHour}</td>
                <td className="px-4 py-3 text-gray-600">{v.status}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${approvalBadge[v.approvalStatus]}`}>{v.approvalStatus}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {v.approvalStatus === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleApprove(v.id)} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600" title="Approve">
                        <Check size={15} />
                      </button>
                      <button onClick={() => handleReject(v.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600" title="Reject">
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}