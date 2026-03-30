import { supabase } from '../supabase/client';
import { Lead } from '../../types/database';


export const leadsApi = {
  async submitLead(lead: Omit<Lead, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('leads') as any)
      .insert([lead]);
    
    if (error) throw error;
    return data;
  },

  async getLeads(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, email, company, message, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data as Lead[];
  }
};
