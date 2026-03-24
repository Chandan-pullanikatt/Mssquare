"use client";

import { useState, useEffect } from "react";
import { Bell, X, Clock, Info, CheckCircle, AlertTriangle, AlertCircle, ChevronRight } from "lucide-react";
import { notificationsApi, Notification, NotificationTarget } from "@/lib/api/notifications";
import Link from "next/link";

interface NotificationBellProps {
  targetRole: NotificationTarget;
}

export function NotificationBell({ targetRole }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const data = await notificationsApi.getNotifications();
        // Filter by target role or 'all'
        const filtered = data.filter(n => n.target_role === targetRole || n.target_role === 'all');
        setNotifications(filtered);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    
    // Optional: Set up real-time subscription here if needed
  }, [targetRole]);

  const unreadCount = notifications.length; // For now, we show all as unread or just the count

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <AlertCircle size={16} className="text-rose-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all ${isOpen ? 'bg-[#f5f3ff] text-[#8b5cf6]' : 'text-gray-500 hover:text-[#8b5cf6] hover:bg-gray-50'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#8b5cf6] rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-black/5 z-50 p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="font-bold text-gray-900">Portal Notifications</h3>
              <span className="text-[10px] font-bold text-[#8b5cf6] bg-purple-50 px-2 py-1 rounded-lg uppercase">
                {unreadCount} Alerts
              </span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 font-medium">Checking for updates...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                    <Bell size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">No new notifications</p>
                  <p className="text-xs text-gray-400 mt-1 italic">Everything is running smoothly.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-5 hover:bg-gray-50 transition-colors group cursor-default">
                      <div className="flex gap-3">
                        <div className="mt-0.5">{getTypeIcon(n.type)}</div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 italic">{n.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed italic">{n.message}</p>
                          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            <Clock size={10} />
                            {new Date(n.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
              <Link 
                href={targetRole === 'student' ? '/student/notifications' : '/business/notifications'}
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest hover:text-[#7c3aed] transition-colors flex items-center justify-center gap-2"
              >
                View All Notifications
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
