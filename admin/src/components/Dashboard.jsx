import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard({ apiUrl, token }) {
  const navigate = useNavigate()
  const [recentArticles, setRecentArticles] = useState([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Total Days', value: '0', change: '', changeType: 'neutral', color: 'bg-[#00A4B4]' },
    { label: 'This Month', value: '0', change: '', changeType: 'neutral', color: 'bg-blue-500' },
    { label: 'Special Days', value: '0', change: '', changeType: 'neutral', color: 'bg-green-500' },
    { label: 'Import Ready', value: 'CSV', change: '', changeType: 'neutral', color: 'bg-orange-500' },
  ])

  useEffect(() => {
    fetchStats()
    fetchRecentArticles()
  }, [])

  const fetchRecentArticles = async () => {
    try {
      const response = await fetch(apiUrl + '/admin/articles?per_page=10', {
        headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' },
      })
      const result = await response.json()
      const list = Array.isArray(result) ? result : (result.data || [])
      setRecentArticles(list.slice(0, 5))
      // Update Total Articles stat card if present
      setStats(prev => prev.map((stat) => {
        if (stat.label === 'Total Articles' || stat.label === 'கட்டுரைகள்') {
          const total = result.total ?? list.length
          return { ...stat, value: String(total) }
        }
        return stat
      }))
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setArticlesLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(apiUrl + '/admin/calendar', {
        headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' },
      })
      const result = await response.json()
      if (Array.isArray(result)) {
        const total = result.length
        const special = result.filter(item => item.special_today || item.special_symbols).length
        setStats(prev => prev.map((stat, idx) => {
          if (idx === 0) return { ...stat, value: String(total) }
          if (idx === 1) return { ...stat, value: String(Math.min(total, 31)) }
          if (idx === 2) return { ...stat, value: String(special) }
          return stat
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tamil Calendar Dashboard</h1>
        <p className="text-gray-600">Manage your Tamil calendar data and imports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <div className="text-white text-2xl font-bold">{stat.value.charAt(0)}</div>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-sm text-gray-600">Go to Import CSV to upload Tamil calendar data</p>
          </div>
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-sm text-gray-600">View day-wise Tamil calendar entries</p>
          </div>
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-sm text-gray-600">Admin login is protected with JWT</p>
          </div>
        </div>
      </div>

      {/* Tamil Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">கட்டுரைகள் (Articles)</h3>
            <p className="text-sm text-gray-500">சமீபத்திய தமிழ் கட்டுரைகள் — Latest Tamil articles</p>
          </div>
          <button
            onClick={() => navigate('/articles')}
            className="px-4 py-2 bg-[#00A4B4] text-white text-sm font-medium rounded-lg hover:bg-[#008A96]"
          >
            Manage Articles →
          </button>
        </div>
        {articlesLoading ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">கட்டுரைகள் ஏற்றப்படுகிறது... (Loading articles...)</p>
        ) : recentArticles.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">
            கட்டுரைகள் இல்லை. <button onClick={() => navigate('/articles')} className="text-[#00A4B4] underline">Add your first Tamil article</button>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">தலைப்பு (Title)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">பிரிவு (Category)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">நிலை (Status)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">வெளியீடு (Published)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/articles')}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={article.title}>
                      {article.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{article.category?.name || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? 'வெளியிடப்பட்டது' : article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('ta-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
