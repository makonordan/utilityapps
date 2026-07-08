import type { Metadata } from "next";

import { Dashboard } from "@/components/admin/Dashboard";
import { getAdminStats } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};

// Always render fresh — admin views shouldn't be served from cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const stats = await getAdminStats();
  return <Dashboard stats={stats} />;
}
