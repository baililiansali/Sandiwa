// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { Logo } from "@/components/Logo";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// export const Route = createFileRoute("/login")({
//     head: () => ({
//         meta: [
//             { title: "Log in — Sandiwa" },
//             { name: "description", content: "Sign in to Sandiwa to continue learning Filipino language and culture." },
//         ],
//     }),
//     component: Login,
// });

// // Mock user database for demo
// const MOCK_USERS = [
//     { email: "learner@gmail.com", password: "123", role: "learner", name: "Leah Mae" },
//     { email: "mentor.santos@gmail.com", password: "123", role: "mentor", name: "Maria Santos" },
//     { email: "mentor.jose@gmail.com", password: "123", role: "mentor", name: "Jose Reyes" },
//     { email: "mentor.ana@gmail.com", password: "123", role: "mentor", name: "Ana Cruz" },
//     { email: "mentor.ramon@gmail.com", password: "123", role: "mentor", name: "Ramon Villanueva" },
//     { email: "mentor.lita@gmail.com", password: "123", role: "mentor", name: "Lita Mendoza" },
//     { email: "admin@gmail.com", password: "123", role: "admin", name: "Admin User" },
// ];

// function Login() {
//     const [showPwd, setShowPwd] = useState(false);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [rememberMe, setRememberMe] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     // const handleLogin = async (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     setIsLoading(true);
        
//     //     // Simulate API call
//     //     setTimeout(() => {
//     //         // Find user in mock database
//     //         const user = MOCK_USERS.find(u => u.email === email && u.password === password);
            
//     //         if (!user) {
//     //             toast.error("Invalid email or password");
//     //             setIsLoading(false);
//     //             return;
//     //         }

//     //         // Get user's name parts for initials
//     //         const nameParts = user.name.split(" ");
//     //         const initials = nameParts.map(n => n[0]).join("").toUpperCase();
            
//     //         // Store user info based on role
//     //         const userData = {
//     //             isLoggedIn: "true",
//     //             userEmail: user.email,
//     //             userName: user.name,
//     //             userInitials: initials,
//     //             userRole: user.role,
//     //         };
            
//     //         if (rememberMe) {
//     //             localStorage.setItem("isLoggedIn", userData.isLoggedIn);
//     //             localStorage.setItem("userEmail", userData.userEmail);
//     //             localStorage.setItem("userName", userData.userName);
//     //             localStorage.setItem("userInitials", userData.userInitials);
//     //             localStorage.setItem("userRole", userData.userRole);
//     //         } else {
//     //             sessionStorage.setItem("isLoggedIn", userData.isLoggedIn);
//     //             sessionStorage.setItem("userEmail", userData.userEmail);
//     //             sessionStorage.setItem("userName", userData.userName);
//     //             sessionStorage.setItem("userInitials", userData.userInitials);
//     //             sessionStorage.setItem("userRole", userData.userRole);
//     //         }
            
//     //         toast.success(`Welcome back, ${user.name}!`);
//     //         setIsLoading(false);
            
//     //         // Redirect based on role
//     //         if (user.role === "mentor") {
//     //             navigate({ to: "/mentor/dashboard" });
//     //         } else if (user.role === "admin") {
//     //             navigate({ to: "/admin/dashboard" });
//     //         } else {
//     //             navigate({ to: "/learner/dashboard" });
//     //         }
//     //     }, 1000);
//     // };

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
        
//         setTimeout(() => {
//             const user = MOCK_USERS.find(u => u.email === email && u.password === password);
            
//             if (!user) {
//             toast.error("Invalid email or password");
//             setIsLoading(false);
//             return;
//             }

//             const nameParts = user.name.split(" ");
//             const initials = nameParts.map(n => n[0]).join("").toUpperCase();
            
//             const userData = {
//             isLoggedIn: "true",
//             userEmail: user.email,
//             userName: user.name,
//             userInitials: initials,
//             userRole: user.role,
//             };
            
