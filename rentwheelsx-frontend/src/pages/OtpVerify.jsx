import React, { useState, useRef, useEffect } from 'react'
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

  const [countdown, setCountdown] = useState(60)

  const refs = useRef([])

  const email = localStorage.getItem("pendingEmail") || ""

  useEffect(() => {

    if (!email) {
      navigate("/signup")
    }

  }, [])

  useEffect(() => {

    if (countdown <= 0) return

    const timer = setInterval(() => {

      setCountdown(prev => prev - 1)

    }, 1000)

    return () => clearInterval(timer)

  }, [countdown])

  const handleChange = (index, value) => {

    if (!/^\d?$/.test(value)) return

    const copy = [...otp]

    copy[index] = value

    setOtp(copy)

    if (value && index < 5) {
      refs.current[index + 1]?.focus()
    }

  }

  const handleKeyDown = (index, e) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }

  }

  const handlePaste = (e) => {

    e.preventDefault()

    const value = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)

    const copy = [...otp]

    value.split("").forEach((char, i) => {

      copy[i] = char

    })

    setOtp(copy)

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    const code = otp.join("")

    if (code.length !== 6) {

      setError("Please enter a valid 6-digit OTP.")

      return

    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {

      const response = await authAPI.verifyOtp({

        email,

        otp: code

      })

      const { token, user } = response.data.data

      login(user, token)

      localStorage.removeItem("pendingEmail")

      navigate("/dashboard")

    } catch (err) {

      setError(

        err.response?.data?.message ||

        "OTP verification failed."

      )

    } finally {

      setLoading(false)

    }

  }

  const handleResend = async () => {

    setResending(true)

    setError("")
    setSuccess("")

    try {

      await authAPI.resendOtp({

        email

      })

      setSuccess("A new OTP has been sent to your email.")

      setOtp(['', '', '', '', '', ''])

      refs.current[0]?.focus()

      setCountdown(60)

    } catch (err) {

      setError(

        err.response?.data?.message ||

        "Unable to resend OTP."

      )

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

          <div className="w-14 h-14 rounded-2xl bg-brand-navy/10 flex items-center justify-center mx-auto mb-5">

            <ShieldCheck
              size={28}
              className="text-brand-navy"
            />

          </div>

          <h1 className="text-2xl font-bold mb-2">

            Verify Your Email

          </h1>

          <p className="text-gray-500 text-sm">

            We've sent a verification code to

          </p>

          <p className="font-semibold text-brand-navy mb-8">

            {email}

          </p>

          {error && (

            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">

              {error}

            </div>

          )}

          {success && (

            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">

              {success}

            </div>

          )}

          <form onSubmit={handleSubmit}>

            <div
              className="flex justify-center gap-2 mb-8"
              onPaste={handlePaste}
            >

              {otp.map((digit, index) => (

                <input

                  key={index}

                  ref={el => refs.current[index] = el}

                  type="text"

                  inputMode="numeric"

                  maxLength={1}

                  value={digit}

                  onChange={(e) =>

                    handleChange(index, e.target.value)

                  }

                  onKeyDown={(e) =>

                    handleKeyDown(index, e)

                  }

                  className="w-11 h-14 rounded-xl border-2 border-gray-200 bg-gray-50 text-center text-xl font-bold focus:outline-none focus:border-brand-navy"

                />

              ))}

            </div>

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-brand-navy text-white py-3 rounded-xl font-semibold hover:bg-blue-900 disabled:opacity-60"

            >

              {

                loading

                  ? "Verifying..."

                  : "Verify OTP"

              }

            </button>

          </form>

          <div className="mt-5">

            {

              countdown > 0 ?

                <p className="text-sm text-gray-500">

                  Resend OTP in

                  <span className="font-semibold text-brand-orange">

                    {" "} {countdown}s

                  </span>

                </p>

                :

                <button

                  onClick={handleResend}

                  disabled={resending}

                  className="flex items-center gap-2 mx-auto text-brand-navy hover:text-brand-orange"

                >

                  <RefreshCw

                    size={16}

                    className={resending ? "animate-spin" : ""}

                  />

                  {

                    resending

                      ? "Sending..."

                      : "Resend OTP"

                  }

                </button>

            }

          </div>

        </div>

      </div>

    </div>

  )

}