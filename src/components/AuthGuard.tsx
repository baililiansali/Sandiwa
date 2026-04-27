import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
      toast.error("Please log in to access this page");
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, navigate, location]);

  if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
    return null;
  }

  return <>{children}</>;
}