//             if (rememberMe) {
//             localStorage.setItem("isLoggedIn", userData.isLoggedIn);
//             localStorage.setItem("userEmail", userData.userEmail);
//             localStorage.setItem("userName", userData.userName);
//             localStorage.setItem("userInitials", userData.userInitials);
//             localStorage.setItem("userRole", userData.userRole);
//             } else {
//             sessionStorage.setItem("isLoggedIn", userData.isLoggedIn);
//             sessionStorage.setItem("userEmail", userData.userEmail);
//             sessionStorage.setItem("userName", userData.userName);
//             sessionStorage.setItem("userInitials", userData.userInitials);
//             sessionStorage.setItem("userRole", userData.userRole);
//             }
            
//             toast.success(`Welcome back, ${user.name}!`);
//             setIsLoading(false);
            
//             // Redirect based on role
//             if (user.role === "mentor") {
//             navigate({ to: "/mentor/dashboard" });
//             } else if (user.role === "admin") {
//             navigate({ to: "/admin/dashboard" });
//             } else {
//             navigate({ to: "/learner/dashboard" });
//             }
//         }, 1000);
//         };

//     // Quick login helpers for demo
//     const quickLogin = (role: string) => {
//         if (role === "learner") {
//             setEmail("learner@gmail.com");
//             setPassword("123");
//         } else if (role === "mentor") {
//             setEmail("mentor.jose@gmail.com");
//             setPassword("123");
//         } else if (role === "admin") {
//             setEmail("admin@gmail.com");
//             setPassword("admin123");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-background">
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
//                 <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
//                     <ArrowLeft className="h-4 w-4" /> Back to home
//                 </Link>
//                 <Logo />
//             </div>
//             <div className="mx-auto max-w-md px-4 py-10">
//                 <h1 className="text-center font-serif text-4xl font-bold">
//                     Welcome to <span className="text-gold">Sandiwa</span>
//                 </h1>
//                 <p className="mt-3 text-center text-sm text-muted-foreground">
//                     Sign in to continue your learning journey
//                 </p>

//                 <form className="mt-8 space-y-5" onSubmit={handleLogin}>
//                     <div>
//                         <label className="text-sm font-medium">Email</label>
//                         <div className="mt-1.5 relative">
//                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
//                             <input 
//                                 type="email" 
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Enter your email address" 
//                                 required
//                                 className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
//                             />
//                         </div>
//                     </div>
//                     <div>
//                         <label className="text-sm font-medium">Password</label>
//                         <div className="mt-1.5 relative">
//                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
//                             <input 
//                                 type={showPwd ? "text" : "password"} 
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 placeholder="Enter your password" 
//                                 required
//                                 className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
//                             />
//                             <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
//                                 {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             </button>
//                         </div>
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                         <label className="flex items-center gap-2 text-foreground/80">
//                             <input 
//                                 type="checkbox" 
//                                 checked={rememberMe}
//                                 onChange={(e) => setRememberMe(e.target.checked)}
//                                 className="rounded border-border accent-gold" 
//                             /> 
//                             Remember me
//                         </label>
//                         <a href="#" className="text-gold hover:underline">Forgot password?</a>
//                     </div>
//                     <Button 
//                         type="submit" 
//                         size="lg" 
//                         className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
//                         disabled={isLoading}
//                     >
//                         {isLoading ? "Logging in..." : "Log in"}
//                     </Button>
//                 </form>

//                 <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
//                     <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
//                 </div>
//                 <div className="flex justify-center gap-3">
//                     {["G", "f", "X"].map((label, i) => (
//                         <button 
//                             key={i} 
//                             aria-label="Social" 
//                             className="h-12 w-14 rounded-md border border-border bg-background flex items-center justify-center text-lg font-bold hover:bg-accent"
//                         >
//                             {label}
//                         </button>
//                     ))}
//                 </div>

