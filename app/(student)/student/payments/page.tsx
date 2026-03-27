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
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSearch } from "@/components/providers/SearchProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";

// Skeleton Component for Loading State
const PaymentSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
                <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-100 rounded"></div>
                    <div className="h-3 w-24 bg-gray-50 rounded"></div>
                </div>
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="h-4 w-24 bg-gray-100 rounded"></div>
        </td>
        <td className="px-8 py-6">
            <div className="h-4 w-16 bg-gray-100 rounded"></div>
        </td>
        <td className="px-8 py-6">
            <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
        </td>
        <td className="px-8 py-6 text-right">
            <div className="h-8 w-8 bg-gray-100 rounded-lg ml-auto"></div>
        </td>
    </tr>
);

export default function PaymentsPage() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery, setSearchQuery } = useSearch();
    const [filterRange, setFilterRange] = useState("all");

    useEffect(() => {
        async function fetchPayments() {
            if (!user) return;
            try {
                setLoading(true);
                const data = await enrollmentsApi.getEnrollmentsByUser(user.id);
                // Sort by date descending
                const sortedData = (data || []).sort((a: any, b: any) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setEnrollments(sortedData);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPayments();
    }, [user]);

    // Calculate dynamic stats
    const stats = useMemo(() => {
        const successful = enrollments.filter(e => e.payment_status === 'success');
        const totalSpent = successful.reduce((sum, e) => sum + (e.amount || 0), 0);
        const activeCourses = new Set(successful.map(e => e.course_id)).size;
        
        return {
            totalSpent: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpent),
            activeCourses: activeCourses,
            nextBilling: "One-time Payment" // Adjust if subscription support is added
        };
    }, [enrollments]);

    // Filtered enrollments based on search and selected range
    const filteredEnrollments = useMemo(() => {
        return enrollments.filter(payment => {
            const matchesSearch = 
                payment.courses?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.payment_id?.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Simple date filtering (example)
            if (filterRange === "6months") {
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                return matchesSearch && new Date(payment.created_at) >= sixMonthsAgo;
            }
            
            return matchesSearch;
        });
    }, [enrollments, searchQuery, filterRange]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">Payment History</h1>
                    <p className="text-gray-500 font-medium">Manage your subscriptions, invoices, and billing details.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all disabled:opacity-50" disabled={loading}>
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
                        <div className="text-2xl font-extrabold text-gray-900">{loading ? "..." : stats.totalSpent}</div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Courses</div>
                        <div className="text-2xl font-extrabold text-gray-900">{loading ? "..." : `${stats.activeCourses} Premium`}</div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Billing Type</div>
                        <div className="text-2xl font-extrabold text-gray-900">{loading ? "..." : stats.nextBilling}</div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px]">

                {/* Table Toolbar */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by payment ID or course name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-medium text-gray-700 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={16} />
                            Filter
                        </button>
                        <select 
                            className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none cursor-pointer"
                            value={filterRange}
                            onChange={(e) => setFilterRange(e.target.value)}
                        >
                            <option value="all">All Time</option>
                            <option value="6months">Last 6 Months</option>
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
                            {loading ? (
                                <>
                                    <PaymentSkeleton />
                                    <PaymentSkeleton />
                                    <PaymentSkeleton />
                                </>
                            ) : filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map((payment, i) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#8b5cf6]/10 group-hover:text-[#8b5cf6] transition-colors">
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 leading-tight mb-1">
                                                        {payment.courses?.title || "Course Access"}
                                                    </div>
                                                    <div className="text-[11px] font-medium text-gray-400">
                                                        {payment.payment_id || "N/A"} • Razorpay
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-semibold text-gray-600">
                                                {new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-gray-900">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount || 0)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                payment.payment_status === "success" 
                                                    ? "bg-emerald-50 text-emerald-600" 
                                                    : "bg-rose-50 text-rose-600"
                                            }`}>
                                                {payment.payment_status === "success" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {payment.payment_status === "success" ? "Successful" : (payment.payment_status || "Processing")}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-400 hover:text-[#8b5cf6] transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100">
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <CreditCard size={32} />
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">No transactions found</div>
                                            <p className="text-gray-500 max-w-xs">You haven&apos;t made any course purchases yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination/Load More */}
                {!loading && filteredEnrollments.length > 0 && (
                    <div className="p-8 border-t border-gray-100 flex items-center justify-center">
                        <button className="text-sm font-bold text-gray-500 hover:text-[#8b5cf6] transition-colors flex items-center gap-2">
                            Show More Transactions
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
