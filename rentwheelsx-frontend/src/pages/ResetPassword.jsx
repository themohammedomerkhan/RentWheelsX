import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

import { authAPI } from '../api/axios'
import Logo from '../components/Logo'

export default function ResetPassword() {

  const navigate = useNavigate()

  const email = localStorage.getItem("resetEmail") || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError("")
    setSuccess("")

    if (!email) {
      navigate("/forgot-password")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {

      const res = await authAPI.resetPassword({

        email,

        newPassword

      })

      setSuccess(res.data)

      localStorage.removeItem("resetEmail")

      setTimeout(() => {

        navigate("/login")

      }, 2000)

    } catch (err) {

      setError(

        err.response?.data?.message ||

        "Unable to reset password."

      )

    } finally {

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

          <div className="flex justify-center mb-5">

            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

              <CheckCircle
                size={34}
                className="text-green-600"
              />

            </div>

          </div>

          <h1 className="text-2xl font-bold text-center mb-2">

            Reset Password

          </h1>

          <p className="text-center text-gray-500 mb-8">

            Enter your new password below.

          </p>

          {

            error &&

            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">

              {error}

            </div>

          }

          {

            success &&

            <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-3 text-green-600 text-sm">

              {success}

            </div>

          }

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New Password */}

            <div>

              <label className="block text-sm font-semibold mb-2">

                New Password

              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input

                  type={showNew ? "text" : "password"}

                  value={newPassword}

                  onChange={(e)=>

                    setNewPassword(e.target.value)

                  }

                  required

                  placeholder="Enter new password"

                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-navy"

                />

                <button

                  type="button"

                  onClick={()=>

                    setShowNew(!showNew)

                  }

                  className="absolute right-3 top-3"

                >

                  {

                    showNew

                    ?

                    <EyeOff size={18}/>

                    :

                    <Eye size={18}/>

                  }

                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-semibold mb-2">

                Confirm Password

              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input

                  type={showConfirm ? "text" : "password"}

                  value={confirmPassword}

                  onChange={(e)=>

                    setConfirmPassword(e.target.value)

                  }

                  required

                  placeholder="Confirm password"

                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-navy"

                />

                <button

                  type="button"

                  onClick={()=>

                    setShowConfirm(!showConfirm)

                  }

                  className="absolute right-3 top-3"

                >

                  {

                    showConfirm

                    ?

                    <EyeOff size={18}/>

                    :

                    <Eye size={18}/>

                  }

                </button>

              </div>

            </div>

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-brand-navy text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 disabled:opacity-60"

            >

              {

                loading

                ?

                "Updating..."

                :

                <>

                  Update Password

                  <ArrowRight size={18}/>

                </>

              }

            </button>

          </form>

          <p className="text-center mt-8">

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