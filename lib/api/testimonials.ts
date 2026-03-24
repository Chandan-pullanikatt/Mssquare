import { supabase } from '../supabase/client';
import { Testimonial } from '../../types/database';


export const testimonialsApi = {
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Testimonial[];
  },

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('testimonials') as any)
      .insert([testimonial])
      .select()
      .single();
    
    if (error) throw error;
    return data as Testimonial;
  },

  async updateTestimonial(id: string, updates: Partial<Testimonial>) {
    const { data, error } = await (supabase.from('testimonials') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Testimonial;
  },

  async deleteTestimonial(id: string) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
