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
    const { data: projects, error } = await supabase
      .from('business_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!projects || projects.length === 0) return [];

    // Fetch profiles separately to avoid relationship issues
    const userIds = [...new Set(projects.map((p: any) => p.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    return projects.map((p: any) => ({
      ...p,
      profiles: profiles?.find((pr: any) => pr.id === p.user_id) || null
    }));
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
    const { data: requests, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!requests || requests.length === 0) return [];

    // Fetch profiles separately
    const userIds = [...new Set(requests.map((r: any) => r.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    return requests.map((r: any) => ({
      ...r,
      profiles: profiles?.find((pr: any) => pr.id === r.user_id) || null
    }));
  },

  async submitServiceRequest(request: Omit<Database['public']['Tables']['service_requests']['Insert'], 'id' | 'created_at' | 'status'>) {
    const { error } = await (supabase.from('service_requests') as any)
      .insert({
        ...request,
        status: 'Pending Review'
      });

    if (error) throw error;
    return { ...request, status: 'Pending Review' } as ServiceRequest;
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
  },

  async approveRequest(requestId: string, userId: string, title: string, description: string) {
    // 1. Update request status
    const { error: requestError } = await (supabase.from('service_requests') as any)
      .update({ status: 'Approved' })
      .eq('id', requestId);
    
    if (requestError) throw requestError;

    // 2. Create project
    const { data: projectData, error: projectError } = await (supabase.from('business_projects') as any)
      .insert({
        user_id: userId,
        title,
        description,
        status: 'Active',
        progress: 0,
        icon_name: 'TrendingUp'
      })
      .select()
      .single();

    if (projectError) throw projectError;
    return projectData as BusinessProject;
  },

  async getAdminClients() {
    // Fetch profiles first
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'business_client');

    if (profileError) throw profileError;
    if (!profiles || profiles.length === 0) return [];

    // Fetch counts manually to avoid join issues
    const { data: requests } = await supabase
      .from('service_requests')
      .select('user_id');
    
    const { data: projects } = await supabase
      .from('business_projects')
      .select('user_id');

    return profiles.map((profile: any) => ({
      ...profile,
      service_requests: [{ count: requests?.filter((r: any) => r.user_id === profile.id).length || 0 }],
      business_projects: [{ count: projects?.filter((p: any) => p.user_id === profile.id).length || 0 }]
    }));
  },

  // Enquiries
  async submitEnquiry(enquiry: {
    user_id: string;
    request_id?: string;
    project_id?: string;
    subject: string;
    message: string;
  }) {
    const { data, error } = await (supabase.from('business_enquiries') as any)
      .insert({
        ...enquiry,
        status: 'Open'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEnquiries(userId: string) {
    const { data, error } = await (supabase.from('business_enquiries') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAdminEnquiries() {
    const { data: enquiries, error } = await (supabase.from('business_enquiries') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!enquiries || enquiries.length === 0) return [];

    // Fetch users (the table that officially holds user names)
    const userIds = [...new Set(enquiries.map((e: any) => e.user_id))];
    const { data: userData } = await supabase
      .from('users')
      .select('id, name')
      .in('id', userIds);

    // Also fetch from profiles for email
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    return enquiries.map((e: any) => {
      const user = userData?.find((u: any) => u.id === e.user_id) as any || null;
      const profile = profileData?.find((p: any) => p.id === e.user_id) as any || null;
      
      return {
        ...e,
        profiles: {
          full_name: user?.name || profile?.email?.split('@')[0] || 'Client',
          email: profile?.email || ''
        }
      };
    });
  },

  async updateEnquiryStatus(id: string, status: string) {
    const { data, error } = await (supabase.from('business_enquiries') as any)
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async replyToEnquiry(id: string, reply: string) {
    const { data, error } = await (supabase.from('business_enquiries') as any)
      .update({ 
        admin_reply: reply, 
        replied_at: new Date().toISOString(),
        status: 'In Progress' 
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
};
