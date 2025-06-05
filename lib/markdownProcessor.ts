// This file should only be used on the server side
// Client components should use API routes to fetch data
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ArticleData {
  id: string;
  title: string;
  description?: string;
  order?: number;
  category: string;
  [key: string]: unknown; // For any other frontmatter data
}

export interface Article extends ArticleData {
  contentHtml: string;
  category: string;
}

export function getSortedArticlesData(locale: string = 'en'): ArticleData[] {
  // Get file names under /content, including subdirectories for categories
  const localeContentDirectory = path.join(contentDirectory, locale);

  // Fallback to English if locale directory doesn't exist
  const targetDirectory = fs.existsSync(localeContentDirectory) ? localeContentDirectory : contentDirectory;

  const categories = fs.readdirSync(targetDirectory);
  let allArticles: ArticleData[] = [];

  categories.forEach(category => {
    const categoryPath = path.join(targetDirectory, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const fileNames = fs.readdirSync(categoryPath).filter(fileName => fileName.endsWith('.md'));
      const categoryArticles = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(categoryPath, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
          id,
          category,
          ...(matterResult.data as { title: string; description?: string; order?: number }),
        };
      });
      allArticles = allArticles.concat(categoryArticles);
    }
  });

  // Sort articles by order, then by title
  return allArticles.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
    }
    if (a.order !== undefined && b.order === undefined) return -1; // a has order, b doesn't, so a comes first
    if (a.order === undefined && b.order !== undefined) return 1;  // b has order, a doesn't, so b comes first

    // If order is the same or not defined for both, sort by title
    return a.title.localeCompare(b.title);
  });
}

export async function getArticleData(category: string, id: string, locale: string = 'en'): Promise<Article> {
  // For now, we'll use the default content directory
  // In the future, this can be enhanced to support locale-specific content
  const fullPath = path.join(contentDirectory, category, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    category,
    ...(matterResult.data as { title: string; description?: string; order?: number }),
  };
}

export function getAllArticleIds() {
  const categories = fs.readdirSync(contentDirectory);
  let paths: Array<{ params: { category: string; slug: string } }> = [];

  categories.forEach(category => {
    const categoryPath = path.join(contentDirectory, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const fileNames = fs.readdirSync(categoryPath).filter(fileName => fileName.endsWith('.md'));
      const categoryPaths = fileNames.map(fileName => {
        return {
          params: {
            category: category,
            slug: fileName.replace(/\.md$/, ''),
          },
        };
      });
      paths = paths.concat(categoryPaths);
    }
  });
  return paths;
} 