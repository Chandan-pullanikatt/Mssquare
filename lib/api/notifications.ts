import { supabase } from '../supabase/client';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationTarget = 'student' | 'business_client' | 'all';

export interface Notification {
  id: string;
  title: string;
  message: string;
  target_role: NotificationTarget;
  sender_id?: string;
  type: NotificationType;
  created_at: string;
}

export const notificationsApi = {
  async getNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Notification[];
  },

  async sendNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('notifications') as any)
      .insert([notification])
      .select()
      .single();
    
    if (error) throw error;
    return data as Notification;
  },

  async deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
