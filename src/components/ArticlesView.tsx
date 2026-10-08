import React, { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AppView, navigateToRoute } from '../router';
import { apiFetchJson } from '../utils/apiFetch';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  featured_image_url?: string | null;
  category_id: number;
  status: string;
  published_at: string;
  category: Category;
}

// Resolve the display URL for an article image, whatever the API stored:
// prefers the backend-provided featured_image_url, falls back to mapping
// bare filenames / relative paths against the API base.
export function resolveArticleImageUrl(article: { featured_image?: string | null; featured_image_url?: string | null }): string | null {
  if (article.featured_image_url) return article.featured_image_url;
  const raw = (article.featured_image || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api\/?$/, '');
  let path = raw.replace(/^\//, '').replace(/^(public\/)?storage\//, '');
  // Bare filenames (legacy seed data) live under uploads/
  if (!path.includes('/')) path = `uploads/${path}`;
  // Production API serves Laravel from a /public sub-path
  const base = /veltamilcalendar\.com/i.test(apiBase) ? `${apiBase}/public/storage` : `${apiBase}/storage`;
  return `${base}/${path}`;
}

interface ArticlesResponse {
  categories: Category[];
  articles: Article[];
}

export default function ArticlesView({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<ArticlesResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
      // De-duplicated: both mounted frames share one request.
      const result = await apiFetchJson(`${apiBase}/articles`);
      if (result.categories && result.articles) {
        setData(result);
        if (result.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(result.categories[0].slug);
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = data?.articles.filter(article => {
    if (!selectedCategory) return true;
    return article.category.slug === selectedCategory;
  }) || [];

  const selectedCategoryData = data?.categories.find(c => c.slug === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col bg-[#FFFDF0]"
    >
      {/* Page Title */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h1 className="text-xl font-black text-[#8A1A1A] flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>கட்டுரைகள்</span>
        </h1>
        <p className="text-xs text-amber-800/70 font-medium mt-1">
          தமிழ் கலாச்சாரம், பாரம்பரியம் மற்றும் சமயம் பற்றிய கட்டுரைகள்
        </p>
      </div>

      {/* Category Tabs */}
      {data && data.categories.length > 0 && (
        <div className="bg-[#FFFCEB] border-b-2 border-[#8A1A1A]/10 px-3 py-2.5 overflow-x-auto shrink-0">
          <div className="flex items-center space-x-2 min-w-max">
            {data.categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === category.slug
                    ? 'bg-[#8A1A1A] text-[#FDF6E2] shadow-md'
                    : 'bg-white text-[#8A1A1A] border border-amber-200 hover:bg-amber-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
        </div>
      )}

      {/* Articles List */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-none">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-sm text-amber-800 font-bold">கட்டுரைகள் ஏற்றப்படுகிறது...</div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-sm text-amber-800 font-bold">கட்டுரைகள் இல்லை</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigateToRoute('article', undefined, article.slug)}
                className="bg-white border-2 border-[#8A1A1A]/10 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400/50 cursor-pointer transition active:scale-[0.98] overflow-hidden"
              >
                {resolveArticleImageUrl(article) && (
                  <div className="w-full h-36 overflow-hidden bg-amber-100/30">
                    <img
                      src={resolveArticleImageUrl(article)!}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-black text-[#8A1A1A] leading-tight mb-1.5 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-amber-800/80 font-medium leading-relaxed line-clamp-2">
                        {article.excerpt || article.content.substring(0, 120) + '...'}
                      </p>
                      <div className="flex items-center space-x-3 mt-2.5">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-lg">
                          {article.category.name}
                        </span>
                        {article.published_at && (
                          <span className="text-[10px] font-bold text-amber-800/70 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.published_at).toLocaleDateString('ta-IN')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-600/40 flex-shrink-0 mt-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}