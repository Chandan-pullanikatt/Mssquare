import { supabase } from '../supabase/client';
import { Lead } from '../../types/database';


export const leadsApi = {
  async submitLead(lead: Omit<Lead, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('leads') as any)
      .insert([lead])
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  },

  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Lead[];
  }
};
