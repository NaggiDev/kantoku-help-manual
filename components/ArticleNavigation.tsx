'use client';

import Link from 'next/link';
import { ArticleData } from '@/lib/markdownProcessor';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleNavigationProps {
  currentArticle: ArticleData;
  allArticles: ArticleData[];
}

export default function ArticleNavigation({ currentArticle, allArticles }: ArticleNavigationProps) {
  const { t } = useLanguage();
  // Find current article index
  const currentIndex = allArticles.findIndex(article => 
    article.id === currentArticle.id && article.category === currentArticle.category
  );
  
  const previousArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <div className="flex-1">
        {previousArticle && (
          <Link
            href={`/${previousArticle.category}/${previousArticle.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('previous', 'article')}: {previousArticle.title}
          </Link>
        )}
      </div>
      
      <div className="flex-1 text-right">
        {nextArticle && (
          <Link
            href={`/${nextArticle.category}/${nextArticle.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('next', 'article')}: {nextArticle.title}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
