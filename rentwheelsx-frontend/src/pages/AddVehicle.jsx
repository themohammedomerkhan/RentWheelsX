import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,
  MapPin,
  IndianRupee,
  Video,
  Image as ImageIcon,
  Navigation
} from 'lucide-react'
import { vehicleAPI } from '../api/axios'

const VEHICLE_TYPES = ['CAR', 'BIKE', 'SUV', 'VAN', 'TRUCK', 'SCOOTER']

export default function AddVehicle() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    brand: '',
    type: 'CAR',
    manufactureYear: new Date().getFullYear(),
    vehicleNumber: '',
    pricePerHour: '',
    currentAddress: '',
    mobileNumber: '',
    latitude: '',
    longitude: '',
    images: '',
    videoUrl: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const useMyLocation = () => {

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }))

      },
      () => {
        setError('Unable to get your current location.')
      }
    )
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)

    try {

      const payload = {
        ...form,

        manufactureYear:
          parseInt(form.manufactureYear, 10),

        pricePerHour:
          parseFloat(form.pricePerHour),

        latitude:
          parseFloat(form.latitude),

        longitude:
          parseFloat(form.longitude),

        images: form.images
          ? form.images
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
      }

      await vehicleAPI.add(payload)

      navigate('/vehicles/my')

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to add vehicle'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="max-w-2xl mx-auto space-y-6">

      <div>

        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Car size={22} />
          Add Vehicle
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          List your vehicle for rental — pending admin approval
        </p>

      </div>


      {error && (

        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>

      )}


      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
      >


        {/* Vehicle Basic Information */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Vehicle Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Swift Dzire"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Brand
            </label>

            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
              placeholder="Maruti Suzuki"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            >

              {VEHICLE_TYPES.map(t => (

                <option
                  key={t}
                  value={t}
                >
                  {t}
                </option>

              ))}

            </select>

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Manufacture Year
            </label>

            <input
              type="number"
              name="manufactureYear"
              value={form.manufactureYear}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Vehicle Number
            </label>

            <input
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              required
              placeholder="TS09AB1234"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Price per Hour
            </label>

            <div className="relative">

              <IndianRupee
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="number"
                step="0.01"
                name="pricePerHour"
                value={form.pricePerHour}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
              />

            </div>

          </div>

        </div>


        {/* Address */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Current Address
          </label>

          <div className="relative">

            <MapPin
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              name="currentAddress"
              value={form.currentAddress}
              onChange={handleChange}
              required
              placeholder="Hyderabad, Telangana"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>

        </div>


        {/* Contact and Location */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mobile Number
            </label>

            <input
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              required
              placeholder="9876543210"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>


          <div className="flex items-end">

            <button
              type="button"
              onClick={useMyLocation}
              className="flex items-center gap-1.5 text-sm text-brand-navy font-medium hover:underline"
            >

              <Navigation size={14} />

              Use my current location

            </button>

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>


          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
            />

          </div>

        </div>


        {/* Images */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">

            <ImageIcon size={14} />

            Image URLs (comma-separated)

          </label>

          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="Paste image URLs separated by commas"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
          />

          <p className="text-xs text-gray-500 mt-1.5">
            You can paste image URLs copied from Google Images on mobile or desktop.
          </p>

        </div>


        {/* Video */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">

            <Video size={14} />

            Video URL

          </label>

          <input
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            required
            placeholder="https://.../video.mp4"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 bg-gray-50"
          />

        </div>


        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-60 shadow-lg shadow-brand-navy/20"
        >

          {loading ? (

            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

          ) : (

            'Submit for Approval'

          )}

        </button>

      </form>

    </div>

  )
}