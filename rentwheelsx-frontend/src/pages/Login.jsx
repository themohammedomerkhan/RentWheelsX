import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Login() {

  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError("")
    setLoading(true)

    try {

      const response = await authAPI.login(form)

      const { token, user } = response.data.data

      login(user, token)

      navigate("/dashboard")

    } catch (err) {

      const message =
        err.response?.data?.message || "Login failed."

      if (message.includes("Account not verified")) {

        localStorage.setItem("pendingEmail", form.email)

        navigate("/verify-otp")

        return

      }

      setError(message)

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

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
            Welcome back
          </h1>

          <p className="text-gray-500 text-center text-sm mb-8">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                />

              </div>

            </div>

            <div>

              <div className="flex justify-between items-center mb-1.5">

                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-orange hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              <div className="relative">

                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >

                  {showPass ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white py-3 rounded-xl font-semibold"
            >

              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}

            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">

            Don't have an account?

            <Link
              to="/signup"
              className="ml-1 text-brand-orange font-semibold hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  )

}