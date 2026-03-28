import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { authAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function OtpVerify() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const refs = useRef([])

  const email = localStorage.getItem('pendingEmail') || ''

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    text.split('').forEach((c, i) => { next[i] = c })
    setOtp(next)
    refs.current[Math.min(text.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the 6-digit OTP'); return }
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.verifyOtp({ email, otp: code })
      const { token, user } = res.data
      login(user, token)
      localStorage.removeItem('pendingEmail')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await authAPI.resendOtp({ email })
      setSuccess('OTP resent to your email!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <div className="w-14 h-14 bg-brand-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-brand-navy" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify Your Email</h1>
          <p className="text-gray-500 text-sm mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-brand-navy font-semibold text-sm mb-8">{email}</p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-8" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy transition-colors bg-gray-50"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-60 shadow-lg shadow-brand-navy/20 mb-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Verify OTP'}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-2 mx-auto text-sm text-gray-500 hover:text-brand-navy transition-colors"
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  )
}