import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { navigateToRoute } from '../router';
import { resolveArticleImageUrl } from './ArticlesView';

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

export default function ArticleDetailView({ articleSlug, onClose }: { articleSlug: string; onClose: () => void }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setArticle(null);
    fetchArticle();
  }, [articleSlug]);

  const fetchArticle = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
      const res = await fetch(`${apiBase}/articles/${encodeURIComponent(articleSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      } else if (res.status === 404) {
        setError('not-found');
      } else {
        setError('load-failed');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('load-failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col bg-[#FFFDF0]"
      >
        <div className="flex-grow flex items-center justify-center">
          <div className="text-sm text-amber-800 font-bold">கட்டுரை ஏற்றப்படுகிறது...</div>
        </div>
      </motion.div>
    );
  }

  if (!article) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col bg-[#FFFDF0]"
      >
        <div className="flex-grow flex flex-col items-center justify-center space-y-3 p-6 text-center">
          <div className="text-sm text-amber-800 font-bold">
            {error === 'load-failed'
              ? 'கட்டுரையை ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயலவும்.'
              : 'கட்டுரை காணப்படவில்லை'}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchArticle}
              className="px-4 py-2 bg-[#8A1A1A] text-[#FDF6E2] text-xs font-bold rounded-xl hover:bg-[#6d1414] transition cursor-pointer"
            >
              மீண்டும் முயல்க
            </button>
            <button
              onClick={() => navigateToRoute('articles')}
              className="px-4 py-2 bg-white text-[#8A1A1A] text-xs font-bold rounded-xl border border-amber-300 hover:bg-amber-50 transition cursor-pointer"
            >
              கட்டுரைகள் பட்டியல்
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col bg-[#FFFDF0]"
    >
      {/* Article Content (app shell in App.tsx already renders the red
          header with back button, so no inner header here — avoids the
          double-header shown in the screenshot) */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-[#8A1A1A]/10 rounded-2xl p-5 shadow-sm"
        >
          {/* Category Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-lg">
              {article.category.name}
            </span>
            {article.published_at && (
              <span className="text-[10px] font-bold text-amber-800/70 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.published_at).toLocaleDateString('ta-IN')}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-black text-[#8A1A1A] leading-tight mb-4">
            {article.title}
          </h1>

          {/* Featured image */}
          {article && resolveArticleImageUrl(article) && (
            <div className="w-full rounded-2xl overflow-hidden bg-amber-100/30 border border-amber-200/50 mb-4">
              <img
                src={resolveArticleImageUrl(article)!}
                alt={article.title}
                className="w-full max-h-72 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <div className="bg-amber-50/60 border-l-4 border-amber-400 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-amber-900 italic leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <div className="text-sm text-[#5C1A1A] leading-relaxed whitespace-pre-wrap font-medium">
              {article.content}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}