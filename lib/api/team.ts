import { supabase } from '../supabaseClient';
import { TeamMember } from '../../types/database';

export const teamApi = {
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TeamMember[];
  },

  async createTeamMember(member: Omit<TeamMember, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('team_members') as any)
      .insert([member])
      .select()
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  async updateTeamMember(id: string, updates: Partial<TeamMember>) {
    const { data, error } = await (supabase.from('team_members') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TeamMember;
  },

  async deleteTeamMember(id: string) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
