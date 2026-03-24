"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react";
import { notificationsApi, Notification } from "@/lib/api/notifications";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchNotifications() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const [notificationsData, enrollmentsData] = await Promise.all([
          notificationsApi.getNotifications(),
          enrollmentsApi.getEnrollmentsByUser(user.id)
        ]);
        
        const enrolledCourseIds = enrollmentsData.map((e: any) => e.course_id);
        
        // Filter for students or all, and match course_id if present
        setNotifications(notificationsData.filter(n => {
          const isTargetRole = n.target_role === 'student' || n.target_role === 'all';
          const isCourseMatch = !n.course_id || enrolledCourseIds.includes(n.course_id);
          return isTargetRole && isCourseMatch;
        }));
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user?.id]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'border-emerald-100 bg-emerald-50/30 text-emerald-600';
      case 'warning': return 'border-amber-100 bg-amber-50/30 text-amber-600';
      case 'error': return 'border-rose-100 bg-rose-50/30 text-rose-600';
      default: return 'border-blue-100 bg-blue-50/30 text-blue-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">Notification Center</h1>
          <p className="text-gray-500 font-medium">Clear updates on your learning journey and announcements.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 italic mb-2">Inbox is Clear</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We'll let you know here as soon as there's a new update or course announcement.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div key={n.id} className="p-8 hover:bg-gray-50/50 transition-all group relative">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${getTypeStyles(n.type)} shadow-sm`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 italic mb-1">{n.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#8b5cf6]" />
                              {new Date(n.created_at).toLocaleString()}
                           </div>
                           <span className="w-1 h-1 bg-gray-300 rounded-full" />
                           <span className="text-[#8b5cf6]">Academic Broadcast</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border ${
                        n.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        'bg-purple-50 text-[#8b5cf6] border-[#8b5cf6]/10'
                      }`}>
                        {n.type}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-medium italic max-w-3xl">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
         <div className="flex justify-center pb-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
               End of notifications history
            </p>
         </div>
      )}
    </div>
  );
}
