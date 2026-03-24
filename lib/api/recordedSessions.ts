import { supabase } from '../supabase/client';
import { RecordedSession } from '../../types/database';

export const extractYouTubeId = (url: string) => {
  if (!url) return null;
  // If it's already an ID, return it
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const recordedSessionsApi = {
  async getRecordedSessionsByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('recorded_sessions')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data as RecordedSession[];
  },

  async createRecordedSession(session: Omit<RecordedSession, 'id' | 'created_at' | 'order_index'>) {
    const videoId = extractYouTubeId(session.video_url);
    if (!videoId) throw new Error("Invalid YouTube URL");

    const { data, error } = await (supabase.from('recorded_sessions') as any)
      .insert([{
        ...session,
        video_url: videoId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as RecordedSession;
  },

  async updateRecordedSession(id: string, updates: Partial<RecordedSession>) {
    const finalUpdates = { ...updates };
    if (updates.video_url) {
      const videoId = extractYouTubeId(updates.video_url);
      if (!videoId) throw new Error("Invalid YouTube URL");
      finalUpdates.video_url = videoId;
    }

    const { data, error } = await (supabase.from('recorded_sessions') as any)
      .update(finalUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as RecordedSession;
  },

  async deleteRecordedSession(id: string) {
    const { error } = await supabase
      .from('recorded_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async reorderSessions(sessions: { id: string, order_index: number }[]) {
    // Supabase doesn't support bulk update easily without RPC, so we do individual updates
    // For a small number of sessions, this is fine.
    const promises = sessions.map(s => 
      (supabase.from('recorded_sessions') as any).update({ order_index: s.order_index }).eq('id', s.id)
    );
    const results = await Promise.all(promises);
    const firstError = results.find(r => r.error);
    if (firstError) throw firstError.error;
    return true;
  },

  async trackView(sessionId: string, userId: string) {
    const { error } = await (supabase
      .from('session_views') as any)
      .insert([{ session_id: sessionId, user_id: userId }]);
    
    // We don't throw error here to avoid blocking the UI if tracking fails
    if (error) console.error("Failed to track session view", error);
  },

  async getViews(sessionId: string) {
    const { count, error } = await supabase
      .from('session_views')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);
    
    if (error) throw error;
    return count || 0;
  }
};
