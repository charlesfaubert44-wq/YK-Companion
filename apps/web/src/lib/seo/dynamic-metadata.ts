import { Metadata } from 'next';
import { generatePageMetadata } from './metadata';
import { createClient } from '@/lib/supabase/server';

/**
 * Dynamic Metadata Generators
 * 
 * Functions for generating SEO metadata for dynamic content
 * from the database (garage sales, knowledge articles, etc.)
 */

// Types for database entities
interface GarageSale {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  status: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/**
 * Generate metadata for a garage sale detail page
 * 
 * Fetches garage sale data and generates optimized metadata
 * including Open Graph tags and structured data preparation
 */
export async function generateGarageSaleMetadata(
  saleId: string
): Promise<Metadata> {
  try {
    const supabase = await createClient();

    const { data: sale, error } = await supabase
      .from('garage_sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (error || !sale) {
      // Return default metadata for not found
      return generatePageMetadata({
        title: 'Garage Sale Not Found',
        description: 'The garage sale you are looking for could not be found.',
        path: `/living/garage-sales/${saleId}`,
        noindex: true,
      });
    }

    // Format date for display
    const saleDate = new Date(sale.date);
    const formattedDate = saleDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Create description
    const description = sale.description
      ? `${sale.description.substring(0, 120)}... | ${formattedDate} in ${sale.location}`
      : `Garage sale on ${formattedDate} in ${sale.location}, Yellowknife`;

    // Create keywords
    const keywords = [
      'garage sale yellowknife',
      sale.location,
      ...(sale.tags || []),
    ];

    return generatePageMetadata({
      title: `${sale.title} - Garage Sale in ${sale.location}`,
      description: description.substring(0, 160),
      path: `/living/garage-sales/${saleId}`,
      image: sale.image_url || undefined,
      keywords,
      type: 'article',
      publishedTime: sale.created_at,
      modifiedTime: sale.updated_at,
    });
  } catch (error) {
    console.error('Error generating garage sale metadata:', error);
    
    return generatePageMetadata({
      title: 'Garage Sale',
      description: 'View garage sale details in Yellowknife',
      path: `/living/garage-sales/${saleId}`,
    });
  }
}

/**
 * Generate metadata for a knowledge base article
 * 
 * Fetches article data and generates optimized metadata
 * for better search visibility and social sharing
 */
export async function generateKnowledgeArticleMetadata(
  articleId: string
): Promise<Metadata> {
  try {
    const supabase = await createClient();

    const { data: article, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('id', articleId)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      return generatePageMetadata({
        title: 'Article Not Found',
        description: 'The article you are looking for could not be found.',
        path: `/knowledge/${articleId}`,
        noindex: true,
      });
    }

    // Create description from excerpt or content
    const description = 
      article.excerpt ||
      article.content?.substring(0, 160).replace(/<[^>]*>/g, '') ||
      'Helpful information about living in Yellowknife';

    // Create keywords
    const keywords = [
      'yellowknife guide',
      'yellowknife tips',
      ...(article.category ? [article.category] : []),
      ...(article.tags || []),
    ];

    return generatePageMetadata({
      title: article.title,
      description: description.substring(0, 160),
      path: `/knowledge/${articleId}`,
      keywords,
      type: 'article',
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at,
      section: article.category || 'Knowledge Base',
      tags: article.tags,
    });
  } catch (error) {
    console.error('Error generating knowledge article metadata:', error);
    
    return generatePageMetadata({
      title: 'Knowledge Article',
      description: 'Learn more about Yellowknife',
      path: `/knowledge/${articleId}`,
    });
  }
}

/**
 * Fetch garage sale for structured data
 * Used by event schema generation
 */
export async function fetchGarageSaleForSchema(saleId: string): Promise<GarageSale | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('garage_sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as GarageSale;
  } catch (error) {
    console.error('Error fetching garage sale for schema:', error);
    return null;
  }
}

/**
 * Fetch knowledge article for structured data
 * Used by article schema generation
 */
export async function fetchKnowledgeArticleForSchema(
  articleId: string
): Promise<KnowledgeArticle | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('id', articleId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return null;
    }

    return data as KnowledgeArticle;
  } catch (error) {
    console.error('Error fetching knowledge article for schema:', error);
    return null;
  }
}

/**
 * Get all published garage sales for sitemap
 * Returns recent and upcoming sales
 */
export async function getGarageSalesForSitemap(): Promise<Array<{
  id: string;
  updated_at: string;
}>> {
  try {
    const supabase = await createClient();

    // Get sales from last 30 days and future sales
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('garage_sales')
      .select('id, updated_at')
      .gte('date', thirtyDaysAgo.toISOString())
      .order('date', { ascending: false })
      .limit(1000);

    if (error || !data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching garage sales for sitemap:', error);
    return [];
  }
}

/**
 * Get all published knowledge articles for sitemap
 */
export async function getKnowledgeArticlesForSitemap(): Promise<Array<{
  id: string;
  updated_at: string;
}>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('id, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1000);

    if (error || !data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching knowledge articles for sitemap:', error);
    return [];
  }
}

