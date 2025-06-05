'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArticleData } from '@/lib/markdownProcessor';
import ArticleNavigation from '@/components/ArticleNavigation';
import ProgressIndicator from '@/components/ProgressIndicator';
import Breadcrumb from '@/components/Breadcrumb';

interface Article extends ArticleData {
  contentHtml: string;
}

interface ArticleContentProps {
  category: string;
  slug: string;
  initialArticle: Article;
  initialCategoryArticles: ArticleData[];
}

export default function ArticleContent({
  category,
  slug,
  initialArticle,
  initialCategoryArticles
}: ArticleContentProps) {
  const { locale } = useLanguage();
  const [article, setArticle] = useState<Article>(initialArticle);
  const [categoryArticles, setCategoryArticles] = useState<ArticleData[]>(initialCategoryArticles);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchLocalizedContent = async () => {
      try {
        setLoading(true);

        // Fetch the article in the current locale
        const articleResponse = await fetch(`/api/articles/${category}/${slug}?locale=${locale}`);
        if (articleResponse.ok) {
          const localizedArticle = await articleResponse.json();
          setArticle(localizedArticle);
        }

        // Fetch all articles for navigation in the current locale
        const articlesResponse = await fetch(`/api/articles?locale=${locale}`);
        if (articlesResponse.ok) {
          const allArticles = await articlesResponse.json();
          const localizedCategoryArticles = allArticles.filter((a: ArticleData) => a.category === category);
          setCategoryArticles(localizedCategoryArticles);
        }
      } catch (error) {
        console.error('Error fetching localized content:', error);
        // Keep the current content if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchLocalizedContent();
  }, [locale, category, slug, mounted]);

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb category={category} title={article.title} />
      
      {/* Show progress indicator for getting-started category */}
      {category === 'getting-started' && (
        <ProgressIndicator currentArticle={article} categoryArticles={categoryArticles} />
      )}
      
      <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl max-w-none">
        {loading && (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        )}
        
        {!loading && (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            {article.description && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.description}</p>
            )}
            <div 
              className="prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:max-w-full"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }} 
            />
          </>
        )}
      </article>
      
      {!loading && (
        <ArticleNavigation currentArticle={article} allArticles={categoryArticles} />
      )}
    </div>
  );
}
