"use client";

import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import DataTable from "@/components/admin/DataTable";

export default function PaymentsManagement() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$48,240.50",
      trend: "+24.5%",
      icon: DollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Active Subscriptions",
      value: "142",
      trend: "+12",
      icon: CreditCard,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg. Transaction",
      value: "$145.20",
      icon: ArrowUpRight,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Refund Rate",
      value: "1.2%",
      trend: "-0.5%",
      trendBg: "bg-blue-50",
      trendColor: "text-blue-600",
      icon: ArrowDownRight,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const transactions = [
    { id: "#TR-4401", student: "Alex Rivera", course: "UI/UX Masterclass", amount: "$199.00", date: "Oct 12, 2025", status: "Completed" },
    { id: "#TR-4398", student: "Sarah Connor", course: "Fullstack Web Dev", amount: "$249.00", date: "Oct 11, 2025", status: "Completed" },
    { id: "#TR-4395", student: "John Doe", course: "AI Fundamentals", amount: "$150.00", date: "Oct 10, 2025", status: "Pending" },
    { id: "#TR-4392", student: "Emily Blunt", course: "React Masterclass", amount: "$299.00", date: "Oct 09, 2025", status: "Refunded" },
  ];

  const columns = [
    { 
        header: "Transaction", 
        accessor: "id",
        render: (val: string) => <span className="font-bold text-gray-900">{val}</span>
    },
    { header: "Student", accessor: "student" },
    { header: "Amount", accessor: "amount", render: (val: string) => <span className="font-extrabold text-gray-900">{val}</span> },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "Completed"
              ? "bg-green-50 text-green-600 border border-green-100"
              : val === "Pending"
              ? "bg-amber-50 text-amber-600 border border-amber-100"
              : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}
        >
          {val}
        </span>
      ),
    },
    { header: "Date", accessor: "date" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payments & Revenue</h1>
          <p className="text-gray-500 font-medium">Monitor financial performance and manage transactions.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <DataTable
        title="Recent Transactions"
        columns={columns}
        data={transactions}
        searchPlaceholder="Search transactions..."
        actions={
          <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Filter size={16} />
            Filter
          </button>
        }
      />
    </div>
  );
}
