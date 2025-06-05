'use client';

import { ArticleData } from '@/lib/markdownProcessor';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProgressIndicatorProps {
  currentArticle: ArticleData;
  categoryArticles: ArticleData[];
}

export default function ProgressIndicator({ currentArticle, categoryArticles }: ProgressIndicatorProps) {
  const { t } = useLanguage();
  const currentIndex = categoryArticles.findIndex(article => article.id === currentArticle.id);
  const totalSteps = categoryArticles.length;
  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          {t(currentArticle.category, 'categories') || currentArticle.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} {t('progress', 'article')}
        </h3>
        <span className="text-sm font-medium text-blue-700">
          {t('step', 'article')} {currentIndex + 1} {t('of', 'article')} {totalSteps}
        </span>
      </div>
      
      <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-blue-600">
        <span>{t('started', 'article')}</span>
        <span>{Math.round(progressPercentage)}% {t('complete', 'article')}</span>
        <span>{t('finished', 'article')}</span>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mt-4">
        {categoryArticles.map((article, index) => (
          <div 
            key={article.id}
            className={`flex flex-col items-center ${
              index <= currentIndex ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                index < currentIndex 
                  ? 'bg-blue-600 text-white' 
                  : index === currentIndex 
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {index < currentIndex ? '✓' : index + 1}
            </div>
            <span className="text-xs text-center max-w-16 leading-tight">
              {article.title.replace(/Step \d+ - /, '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
