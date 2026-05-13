import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true" || 
                      sessionStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      setAuthChecked(true);

      if (!loggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
        toast.error("Please log in to access this page");
        navigate({ to: "/login" });
      }
    }
  }, [navigate, location]);

  if (!authChecked) {
    return null;
  }

  if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
    return null;
  }

  return <>{children}</>;
}