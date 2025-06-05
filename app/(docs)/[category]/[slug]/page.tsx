import { getAllArticleIds, getArticleData, getSortedArticlesData, Article } from '@/lib/markdownProcessor';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ArticleNavigation from '@/components/ArticleNavigation';
import ProgressIndicator from '@/components/ProgressIndicator';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllArticleIds();
  return paths.map(path => ({
    category: path.params.category,
    slug: path.params.slug
  }));
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const article = await getArticleData(resolvedParams.category, resolvedParams.slug);
    return {
      title: `${article.title} - Kantoku Help Manual`,
      description: article.description || 'Kantoku help article',
    };
  } catch {
    // If article not found, we can return default metadata or handle appropriately
    return {
      title: "Article Not Found - Kantoku Help Manual",
      description: "This help article could not be found.",
    };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  let article: Article;
  try {
    article = await getArticleData(resolvedParams.category, resolvedParams.slug);
  } catch (error) {
    console.error(`Error fetching article: ${resolvedParams.category}/${resolvedParams.slug}`, error);
    notFound(); // This will render the nearest not-found.tsx or Next.js default 404 page
  }

  // Get all articles for navigation
  const allArticles = getSortedArticlesData();
  const categoryArticles = allArticles.filter(a => a.category === resolvedParams.category);

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb category={resolvedParams.category} title={article.title} />
      
      {/* Show progress indicator for getting-started category */}
      {resolvedParams.category === 'getting-started' && (
        <ProgressIndicator currentArticle={article} categoryArticles={categoryArticles} />
      )}
      
      <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        {article.description && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.description}</p>
        )}
        <div 
          className="prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:max-w-full"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }} 
        />
      </article>
      
      <ArticleNavigation currentArticle={article} allArticles={categoryArticles} />
    </div>
  );
}
