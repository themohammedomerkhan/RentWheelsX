import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Login from './pages/Login'
import Signup from './pages/Signup'
import OtpVerify from './pages/OtpVerify'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import AddVehicle from './pages/AddVehicle'
import MyVehicles from './pages/MyVehicles'
import BookVehicle from './pages/BookVehicle'
import MyBookings from './pages/MyBookings'
import Payment from './pages/Payment'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVehicles from './pages/admin/AdminVehicles'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/add" element={<AddVehicle />} />
              <Route path="/vehicles/my" element={<MyVehicles />} />
              <Route path="/vehicles/:id/book" element={<BookVehicle />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/bookings/:id/payment" element={<Payment />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/vehicles" element={<AdminVehicles />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}