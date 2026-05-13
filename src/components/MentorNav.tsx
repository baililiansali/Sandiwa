// import { Link, useLocation } from "@tanstack/react-router";
// import { LogOut, User, Settings, RefreshCw } from "lucide-react";
// import { Translator } from "./Translator"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { NotificationPopover } from "@/components/NotificationPopover";

// export function MentorNav() {
//   const location = useLocation();
//   const [userName, setUserName] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [userInitials, setUserInitials] = useState("");

//   useEffect(() => {
//     const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Jose Reyes";
//     const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "mentor.jose@gmail.com";
//     const initials = localStorage.getItem("userInitials") || sessionStorage.getItem("userInitials") || "JR";
    
//     setUserName(name);
//     setUserEmail(email);
//     setUserInitials(initials);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userInitials");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("isMentor");
//     sessionStorage.clear();
//     toast.success("Logged out successfully");
//     window.location.href = "/";
//   };

//   const switchToLearnerMode = () => {
//     // Save current mentor email to switch back later
//     localStorage.setItem("mentorEmail", userEmail);
//     localStorage.setItem("mentorName", userName);
//     localStorage.setItem("mentorInitials", userInitials);
    
//     // Switch to learner mode
//     localStorage.setItem("userRole", "learner");
//     sessionStorage.setItem("userRole", "learner");
    
//     // Switch to learner email (the linked learner account)
//     const learnerEmail = "learner.Jose@gmail.com";
//     const learnerName = "Jose Reyes";
//     const learnerInitials = "JR";
    
//     localStorage.setItem("userEmail", learnerEmail);
//     localStorage.setItem("userName", learnerName);
//     localStorage.setItem("userInitials", learnerInitials);
//     sessionStorage.setItem("userEmail", learnerEmail);
//     sessionStorage.setItem("userName", learnerName);
//     sessionStorage.setItem("userInitials", learnerInitials);
    
//     toast.success("Switched to Learner Mode");
    
//     setTimeout(() => {
//       window.location.href = "/learner/dashboard";
//     }, 500);
//   };

//   const getRoute = (path: string) => {
//     return `/mentor${path}`;
//   };

//   return (
//     <div className="flex items-center gap-1 sm:gap-2">
//       {/* Switch to Learner Mode Button */}
//       <button 
//         onClick={switchToLearnerMode}
//         className="flex h-9 items-center gap-2 rounded-md border border-gold/30 bg-background px-3 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
//         aria-label="Switch to Learner"
//       >
//         <RefreshCw className="h-4 w-4" />
//         <span className="hidden sm:inline">Switch to Learner</span>
//       </button>

//       <Translator />
      
//       <NotificationPopover seeAllLink={getRoute("/notifications")} />
      
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <button aria-label="Account" className="ml-1 flex h-9 w-9 rounded-full bg-gradient-to-br from-gold to-forest items-center justify-center text-white text-sm font-semibold">
//             {userInitials}
//           </button>
//         </DropdownMenuTrigger>
        
//         <DropdownMenuContent align="end" className="w-56">
//           <DropdownMenuLabel>
//             <div>
//               <p className="text-sm font-semibold">{userName}</p>
//               <p className="text-xs text-muted-foreground font-normal">{userEmail}</p>
//               <p className="text-xs text-gold mt-1">Mentor</p>
//             </div>
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
          
//           <DropdownMenuItem asChild>
//             <Link to={getRoute("/profile")} className="cursor-pointer">
//               <User className="h-4 w-4 mr-2" /> My Profile
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link to={getRoute("/settings")} className="cursor-pointer">
//               <Settings className="h-4 w-4 mr-2" /> Settings
//             </Link>
//           </DropdownMenuItem>
          
//           <DropdownMenuSeparator />
          
//           <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
//             <LogOut className="h-4 w-4 mr-2" /> Log out
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }






























import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, User, Settings, RefreshCw, HelpCircle } from "lucide-react";
import { Translator } from "./Translator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NotificationPopover } from "@/components/NotificationPopover";
import { SupportModal } from "@/components/SupportModal";

export function MentorNav() {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Jose Reyes";
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "mentor.jose@gmail.com";
    const initials = localStorage.getItem("userInitials") || sessionStorage.getItem("userInitials") || "JR";
    
    setUserName(name);
    setUserEmail(email);
    setUserInitials(initials);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isMentor");
    sessionStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const switchToLearnerMode = () => {
    localStorage.setItem("mentorEmail", userEmail);
    localStorage.setItem("mentorName", userName);
    localStorage.setItem("mentorInitials", userInitials);
    
    localStorage.setItem("userRole", "learner");
    sessionStorage.setItem("userRole", "learner");
    
    const learnerEmail = "learner.Jose@gmail.com";
    const learnerName = "Jose Reyes";
    const learnerInitials = "JR";
    
    localStorage.setItem("userEmail", learnerEmail);
    localStorage.setItem("userName", learnerName);
    localStorage.setItem("userInitials", learnerInitials);
    sessionStorage.setItem("userEmail", learnerEmail);
    sessionStorage.setItem("userName", learnerName);
    sessionStorage.setItem("userInitials", learnerInitials);
    
    toast.success("Switched to Learner Mode");
    
    setTimeout(() => {
      window.location.href = "/learner/dashboard";
    }, 500);
  };

  const getRoute = (path: string) => {
    return `/mentor${path}`;
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Switch to Learner Mode Button */}
      <button 
        onClick={switchToLearnerMode}
        className="flex h-9 items-center gap-2 rounded-md border border-gold/30 bg-background px-3 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
        aria-label="Switch to Learner"
      >
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline">Switch to Learner</span>
      </button>

      <Translator />
      
      <NotificationPopover seeAllLink={getRoute("/notifications")} />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Account" className="ml-1 flex h-9 w-9 rounded-full bg-gradient-to-br from-gold to-forest items-center justify-center text-white text-sm font-semibold">
            {userInitials}
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground font-normal">{userEmail}</p>
              <p className="text-xs text-gold mt-1">Mentor</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to={getRoute("/profile")} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" /> My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={getRoute("/settings")} className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Report a Problem / Support Option */}
          <DropdownMenuItem asChild>
            <Link to="/support" className="cursor-pointer text-amber-600 focus:text-amber-600">
              <HelpCircle className="h-4 w-4 mr-2" /> Report a Problem
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Support Modal */}
      <SupportModal 
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        userRole="mentor"
      />
    </div>
  );
}