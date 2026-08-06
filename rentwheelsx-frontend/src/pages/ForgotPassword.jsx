import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'
import { authAPI } from '../api/axios'
import Logo from '../components/Logo'

export default function ForgotPassword() {

  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  //-------------------------------------------------------
  // STEP 1
  //-------------------------------------------------------

  const sendOtp = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {

      const res = await authAPI.forgotPassword({

        email

      })

      setSuccess(res.data)

      localStorage.setItem("resetEmail", email)

      setStep(2)

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Unable to send OTP."

      )

    }
    finally {

      setLoading(false)

    }

  }

  //-------------------------------------------------------
  // STEP 2
  //-------------------------------------------------------

  const verifyOtp = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {

      const res = await authAPI.verifyResetOtp({

        email,

        otp

      })

      setSuccess(res.data)

      navigate("/reset-password")

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Invalid OTP."

      )

    }
    finally {

      setLoading(false)

    }

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">

            Forgot Password

          </h1>

          <p className="text-center text-gray-500 mb-8">

            {

              step === 1

                ?

                "Enter your registered email address."

                :

                "Enter the OTP sent to your email."

            }

          </p>

          {

            error &&

            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">

              {error}

            </div>

          }

          {

            success &&

            <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-green-600 text-sm">

              {success}

            </div>

          }

          {

            step === 1 &&

            <form onSubmit={sendOtp} className="space-y-5">

              <div>

                <label className="block text-sm font-semibold mb-2">

                  Email Address

                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input

                    type="email"

                    required

                    value={email}

                    onChange={(e) =>

                      setEmail(e.target.value)

                    }

                    placeholder="you@example.com"

                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-navy"

                  />

                </div>

              </div>

              <button

                disabled={loading}

                className="w-full bg-brand-navy text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"

              >

                {

                  loading

                    ?

                    "Sending..."

                    :

                    <>

                      Send OTP

                      <ArrowRight size={18}/>

                    </>

                }

              </button>

            </form>

          }

          {

            step === 2 &&

            <form onSubmit={verifyOtp} className="space-y-5">

              <div>

                <label className="block text-sm font-semibold mb-2">

                  Enter OTP

                </label>

                <div className="relative">

                  <ShieldCheck
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input

                    type="text"

                    maxLength={6}

                    required

                    value={otp}

                    onChange={(e)=>

                      setOtp(e.target.value)

                    }

                    placeholder="6-digit OTP"

                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-navy"

                  />

                </div>

              </div>

              <button

                disabled={loading}

                className="w-full bg-brand-navy text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"

              >

                {

                  loading

                    ?

                    "Verifying..."

                    :

                    <>

                      Verify OTP

                      <ArrowRight size={18}/>

                    </>

                }

              </button>

            </form>

          }

          <p className="text-center text-sm mt-8">

            <Link

              to="/login"

              className="text-brand-orange font-semibold hover:underline"

            >

              Back to Login

            </Link>

          </p>

        </div>

      </div>

    </div>

  )

}