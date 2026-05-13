import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";

export const Route = createFileRoute("/mentor-learner/_layout")({
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
    <MentorDashboardLayout>
      <Outlet />
    </MentorDashboardLayout>
  );
}