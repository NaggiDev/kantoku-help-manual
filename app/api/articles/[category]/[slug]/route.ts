import { NextRequest, NextResponse } from 'next/server';
import { getArticleData } from '@/lib/markdownProcessor';

interface RouteParams {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const resolvedParams = await params;
    const article = await getArticleData(resolvedParams.category, resolvedParams.slug, locale);
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }
}
