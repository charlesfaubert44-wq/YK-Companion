import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/knowledge/categories - Get all active categories
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('knowledge_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/knowledge/categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
