import { getAllArticleIds, getArticleData, getSortedArticlesData, Article } from '@/lib/markdownProcessor';
import { notFound } from 'next/navigation';
import ArticleContent from '@/components/ArticleContent';

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
    <ArticleContent
      category={resolvedParams.category}
      slug={resolvedParams.slug}
      initialArticle={article}
      initialCategoryArticles={categoryArticles}
    />
  );
}
