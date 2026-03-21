import { supabase } from '../supabase/client';
import { Project } from '../../types/database';

export const projectsApi = {
  async getProjectsByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await (supabase.from('projects') as any)
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await (supabase.from('projects') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Milestone Methods
  async getProjectMilestones(projectId: string) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addMilestone(milestone: any) {
    const { data, error } = await (supabase.from('project_milestones') as any)
      .insert([milestone])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMilestone(id: string, updates: any) {
    const { data, error } = await (supabase.from('project_milestones') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMilestone(id: string) {
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
