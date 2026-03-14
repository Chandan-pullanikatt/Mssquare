"use client";

import { useState } from "react";
import { Settings, Mail, CreditCard, Award, Shield, Globe, Bell, Save } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "email" | "payments" | "certificates">("general");

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "email", label: "Email Config", icon: Mail },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "certificates", label: "Certificates", icon: Award },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Platform Settings</h1>
          <p className="text-gray-500 font-medium">Configure global platform behavior and integrations.</p>
        </div>
        <button className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id
                  ? "bg-white text-[#8b5cf6] shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? "text-[#8b5cf6]" : "text-gray-400"} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Platform Name</label>
                    <input 
                      type="text" 
                      defaultValue="MSsquare LMS"
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Support Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@mssquare.com"
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Maintenance Mode</label>
                  <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem]">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 mb-1">Enable Maintenance</p>
                      <p className="text-xs text-gray-500">Temporarily disable student access for updates.</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                   <h3 className="font-bold text-gray-900 mb-4">Branding</h3>
                   <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-gray-50 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#8b5cf6] transition-colors">
                        <Globe size={24} />
                        <span className="text-[10px] mt-1 font-bold">Logo</span>
                     </div>
                     <p className="text-xs text-gray-500 max-w-xs font-medium leading-relaxed">Recommended size 512x512px. Supports PNG, JPG or SVG.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab !== "general" && (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-40 grayscale group">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Shield size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Configuration Required</h3>
                <p className="text-sm text-gray-500 font-medium">This section requires active API tokens to configure.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
