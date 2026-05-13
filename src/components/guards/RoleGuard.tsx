import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/dashboard" }: RoleGuardProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "learner";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      toast.error("Please log in to access this page");
      navigate({ to: "/login" });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      toast.error("You don't have permission to access this area");
      navigate({ to: redirectTo });
    }
  }, []);

  return <>{children}</>;
}