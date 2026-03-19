"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Send, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Briefcase,
  Clock,
  Plus
} from "lucide-react";
import { notificationsApi, Notification, NotificationTarget, NotificationType } from "@/lib/api/notifications";

export default function BusinessNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<NotificationTarget>("business_client");
  const [type, setType] = useState<NotificationType>("info");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const data = await notificationsApi.getNotifications();
      // Filter for business_client or all (relevant to Business Admin)
      setNotifications(data.filter(n => n.target_role === 'business_client' || n.target_role === 'all'));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!title || !message) {
      setError("Please fill in both title and message.");
      return;
    }

    try {
      setIsSending(true);
      setError(null);
      await notificationsApi.sendNotification({
        title,
        message,
        target_role: target,
        type
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      
      // Refresh list
      fetchNotifications();
    } catch (err) {
      console.error("Error sending notification:", err);
      setError("Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      await notificationsApi.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification.");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic tracking-tight">Business Notifications</h1>
          <p className="text-gray-500 font-medium">Send real-time updates to your business partners and clients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Notification Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm shadow-black/5 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#f5f3ff] text-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-sm">
                <Plus size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 italic font-heading">New Broadcast</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Subject</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Project Update: Q1 Milestone"
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none transition-all placeholder:text-gray-300 italic"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Message Content</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details of the business update..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none transition-all placeholder:text-gray-300 italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Audience</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value as NotificationTarget)}
                    className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none appearance-none"
                  >
                    <option value="business_client">Business Clients</option>
                    <option value="all">Everyone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Importance</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as NotificationType)}
                    className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none appearance-none"
                  >
                    <option value="info">General</option>
                    <option value="success">Positive</option>
                    <option value="warning">Attention</option>
                    <option value="error">Critical</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-bold">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={isSending}
                className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#8b5cf6]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sent History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 italic font-heading">Partner Comm History</h2>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {notifications.length} Sent
            </div>
          </div>

          {loading ? (
             <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center gap-4">
               <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Updating history...</p>
             </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-gray-100 border-dashed rounded-[2.5rem] p-20 text-center shadow-sm shadow-black/5">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-4 border border-gray-100">
                <Bell size={32} />
              </div>
              <p className="text-gray-500 font-bold italic">No business updates sent yet.</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Use the left panel to communicate with your clients.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {notifications.map((n) => (
                <div key={n.id} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-black/5 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#8b5cf6]" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                        n.type === 'success' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                        n.type === 'warning' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                        n.type === 'error' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                        'bg-blue-50 text-blue-500 border-blue-100'
                      }`}>
                        {n.type === 'success' ? <CheckCircle size={24} /> :
                         n.type === 'warning' ? <AlertTriangle size={24} /> :
                         n.type === 'error' ? <AlertCircle size={24} /> :
                         <Info size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h4 className="font-bold text-lg text-gray-900 italic tracking-tight">{n.title}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm ${
                            n.target_role === 'all' ? 'bg-purple-50 text-[#8b5cf6] border border-[#8b5cf6]/10' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {n.target_role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed italic mb-4 max-w-xl line-clamp-3">{n.message}</p>
                        <div className="flex items-center gap-5 text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-[#8b5cf6]" />
                            {new Date(n.created_at).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase size={12} className="text-[#8b5cf6]" />
                            Partnership Alert
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-3 rounded-2xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
