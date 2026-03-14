import { supabase } from '../supabaseClient';
import { Certificate } from '../../types/database';

export const certificatesApi = {
  async issueCertificate(certificate: Omit<Certificate, 'id' | 'issued_at'>) {
    const { data, error } = await (supabase.from('certificates') as any)
      .insert([certificate])
      .select()
      .single();
    
    if (error) throw error;
    return data as Certificate;
  },

  async getUserCertificates(userId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async getCertificateById(id: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title), users(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};
