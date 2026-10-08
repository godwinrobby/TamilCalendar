import { useState, useEffect } from 'react'
import { resolveArticleImageUrl } from './Articles'

// Pagination Component
function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    const end = Math.min(lastPage, start + showPages - 1)

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{lastPage}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center border px-3 py-2 text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 border-[#00A4B4] bg-[#00A4B4] text-white'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

function ContentManager({ apiUrl, token }) {
  const [activeTab, setActiveTab] = useState('articles')
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // Pagination state
  const [catPagination, setCatPagination] = useState({ currentPage: 1, lastPage: 1 })
  const [artPagination, setArtPagination] = useState({ currentPage: 1, lastPage: 1 })

  // Category form state
  const [catEditingId, setCatEditingId] = useState(null)
  const [catFormData, setCatFormData] = useState({ name: '', slug: '', description: '' })
  const [catError, setCatError] = useState('')

  // Article form state
  const [artEditingId, setArtEditingId] = useState(null)
  const [artFormData, setArtFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    status: 'draft',
    published_at: '',
  })
  const [artError, setArtError] = useState('')
  const [uploading, setUploading] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type })
    }, 3000)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (catPage = 1, artPage = 1) => {
    try {
      const [catRes, artRes] = await Promise.all([
        fetch(`${apiUrl}/admin/categories?per_page=10&page=${catPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/admin/articles?per_page=10&page=${artPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.data)
        setCatPagination({ currentPage: catData.current_page, lastPage: catData.last_page })
      }
      if (artRes.ok) {
        const artData = await artRes.json()
        setArticles(artData.data)
        setArtPagination({ currentPage: artData.current_page, lastPage: artData.last_page })
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Category handlers
  const handleCatSubmit = async (e) => {
    e.preventDefault()
    setCatError('')

    try {
      const url = catEditingId ? `${apiUrl}/admin/categories/${catEditingId}` : `${apiUrl}/admin/categories`
      const method = catEditingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(catFormData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Operation failed')
      }

      await fetchData(catPagination.currentPage, artPagination.currentPage)
      setCatFormData({ name: '', slug: '', description: '' })
      setCatEditingId(null)
      showToast(catEditingId ? 'Category updated successfully' : 'Category created successfully')
    } catch (err) {
      setCatError(err.message)
    }
  }

  const handleCatEdit = (category) => {
    setCatEditingId(category.id)
    setCatFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
  }

  const handleCatDelete = async (id) => {
    if (!confirm('Are you sure? This will also delete all articles in this category.')) return
    try {
      const res = await fetch(`${apiUrl}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchData()
    } catch (err) {
      setCatError(err.message)
    }
  }

  // Article handlers
  const handleArtSubmit = async (e) => {
    e.preventDefault()
    setArtError('')

    try {
      const url = artEditingId ? `${apiUrl}/admin/articles/${artEditingId}` : `${apiUrl}/admin/articles`
      const method = artEditingId ? 'PUT' : 'POST'
      
      const payload = {
        ...artFormData,
        published_at: artFormData.published_at || null,
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Operation failed')
      }

      await fetchData(catPagination.currentPage, artPagination.currentPage)
      setArtFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        category_id: '',
        status: 'draft',
        published_at: '',
      })
      setArtEditingId(null)
      showToast(artEditingId ? 'Article updated successfully' : 'Article created successfully')
    } catch (err) {
      setArtError(err.message)
    }
  }

  const handleArtEdit = (article) => {
    setArtEditingId(article.id)
    setArtFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      featured_image: article.featured_image || '',
      category_id: article.category_id,
      status: article.status,
      published_at: article.published_at ? article.published_at.slice(0, 10) : '',
    })
  }

  const handleArtDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`${apiUrl}/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchData()
      showToast('Article deleted successfully', 'error')
    } catch (err) {
      setArtError(err.message)
    }
  }

  const normalizeImageUrl = (url) => resolveArticleImageUrl({ featured_image: url }, apiUrl)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 100 * 1024 * 1024) {
      setArtError('File size must be less than 100MB')
      return
    }

    setUploading(true)
    setArtError('')

    try {
      const formDataImg = new FormData()
      formDataImg.append('image', file)

      const res = await fetch(`${apiUrl}/admin/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataImg,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Upload failed')
      }

      const data = await res.json()
      setArtFormData({ ...artFormData, featured_image: data.path || data.url })
    } catch (err) {
      setArtError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Content Management</h1>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`${
              activeTab === 'articles'
                ? 'border-[#00A4B4] text-[#00A4B4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-[#00A4B4] text-[#00A4B4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Categories ({categories.length})
          </button>
        </nav>
      </div>

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div>
          {artError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {artError}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {artEditingId ? 'Edit Article' : 'Add New Article'}
            </h2>
            <form onSubmit={handleArtSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={artFormData.title}
                    onChange={(e) => setArtFormData({ ...artFormData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={artFormData.slug}
                    onChange={(e) => setArtFormData({ ...artFormData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={artFormData.category_id}
                    onChange={(e) => setArtFormData({ ...artFormData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={artFormData.status}
                    onChange={(e) => setArtFormData({ ...artFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={artFormData.excerpt}
                  onChange={(e) => setArtFormData({ ...artFormData, excerpt: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                />
                {uploading && (
                  <p className="mt-1 text-sm text-blue-600">Uploading...</p>
                )}
                {artFormData.featured_image && (
                  <div className="mt-2">
                    <img
                      src={normalizeImageUrl(artFormData.featured_image)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <p className="mt-1 text-xs text-gray-500 break-all">{normalizeImageUrl(artFormData.featured_image)}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={artFormData.content}
                  onChange={(e) => setArtFormData({ ...artFormData, content: e.target.value })}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A4B4] text-white rounded-lg hover:bg-[#008A96]"
                >
                  {artEditingId ? 'Update' : 'Create'}
                </button>
                {artEditingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setArtEditingId(null)
                      setArtFormData({
                        title: '',
                        slug: '',
                        content: '',
                        excerpt: '',
                        featured_image: '',
                        category_id: '',
                        status: 'draft',
                        published_at: '',
                      })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{article.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{article.category?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleArtEdit(article)}
                        className="text-[#00A4B4] hover:text-[#008A96] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArtDelete(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={artPagination.currentPage} lastPage={artPagination.lastPage} onPageChange={(page) => fetchData(catPagination.currentPage, page)} />
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          {catError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {catError}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {catEditingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={catFormData.name}
                    onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={catFormData.slug}
                    onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A4B4] focus:border-[#00A4B4]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A4B4] text-white rounded-lg hover:bg-[#008A96]"
                >
                  {catEditingId ? 'Update' : 'Create'}
                </button>
                {catEditingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setCatEditingId(null)
                      setCatFormData({ name: '', slug: '', description: '' })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{cat.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCatEdit(cat)}
                        className="text-[#00A4B4] hover:text-[#008A96] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCatDelete(cat.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={catPagination.currentPage} lastPage={catPagination.lastPage} onPageChange={(page) => fetchData(page, artPagination.currentPage)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentManager