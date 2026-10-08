import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar({ currentView, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.replace('/', '') || 'dashboard'

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'import', label: 'Import CSV', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { id: 'daywise', label: 'Day Wise', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'content', label: 'Content', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9a2 2 0 00-2 2v1' },
    { id: 'events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'festivals', label: 'Festivals', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  ]

  const handleNav = (id) => {
    navigate('/' + id)
  }

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 overflow-y-auto">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#00A4B4] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
           <span className="text-xl font-bold text-gray-900">Vel Tamil Calendar</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === item.id
                  ? 'bg-[#00A4B4] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {onLogout && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
