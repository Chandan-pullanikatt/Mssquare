import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

export type BusinessProject = Database['public']['Tables']['business_projects']['Row'];
export type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];
export type ConsultancyService = Database['public']['Tables']['consultancy_services']['Row'];

export const businessApi = {
  // Projects
  async getProjects(userId?: string) {
    let query = supabase
      .from('business_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getAdminProjects() {
    const { data, error } = await supabase
      .from('business_projects')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Service Requests
  async getServiceRequests(userId?: string) {
    let query = supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getAdminServiceRequests() {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async submitServiceRequest(request: Omit<Database['public']['Tables']['service_requests']['Insert'], 'id' | 'created_at' | 'status'>) {
    const { data, error } = await (supabase.from('service_requests') as any)
      .insert({
        ...request,
        status: 'Pending Review'
      })
      .select()
      .single();

    if (error) throw error;
    return data as ServiceRequest;
  },

  // Consultancy Services
  async getConsultancyServices() {
    const { data, error } = await (supabase.from('consultancy_services') as any)
      .select('*')
      .order('name');

    if (error) throw error;
    return data as ConsultancyService[];
  },

  // Update Status (for Admin)
  async updateRequestStatus(id: string, status: string) {
    const { data, error } = await (supabase.from('service_requests') as any)
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ServiceRequest;
  },

  async updateProjectProgress(id: string, progress: number, status?: string) {
    const updateData: any = { progress };
    if (status) updateData.status = status;

    const { data, error } = await (supabase.from('business_projects') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BusinessProject;
  }
};
