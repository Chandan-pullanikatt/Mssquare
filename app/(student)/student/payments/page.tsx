"use client";

import {
    CreditCard,
    Download,
    Filter,
    Search,
    ChevronRight,
    TrendingUp,
    Receipt,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";

const payments = [
    {
        id: "INV-2024-001",
        course: "Full Stack Web Development",
        date: "Oct 12, 2024",
        amount: "$588.82",
        status: "Successful",
        method: "Visa •••• 4242",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        id: "INV-2024-002",
        course: "UI/UX Design Masterclass",
        date: "Sep 25, 2024",
        amount: "$499.00",
        status: "Successful",
        method: "Mastercard •••• 8812",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        id: "INV-2024-003",
        course: "Advanced React Patterns",
        date: "Aug 10, 2024",
        amount: "$299.00",
        status: "Successful",
        method: "UPI / PhonePe",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        id: "INV-2024-004",
        course: "Data Science Specialization",
        date: "Jul 05, 2024",
        amount: "$750.00",
        status: "Failed",
        method: "Visa •••• 4242",
        color: "text-rose-600",
        bg: "bg-rose-50"
    }
];

export default function PaymentsPage() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">Payment History</h1>
                    <p className="text-gray-500 font-medium">Manage your subscriptions, invoices, and billing details.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all">
                    <Download size={18} />
                    <span>Download All Statements</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b5cf6]">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Spent</div>
                        <div className="text-2xl font-extrabold text-gray-900">$2,137.82</div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Courses</div>
                        <div className="text-2xl font-extrabold text-gray-900">3 Premium</div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Next Billing</div>
                        <div className="text-2xl font-extrabold text-gray-900">Nov 15, 2024</div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">

                {/* Table Toolbar */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by invoice ID or course name..."
                            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-medium text-gray-700 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={16} />
                            Filter
                        </button>
                        <select className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none cursor-pointer">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                            <option>All Time</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Transaction Details</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#8b5cf6]/10 group-hover:text-[#8b5cf6] transition-colors">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 leading-tight mb-1">{payment.course}</div>
                                                <div className="text-[11px] font-medium text-gray-400">{payment.id} • {payment.method}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-semibold text-gray-600">{payment.date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-gray-900">{payment.amount}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${payment.bg} ${payment.color}`}>
                                            {payment.status === "Successful" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                            {payment.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-gray-400 hover:text-[#8b5cf6] transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination/Load More */}
                <div className="p-8 border-t border-gray-100 flex items-center justify-center">
                    <button className="text-sm font-bold text-gray-500 hover:text-[#8b5cf6] transition-colors flex items-center gap-2">
                        Show More Transactions
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}
