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
  Users,
  Clock,
  Plus
} from "lucide-react";
import { notificationsApi, Notification, NotificationTarget, NotificationType } from "@/lib/api/notifications";

export default function LMSNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<NotificationTarget>("student");
  const [type, setType] = useState<NotificationType>("info");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const data = await notificationsApi.getNotifications();
      // Filter for student or all (relevant to LMS)
      setNotifications(data.filter(n => n.target_role === 'student' || n.target_role === 'all'));
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
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic tracking-tight">Notification Center</h1>
          <p className="text-gray-500 font-medium">Broadcast alerts and updates to the student portal.</p>
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
              <h2 className="text-xl font-bold text-gray-900 italic">Push Alert</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Alert Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Course Available!"
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none transition-all placeholder:text-gray-300 italic"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details of the announcement..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none transition-all placeholder:text-gray-300 italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Recipient</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value as NotificationTarget)}
                    className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none"
                  >
                    <option value="student">Students Only</option>
                    <option value="all">Everyone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Alert Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as NotificationType)}
                    className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none"
                  >
                    <option value="info">Information</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
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
                    Broadcast Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sent History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 italic">Broadcast History</h2>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {notifications.length} Sent
            </div>
          </div>

          {loading ? (
             <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center gap-4">
               <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
               <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing history...</p>
             </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-gray-100 border-dashed rounded-[2.5rem] p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                <Bell size={32} />
              </div>
              <p className="text-gray-500 font-bold italic">No broadcasts sent yet.</p>
              <p className="text-xs text-gray-400 mt-2">Use the form on the left to send your first alert.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {notifications.map((n) => (
                <div key={n.id} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-black/5 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                        n.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                        n.type === 'error' ? 'bg-rose-50 text-rose-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        {n.type === 'success' ? <CheckCircle size={24} /> :
                         n.type === 'warning' ? <AlertTriangle size={24} /> :
                         n.type === 'error' ? <AlertCircle size={24} /> :
                         <Info size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-gray-900 italic">{n.title}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            n.target_role === 'all' ? 'bg-purple-50 text-[#8b5cf6]' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {n.target_role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed italic mb-4 max-w-xl">{n.message}</p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {new Date(n.created_at).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={12} />
                            Broadcast
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-3 rounded-2xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
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
