"use client";

import { BarChart3, TrendingUp, PieChart, Activity, Download, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Advanced Analytics</h1>
          <p className="text-gray-500 font-medium">Deep dive into platform performance and student engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <Calendar size={18} />
            <span>Last 30 Days</span>
          </button>
          <button className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 transition-all flex items-center gap-2">
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder Charts */}
        {[
          { title: "Course Popularity", icon: Activity, color: "text-[#8b5cf6]", bg: "bg-purple-50" },
          { title: "Student Activity", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "Completion Rate", icon: PieChart, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((chart, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-gray-900">{chart.title}</h3>
              <div className={`p-2 rounded-xl ${chart.bg} ${chart.color}`}>
                <chart.icon size={20} />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-full h-40 flex items-end justify-around gap-2 mb-8">
                {[40, 70, 45, 90, 65, 80, 50].map((h, index) => (
                  <div 
                    key={index} 
                    className={`w-full rounded-t-lg transition-all duration-1000 ${chart.color.replace('text', 'bg').replace('500', '400')}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-gray-900">74% Growth</p>
              <p className="text-xs text-gray-400 font-medium">Compared to previous period</p>
            </div>
          </div>
        ))}
      </div>

      {/* Large Featured Report */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border-l-8 border-l-[#8b5cf6]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-[10px] font-extrabold text-[#8b5cf6] bg-purple-50 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">Revenue Trends</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">Your revenue has increased by <span className="text-[#8b5cf6]">18.4%</span> this quarter.</h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">Platform-wide revenue is trending upwards driven primarily by the new "AI Implementation" courses and increased subscription renewals.</p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Earnings</div>
                <div className="text-2xl font-extrabold text-gray-900">$142,480</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Growth Forecast</div>
                <div className="text-2xl font-extrabold text-[#8b5cf6]">+22.5%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 h-64 rounded-3xl flex items-center justify-center text-gray-300">
            <BarChart3 size={64} />
          </div>
        </div>
      </div>
    </div>
  );
}
