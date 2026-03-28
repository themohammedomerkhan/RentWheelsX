import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authAPI } from '../api/axios'
import Logo from '../components/Logo'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.signup(form)
      localStorage.setItem('pendingEmail', form.email)
      navigate('/verify-otp')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Full Name', name: 'name', type: 'text', icon: User, placeholder: 'John Doe' },
    { label: 'Email Address', name: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { label: 'Phone Number', name: 'phone', type: 'tel', icon: Phone, placeholder: '+91 9876543210' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Create Account</h1>
          <p className="text-gray-500 text-center text-sm mb-8">Join RentWheelsX and start renting</p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <f.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    required
                    placeholder={f.placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors bg-gray-50"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors bg-gray-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-60 shadow-lg shadow-brand-navy/20 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}