'use client';

import { Users } from "lucide-react";
import Link from "next/link";

export default function InstructorStudents() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Students</h1>
        <p className="text-gray-500 font-medium tracking-tight">Track student progress and engagement across your courses.</p>
      </div>

      <div className="py-40 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Users className="text-gray-300" size={32} />
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No students found</p>
        <p className="text-sm text-gray-500 mt-2">View student profiles and their performance metrics.</p>
        <Link href="/instructor/dashboard" className="inline-block mt-6 text-[#8b5cf6] font-bold hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
