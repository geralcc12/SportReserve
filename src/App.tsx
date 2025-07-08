import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import CanchaList from './pages/CanchaList'
import CanchaDetail from './pages/CanchaDetail'
import Payment from './pages/Payment'
import QRCode from './pages/QRCode'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <CanchaList />
            </ProtectedRoute>
          } />
          <Route path="/cancha/:id" element={
            <ProtectedRoute>
              <CanchaDetail />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/qr" element={
            <ProtectedRoute>
              <QRCode />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App 