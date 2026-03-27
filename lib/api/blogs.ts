import { supabase } from '../supabase/client';
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

  async getBlogById(id: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id);
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Blog post not found");
    return data[0] as Blog;
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
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Could not update blog: Row not found or permission denied");
    return data[0] as Blog;
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
