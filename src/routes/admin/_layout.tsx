import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: ({ location }) => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    
    if (userRole !== "admin") {
      throw redirect({
        to: "/learner/dashboard",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminDashboardLayout>
      <Outlet />
    </AdminDashboardLayout>
  );
}