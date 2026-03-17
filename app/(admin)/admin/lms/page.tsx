import { redirect } from "next/navigation";

export default function LMSAdminRoot() {
  redirect("/admin/lms/dashboard");
}
