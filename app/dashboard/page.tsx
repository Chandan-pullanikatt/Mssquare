"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { authHelpers } from "@/utils/authHelpers";

export default function DashboardRedirect() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else if (role) {
        const redirectPath = authHelpers.getRedirectPath(role);
        router.push(redirectPath);
      } else {
        // Fallback if role is not found yet, default to student or home
        router.push("/student/dashboard");
      }
    }
  }, [user, role, loading, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin"></div>
        <p className="text-[#334155] font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
