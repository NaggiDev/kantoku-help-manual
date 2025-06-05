'use client';

import Link from 'next/link';
import { ArticleData } from '@/lib/markdownProcessor';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

interface GroupedArticles {
  [category: string]: ArticleData[];
}

export default function Sidebar() {
  const { locale, t } = useLanguage();
  const [allArticles, setAllArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load articles based on current locale via API
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles?locale=${locale}`);
        if (response.ok) {
          const articles = await response.json();
          setAllArticles(articles);
        } else {
          console.error('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [locale, mounted]);

  const groupedArticles = allArticles.reduce<GroupedArticles>((acc, article) => {
    const category = article.category || 'General'; // Fallback for uncategorized articles
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {});

  return (
    <aside className="w-72 bg-white border-r border-gray-200 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('title', 'sidebar')}</h2>
          <p className="text-sm text-gray-600">{t('subtitle', 'sidebar')}</p>
        </div>

        <nav className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {/* Loading skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="space-y-1">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 bg-gray-100 rounded-md animate-pulse ml-3"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            Object.entries(groupedArticles).map(([category, articles]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider px-3 py-2 bg-gray-50 rounded-md">
                  {t(category, 'categories') || category.replace(/-/g, ' ')}
                </h3>
                <ul className="space-y-1">
                  {articles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/${article.category}/${article.id}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-500"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
} 