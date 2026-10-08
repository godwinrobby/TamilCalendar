import { useState, createContext, useContext } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ImportCSV from './components/ImportCSV'
import DayWise from './components/DayWise'
import ContentManager from './components/ContentManager'
import Articles from './components/Articles'
import Sidebar from './components/Sidebar'
import './App.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const AuthContext = createContext(null)

function getInitialAuth() {
  const stored = localStorage.getItem('adminAuth')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth)

  const handleLogin = (token, user) => {
    const data = { token, user }
    localStorage.setItem('adminAuth', JSON.stringify(data))
    setAuth(data)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

function ProtectedLayout() {
  const { auth, handleLogout } = useContext(AuthContext)
  const location = useLocation()

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const currentView = location.pathname.replace('/', '') || 'dashboard'

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar currentView={currentView} onLogout={handleLogout} />
      
      <div className="ml-64">
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4] sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  const { handleLogin } = useContext(AuthContext)
  const navigate = useNavigate()

  const onLogin = (token, user) => {
    handleLogin(token, user)
    navigate('/dashboard', { replace: true })
  }

  return (
    <Routes>
      <Route path="/login" element={<Login apiUrl={API_URL} onLogin={onLogin} />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard apiUrl={API_URL} token={getInitialAuth()?.token} />} />
        <Route path="/import" element={<ImportCSV apiUrl={API_URL} token={getInitialAuth()?.token} />} />
        <Route path="/events" element={<div className="text-center py-10 text-gray-500">Events page coming soon</div>} />
        <Route path="/festivals" element={<div className="text-center py-10 text-gray-500">Festivals page coming soon</div>} />
        <Route path="/daywise" element={<DayWise apiUrl={API_URL} token={getInitialAuth()?.token} />} />
        <Route path="/content" element={<ContentManager apiUrl={API_URL} token={getInitialAuth()?.token} />} />
        <Route path="/articles" element={<Articles apiUrl={API_URL} token={getInitialAuth()?.token} />} />
        <Route path="/categories" element={<ContentManager apiUrl={API_URL} token={getInitialAuth()?.token} />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function Root() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Root
