import { supabase } from '../supabase/client';
import { CertificationMetadata } from '../../types/database';

export const certificationMetadataApi = {
  async getCertificationByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('certification_metadata')
      .select('*')
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (error) throw error;
    return data as CertificationMetadata | null;
  },

  async upsertCertification(metadata: Omit<CertificationMetadata, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('certification_metadata') as any)
      .upsert([metadata], { onConflict: 'course_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data as CertificationMetadata;
  },

  async deleteCertification(id: string) {
    const { error } = await supabase
      .from('certification_metadata')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
