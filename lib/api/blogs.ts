import { supabase } from '../supabaseClient';
import { Blog } from '../../types/database';

export const blogsApi = {
  async getBlogs(includeUnpublished = false) {
    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Blog[];
  },

  async getBlogBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data as Blog;
  },

  async createBlog(blog: Omit<Blog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog] as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Blog;
  },

  async updateBlog(id: string, updates: Partial<Blog>) {
    const { data, error } = await (supabase.from('blogs') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Blog;
  },

  async deleteBlog(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