//                 <p className="mt-8 text-center text-sm text-muted-foreground">
//                     Don't have an account?{" "}
//                     <Link to="/register" className="text-gold font-medium hover:underline">Register here</Link>
//                 </p>
//                 <p className="mt-3 text-center text-xs text-muted-foreground">
//                     By continuing, you agree to our Terms of Service and Privacy Policy
//                 </p>
//             </div>
//         </div>
//     );
// }











import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
    head: () => ({
        meta: [
            { title: "Log in — Sandiwa" },
            { name: "description", content: "Sign in to Sandiwa to continue learning Filipino language and culture." },
        ],
    }),
    component: Login,
});

// Updated mock user database with linked accounts
const MOCK_USERS = [
    { 
        email: "learner@gmail.com", 
        password: "123", 
        role: "learner", 
        name: "Leah Mae",
        isMentor: false,
        linkedMentorEmail: null // This learner hasn't applied to be a mentor yet
    },
    { 
        email: "mentor.santos@gmail.com", 
        password: "123", 
        role: "mentor", 
        name: "Maria Santos",
        isMentor: true,
        linkedLearnerEmail: "maria.learner@gmail.com" // This mentor also has a learner account
    },
    { 
        email: "mentor.jose@gmail.com", 
        password: "123", 
        role: "mentor", 
        name: "Jose Reyes",
        isMentor: true,
        linkedLearnerEmail: "jose.learner@gmail.com"
    },
    { 
        email: "mentor.ana@gmail.com", 
        password: "123", 
        role: "mentor", 
        name: "Ana Cruz",
        isMentor: true,
        linkedLearnerEmail: "ana.learner@gmail.com"
    },
    { 
        email: "mentor.ramon@gmail.com", 
        password: "123", 
        role: "mentor", 
        name: "Ramon Villanueva",
        isMentor: true,
        linkedLearnerEmail: "ramon.learner@gmail.com"
    },
    { 
        email: "mentor.lita@gmail.com", 
        password: "123", 
        role: "mentor", 
        name: "Lita Mendoza",
        isMentor: true,
        linkedLearnerEmail: "lita.learner@gmail.com"
    },
    { 
        email: "admin@gmail.com", 
        password: "123", 
        role: "admin", 
        name: "Admin User",
        isMentor: false,
        linkedMentorEmail: null
    },
];

