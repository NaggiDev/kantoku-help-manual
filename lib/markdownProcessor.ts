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

export function getSortedArticlesData(locale: string = 'ja'): ArticleData[] {
  // Get file names under /content, including subdirectories for categories
  const localeContentDirectory = path.join(contentDirectory, locale);
  const japaneseContentDirectory = path.join(contentDirectory, 'ja');
  const englishContentDirectory = path.join(contentDirectory, 'en');

  // Fallback hierarchy: requested locale → Japanese → English
  let targetDirectory = englishContentDirectory; // Final fallback to English
  if (fs.existsSync(localeContentDirectory)) {
    targetDirectory = localeContentDirectory;
  } else if (fs.existsSync(japaneseContentDirectory)) {
    targetDirectory = japaneseContentDirectory;
  }

  const categories = fs.readdirSync(targetDirectory);
  let allArticles: ArticleData[] = [];

  // Define category order for consistent sorting across languages
  const categoryOrder = ['getting-started', 'web-version', 'app-version'];

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

      // Sort articles within each category by order, then by title
      categoryArticles.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
        }
        if (a.order !== undefined && b.order === undefined) return -1;
        if (a.order === undefined && b.order !== undefined) return 1;
        return a.title.localeCompare(b.title);
      });

      allArticles = allArticles.concat(categoryArticles);
    }
  });

  // Sort articles by category order first, then maintain article order within categories
  return allArticles.sort((a, b) => {
    const aCategoryIndex = categoryOrder.indexOf(a.category);
    const bCategoryIndex = categoryOrder.indexOf(b.category);

    // If categories are different, sort by category order
    if (aCategoryIndex !== bCategoryIndex) {
      return aCategoryIndex - bCategoryIndex;
    }

    // If same category, sort by order within category
    if (a.order !== undefined && b.order !== undefined) {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
    }
    if (a.order !== undefined && b.order === undefined) return -1;
    if (a.order === undefined && b.order !== undefined) return 1;
    return a.title.localeCompare(b.title);
  });
}

export async function getArticleData(category: string, id: string, locale: string = 'ja'): Promise<Article> {
  // Try locale-specific content first, fallback to Japanese, then English
  const localeContentDirectory = path.join(contentDirectory, locale);
  const japaneseContentDirectory = path.join(contentDirectory, 'ja');
  const englishContentDirectory = path.join(contentDirectory, 'en');
  const localePath = path.join(localeContentDirectory, category, `${id}.md`);
  const japanesePath = path.join(japaneseContentDirectory, category, `${id}.md`);
  const englishPath = path.join(englishContentDirectory, category, `${id}.md`);

  let fullPath = englishPath; // Final fallback to English
  if (fs.existsSync(localePath)) {
    fullPath = localePath;
  } else if (fs.existsSync(japanesePath)) {
    fullPath = japanesePath;
  }
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
  let paths: Array<{ params: { category: string; slug: string } }> = [];

  // Get all language directories
  const languages = fs.readdirSync(contentDirectory).filter(item => {
    const itemPath = path.join(contentDirectory, item);
    return fs.statSync(itemPath).isDirectory();
  });

  // Process each language directory
  languages.forEach(language => {
    const languageDir = path.join(contentDirectory, language);

    // Get all category directories within this language
    const categories = fs.readdirSync(languageDir).filter(item => {
      const itemPath = path.join(languageDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    categories.forEach(category => {
      const categoryPath = path.join(languageDir, category);
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
    });
  });

  return paths;
}