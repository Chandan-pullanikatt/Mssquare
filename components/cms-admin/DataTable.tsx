"use client";

import { Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "@/lib/design-tokens";
import { useSearch } from "@/components/providers/SearchProvider";
import { useState, useMemo } from "react";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
  showRowActions?: boolean;
}

export default function DataTable({
  columns,
  data,
  title,
  searchPlaceholder = "Search...",
  actions,
  isLoading = false,
  showRowActions = true,
}: DataTableProps) {
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      return columns.some((col) => {
        const value = row[col.accessor];
        if (value == null) return false;
        
        // Handle nested objects or simple values
        const stringValue = typeof value === 'object' ? JSON.stringify(value).toLowerCase() : String(value).toLowerCase();
        return stringValue.includes(query);
      });
    });
  }, [data, searchQuery, columns]);

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      {(title || searchPlaceholder || actions) && (
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          <div className="flex flex-1 items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-purple/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
              />
            </div>
            <button className="p-2.5 rounded-2xl bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
              <Filter size={20} />
            </button>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((column, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50"
                >
                  {column.header}
                </th>
              ))}
              {showRowActions && <th className="px-6 py-4 border-b border-gray-50"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-8">
                      <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                    </td>
                  ))}
                  <td className="px-6 py-8"></td>
                </tr>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors group">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm font-medium text-gray-700">
                      {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                    </td>
                  ))}
                  {showRowActions && (
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (showRowActions ? 1 : 0)} className="px-6 py-20 text-center">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-50 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Showing <span className="text-gray-900">{filteredData.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 rounded-xl bg-primary-purple text-white shadow-lg shadow-primary-purple/20 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
