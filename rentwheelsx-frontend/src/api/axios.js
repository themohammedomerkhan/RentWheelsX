import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:9000/api',
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {

  signup: (data) =>
    API.post("/auth/signup", data),

  login: (data) =>
    API.post("/auth/login", data),

  verifyOtp: (data) =>
    API.post("/auth/verify-otp", data),

  resendOtp: (data) =>
    API.post("/auth/resend-otp", data),

  forgotPassword: (data) =>
    API.post("/auth/forgot-password", data),

  verifyResetOtp: (data) =>
    API.post("/auth/verify-reset-otp", data),

  resetPassword: (data) =>
    API.post("/auth/reset-password", data),

  getProfile: () =>
    API.get("/auth/me"),

  submitKyc: (data) =>
    API.post("/auth/kyc", data)

}

export const vehicleAPI = {
  getAll: () => API.get('/vehicles'),
  getById: (id) => API.get(`/vehicles/${id}`),
  add: (data) => API.post('/vehicles', data),
  toggleStatus: (id) => API.patch(`/vehicles/${id}/toggle-status`),
  delete: (id) => API.delete(`/vehicles/${id}`),
  getMine: () => API.get('/vehicles/my'),
}

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMine: () => API.get('/bookings'),
  getById: (id) => API.get(`/bookings/${id}`),
  pay: (id) => API.post(`/bookings/${id}/pay`),
  cancel: (id) => API.patch(`/bookings/${id}/cancel`),
}

export const adminAPI = {
  getVehicles: () => API.get('/admin/vehicles'),
  approveVehicle: (id) => API.patch(`/admin/vehicles/${id}/approve`),
  rejectVehicle: (id) => API.patch(`/admin/vehicles/${id}/reject`),
  getUsers: () => API.get('/admin/users'),
  getBookings: () => API.get('/admin/bookings'),
}

export default API