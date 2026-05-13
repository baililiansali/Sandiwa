import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";

export const Route = createFileRoute("/mentor/_layout")({
  beforeLoad: ({ location }) => {
    console.log("🔵 Mentor _layout beforeLoad - location:", location.pathname);
    
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";
    
    console.log("🔵 isLoggedIn:", isLoggedIn, "userRole:", userRole);
    
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    
    if (userRole !== "mentor") {
      throw redirect({
        to: "/learner/dashboard",
      });
    }
  },
  component: MentorLayout,
});

function MentorLayout() {
  console.log("🟢 MentorLayout component is rendering!");
  
  return (
    <div style={{ border: "5px solid red", minHeight: "100vh" }}>
      <h1 style={{ background: "yellow", padding: "10px", color: "black" }}>LAYOUT IS WORKING!</h1>
      <MentorDashboardLayout>
        <Outlet />
      </MentorDashboardLayout>
    </div>
  );
}