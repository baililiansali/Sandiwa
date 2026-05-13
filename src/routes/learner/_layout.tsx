import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Route = createFileRoute("/learner/_layout")({
  beforeLoad: ({ location }) => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    
    if (userRole !== "learner") {
      throw redirect({
        to: "/mentor/dashboard",
      });
    }
  },
  component: LearnerLayout,
});

function LearnerLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}