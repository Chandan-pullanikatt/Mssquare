import { supabase } from '../supabase/client';
import { WebsiteSection } from '../../types/database';

export const websiteApi = {
  async getSection(sectionName: string) {
    const { data, error } = await supabase
      .from('website_sections')
      .select('*')
      .eq('section_name', sectionName)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Handle not found separately if needed
    return data as WebsiteSection | null;
  },

  async updateSection(sectionName: string, content: any) {
    const { data, error } = await (supabase.from('website_sections') as any)
      .upsert({ section_name: sectionName, content_json: content, updated_at: new Date().toISOString() }, { onConflict: 'section_name' })
      .select()
      .single();
    
    if (error) throw error;
    return data as WebsiteSection;
  },

  async getAllSections() {
    const { data, error } = await supabase
      .from('website_sections')
      .select('*');
    
    if (error) throw error;
    return data as WebsiteSection[];
  }
};