function Login() {
    const [showPwd, setShowPwd] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email && u.password === password);
            
            if (!user) {
                toast.error("Invalid email or password");
                setIsLoading(false);
                return;
            }

            const nameParts = user.name.split(" ");
            const initials = nameParts.map(n => n[0]).join("").toUpperCase();
            
            // For mentors: Check if they have a linked learner account
            let hasLearnerAccess = false;
            let learnerEmail = null;
            
            if (user.role === "mentor") {
                // If mentor has a linked learner account, they can switch to learner mode
                hasLearnerAccess = !!user.linkedLearnerEmail;
                learnerEmail = user.linkedLearnerEmail;
            }
            
            // For learners: Check if they have applied to become a mentor
            let hasMentorAccess = false;
            let mentorEmail = null;
            
            if (user.role === "learner") {
                // Check if this learner has a mentor account linked
                const mentorUser = MOCK_USERS.find(u => u.linkedLearnerEmail === user.email);
                hasMentorAccess = !!mentorUser;
                mentorEmail = mentorUser?.email || null;
            }
            
            const userData = {
                isLoggedIn: "true",
                userEmail: user.email,
                userName: user.name,
                userInitials: initials,
                userRole: user.role,
                isMentor: user.isMentor ? "true" : "false",
                hasMentorAccess: hasMentorAccess ? "true" : "false",
                hasLearnerAccess: hasLearnerAccess ? "true" : "false",
                linkedLearnerEmail: learnerEmail || "",
                linkedMentorEmail: mentorEmail || "",
                primaryEmail: user.email, // Store the primary email for this session
            };
            
            if (rememberMe) {
                localStorage.setItem("isLoggedIn", userData.isLoggedIn);
                localStorage.setItem("userEmail", userData.userEmail);
                localStorage.setItem("userName", userData.userName);
                localStorage.setItem("userInitials", userData.userInitials);
                localStorage.setItem("userRole", userData.userRole);
                localStorage.setItem("isMentor", userData.isMentor);
                localStorage.setItem("hasMentorAccess", userData.hasMentorAccess);
                localStorage.setItem("hasLearnerAccess", userData.hasLearnerAccess);
                localStorage.setItem("linkedLearnerEmail", userData.linkedLearnerEmail);
                localStorage.setItem("linkedMentorEmail", userData.linkedMentorEmail);
                localStorage.setItem("primaryEmail", userData.primaryEmail);
            } else {
                sessionStorage.setItem("isLoggedIn", userData.isLoggedIn);
                sessionStorage.setItem("userEmail", userData.userEmail);
                sessionStorage.setItem("userName", userData.userName);
                sessionStorage.setItem("userInitials", userData.userInitials);
                sessionStorage.setItem("userRole", userData.userRole);
                sessionStorage.setItem("isMentor", userData.isMentor);
                sessionStorage.setItem("hasMentorAccess", userData.hasMentorAccess);
                sessionStorage.setItem("hasLearnerAccess", userData.hasLearnerAccess);
                sessionStorage.setItem("linkedLearnerEmail", userData.linkedLearnerEmail);
                sessionStorage.setItem("linkedMentorEmail", userData.linkedMentorEmail);
                sessionStorage.setItem("primaryEmail", userData.primaryEmail);
            }
            
            toast.success(`Welcome back, ${user.name}!`);
            setIsLoading(false);
            
            // Redirect based on role
            if (user.role === "mentor") {
                navigate({ to: "/mentor/dashboard" });
            } else if (user.role === "admin") {
                navigate({ to: "/admin/dashboard" });
            } else {
                navigate({ to: "/learner/dashboard" });
            }
        }, 1000);
    };

    // Quick login helpers for demo
    const quickLogin = (role: string) => {
        if (role === "learner") {
            setEmail("learner@gmail.com");
            setPassword("123");
        } else if (role === "mentor") {
            setEmail("mentor.jose@gmail.com");
            setPassword("123");
        } else if (role === "admin") {
            setEmail("admin@gmail.com");
            setPassword("123");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>
                <Logo />
            </div>
            <div className="mx-auto max-w-md px-4 py-10">
                <h1 className="text-center font-serif text-4xl font-bold">
                    Welcome to <span className="text-gold">Sandiwa</span>
                </h1>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                    Sign in to continue your learning journey
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="mt-1.5 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address" 
                                required
                                className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <div className="mt-1.5 relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                            <input 
                                type={showPwd ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" 
                                required
                                className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold" 
                            />
                            <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-foreground/80">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-border accent-gold" 
                            /> 
                            Remember me
                        </label>
                        <a href="#" className="text-gold hover:underline">Forgot password?</a>
                    </div>
                    <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex justify-center gap-3">
                    {["G", "f", "X"].map((label, i) => (
                        <button 
                            key={i} 
                            aria-label="Social" 
                            className="h-12 w-14 rounded-md border border-border bg-background flex items-center justify-center text-lg font-bold hover:bg-accent"
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Quick login buttons for demo */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <button 
                        type="button"
                        onClick={() => quickLogin("learner")}
                        className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-600 hover:bg-blue-100"
                    >
                        Quick Login: Learner
                    </button>
                    <button 
                        type="button"
                        onClick={() => quickLogin("mentor")}
                        className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-600 hover:bg-green-100"
                    >
                        Quick Login: Mentor
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-gold font-medium hover:underline">Register here</Link>
                </p>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}