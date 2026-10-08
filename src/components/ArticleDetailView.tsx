import React, { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { AppView, navigateToRoute } from '../router';

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
        <div className="bg-[#8A1A1A] text-[#FDF6E2] px-4 py-3 flex items-center space-x-2.5 shrink-0">
          <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
        </div>
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
        <div className="bg-[#8A1A1A] text-[#FDF6E2] px-4 py-3 flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => navigateToRoute('articles')}
            className="flex items-center justify-center w-8 h-8 bg-[#FFFDF0] text-[#8A1A1A] rounded-full hover:bg-amber-50 transition shadow-md border border-amber-200/50 active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-black">கட்டுரை காணப்படவில்லை</h2>
        </div>
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
      {/* Header */}
      <div className="bg-[#8A1A1A] text-[#FDF6E2] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigateToRoute('articles')}
            className="flex items-center justify-center w-8 h-8 bg-[#FFFDF0] text-[#8A1A1A] rounded-full hover:bg-amber-50 transition shadow-md border border-amber-200/50 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-black tracking-wide">கட்டுரைகள்</h2>
              <p className="text-[10px] opacity-80">Articles & Stories</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 transition border border-amber-400/50 active:scale-95 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Article Content */}
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
          {article.featured_image && (
            <div className="w-full rounded-2xl overflow-hidden bg-amber-100/30 border border-amber-200/50 mb-4">
              <img
                src={article.featured_image}
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