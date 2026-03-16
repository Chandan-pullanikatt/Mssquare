import { LucideIcon } from "lucide-react";
import { COLORS } from "@/lib/design-tokens";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  badge?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trendBg?: string;
  trendColor?: string;
}

export default function StatsCard({
  title,
  value,
  trend,
  badge,
  icon: Icon,
  iconBg,
  iconColor,
  trendBg = "bg-green-50",
  trendColor = "text-green-600",
}: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-primary-purple/20 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${trendBg} ${trendColor}`}>
            {trend}
          </div>
        )}
        {badge && (
          <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-100">
            {badge}
          </div>
        )}
      </div>
      <div>
        <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</div>
      </div>
    </div>
  );
}
