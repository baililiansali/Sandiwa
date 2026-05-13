// // src/routes/admin/dashboard.tsx
// import { createFileRoute, Link } from "@tanstack/react-router";
// import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Users, BookOpen, Star, UserCheck, TrendingUp, DollarSign, Eye, AlertCircle, Flag } from "lucide-react";
// import { useState, useEffect } from "react";
// import { courses } from "@/data/mockCourses";

// export const Route = createFileRoute("/admin/dashboard")({
//   component: AdminDashboard,
// });

// function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalUsers: 12450,
//     totalMentors: 6,
//     totalCourses: courses.length,
//     totalRevenue: courses.reduce((sum, c) => sum + (c.enrolled * c.price), 0),
//     pendingApplications: 3,
//     averageRating: 4.8,
//   });

//   const recentApplications = [
//     { id: 1, name: "John Smith", expertise: "Filipino Language", appliedAt: "2026-05-01", status: "pending" },
//     { id: 2, name: "Maria Garcia", expertise: "Philippine History", appliedAt: "2026-04-28", status: "pending" },
//     { id: 3, name: "Robert Tan", expertise: "Arts & Crafts", appliedAt: "2026-04-25", status: "pending" },
//   ];

//   // Alert states
//   const [failedPayments, setFailedPayments] = useState([
//     { id: 1, userId: "user_123", userName: "Juan Dela Cruz", amount: 49.99, course: "Filipino for Beginners", date: "2026-05-13", reason: "Expired card" },
//     { id: 2, userId: "user_456", userName: "Maria Santos", amount: 89.99, course: "Advanced Tagalog", date: "2026-05-12", reason: "Insufficient funds" },
//   ]);

//   const [reportedContent, setReportedContent] = useState([
//     { id: 1, type: "course", title: "Philippine History 101", reporter: "student_789", reason: "Inaccurate historical information", date: "2026-05-13", status: "pending" },
//     { id: 2, type: "review", content: "Review on 'Filipino Cooking Class'", reporter: "mentor_234", reason: "Harassment", date: "2026-05-12", status: "pending" },
//   ]);

//   // Handle approve/reject for failed payments (simulate retry or refund)
//   const handleRetryPayment = (id: number) => {
//     setFailedPayments(prev => prev.filter(payment => payment.id !== id));
//     // In real app: call API to retry payment
//     console.log(`Retrying payment ${id}`);
//   };

//   const handleRefundPayment = (id: number) => {
//     setFailedPayments(prev => prev.filter(payment => payment.id !== id));
//     // In real app: call API to process refund
//     console.log(`Refunding payment ${id}`);
//   };

//   // Handle reported content actions
//   const handleDismissReport = (id: number) => {
//     setReportedContent(prev => prev.filter(report => report.id !== id));
//     console.log(`Dismissing report ${id}`);
//   };

//   const handleReviewContent = (id: number) => {
//     // In real app: navigate to content moderation page or open modal
//     console.log(`Reviewing content ${id}`);
//   };

//   return (
//     <AdminDashboardLayout>
//       <div className="p-6">
//         <div className="mb-6">
//           <h1 className="font-serif text-3xl font-bold text-navy">Admin Dashboard</h1>
//           <p className="text-muted-foreground mt-1">Manage users, courses, and platform settings</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
//                 <Users className="h-5 w-5" />
//               </div>
//               <span className="text-xs font-medium text-green-600">+12%</span>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">{stats.totalUsers.toLocaleString()}</p>
//               <p className="text-xs text-muted-foreground">Total Users</p>
//             </div>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
//                 <BookOpen className="h-5 w-5" />
//               </div>
//               <span className="text-xs font-medium text-green-600">+5</span>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">{stats.totalCourses}</p>
//               <p className="text-xs text-muted-foreground">Total Courses</p>
//             </div>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
//                 <DollarSign className="h-5 w-5" />
//               </div>
//               <span className="text-xs font-medium text-green-600">+18%</span>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">₱{(stats.totalRevenue / 1000).toFixed(0)}k</p>
//               <p className="text-xs text-muted-foreground">Total Revenue</p>
//             </div>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
//                 <UserCheck className="h-5 w-5" />
//               </div>
//               <span className="text-xs font-medium text-red-600">{stats.pendingApplications}</span>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">{stats.pendingApplications}</p>
//               <p className="text-xs text-muted-foreground">Pending Applications</p>
//             </div>
//           </div>
//         </div>

//         {/* Priority Alerts Section - Side by Side */}
//         {(failedPayments.length > 0 || reportedContent.length > 0) && (
//           <div className="grid gap-4 md:grid-cols-2 mb-6">
//             {/* Reported Content */}
//             {reportedContent.length > 0 && (
//               <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 h-full">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <Flag className="h-5 w-5 text-orange-600 mt-0.5" />
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="font-semibold text-orange-800">Reported Content</span>
//                         <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">
//                           {reportedContent.length} pending
//                         </span>
//                       </div>
//                       <p className="text-sm text-orange-700 mt-1">
//                         {reportedContent.length} content report{reportedContent.length > 1 ? 's have' : ' has'} been filed.
//                       </p>
//                     </div>
//                   </div>
//                   <Link to="/admin/reports">
//                     <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
//                       View All
//                     </Button>
//                   </Link>
//                 </div>

//                 {/* Quick actions for recent reports */}
//                 <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
//                   {reportedContent.slice(0, 3).map((report) => (
//                     <div key={report.id} className="flex items-center justify-between text-sm bg-white/50 rounded p-2">
//                       <div className="flex-1">
//                         <p className="font-medium text-orange-900">
//                           {report.type === 'course' ? '📚 Course' : '💬 Review'}: {report.title}
//                         </p>
//                         <p className="text-xs text-orange-700">Reported by: {report.reporter}</p>
//                         <p className="text-xs text-orange-600">Reason: {report.reason}</p>
//                       </div>
//                       <div className="flex gap-2 ml-2">
//                         <Button 
//                           size="sm" 
//                           className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
//                           onClick={() => handleReviewContent(report.id)}
//                         >
//                           Review
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="outline" 
//                           className="border-orange-300 text-orange-700 h-7 px-2 text-xs"
//                           onClick={() => handleDismissReport(report.id)}
//                         >
//                           Dismiss
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Recent Mentor Applications */}
//         <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
//           <div className="px-6 py-4 border-b border-border bg-muted/30">
//             <h2 className="font-serif text-xl font-bold text-navy">Pending Mentor Applications</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted/20">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Expertise</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Applied Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {recentApplications.map((app) => (
//                   <tr key={app.id} className="hover:bg-muted/50 transition-colors">
//                     <td className="px-6 py-4 text-sm font-medium">{app.name}</td>
//                     <td className="px-6 py-4 text-sm text-muted-foreground">{app.expertise}</td>
//                     <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
//                     <td className="px-6 py-4">
//                       <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
//                         Pending
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="outline" className="border-green-500 text-green-600">
//                           Approve
//                         </Button>
//                         <Button size="sm" variant="outline" className="border-red-500 text-red-600">
//                           Reject
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </AdminDashboardLayout>
//   );
// }





























// src/routes/admin/dashboard.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Users, BookOpen, Star, UserCheck, TrendingUp, DollarSign, 
  AlertCircle, Flag, Activity, Calendar, MessageSquare, 
  ArrowUp, ArrowDown, Eye, Clock, Zap, ThumbsUp, 
  CheckCircle, XCircle, Bell, Wallet, Send
} from "lucide-react";
import { useState, useEffect } from "react";
import { courses } from "@/data/mockCourses";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 12450,
    totalMentors: 8,
    totalLearners: 12442,
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status !== "pending").length,
    pendingCourses: courses.filter(c => c.status === "pending").length,
    totalRevenue: courses.reduce((sum, c) => sum + (c.enrolled * c.price), 0),
    pendingApplications: 3,
    averageRating: (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1),
    activeUsers: 8923,
    monthlyGrowth: 12.5,
    revenueGrowth: 18.3,
  });

  const recentApplications = [
    { id: 1, name: "John Smith", expertise: "Filipino Language", appliedAt: "2026-05-01", status: "pending" },
    { id: 2, name: "Maria Garcia", expertise: "Philippine History", appliedAt: "2026-04-28", status: "pending" },
    { id: 3, name: "Robert Tan", expertise: "Arts & Crafts", appliedAt: "2026-04-25", status: "pending" },
  ];

  const pendingDiscussions = [
    { id: 1, title: "Filipino Grammar Tips", author: "Maria Santos", course: "Filipino for Beginners", postedAt: "2026-05-14" },
    { id: 2, title: "History Question", author: "John Reyes", course: "Philippine History 101", postedAt: "2026-05-13" },
  ];

  const pendingEvents = [
    { id: 1, title: "Filipino Cultural Workshop", creator: "Jose Reyes", date: "2026-05-25", attendees: 50 },
    { id: 2, title: "Filipino Cooking Class", creator: "Ana Cruz", date: "2026-05-28", attendees: 30 },
  ];

  const [failedPayments, setFailedPayments] = useState([
    { id: 1, userName: "Juan Dela Cruz", amount: 49.99, course: "Filipino for Beginners", date: "2026-05-13", reason: "Expired card" },
    { id: 2, userName: "Maria Santos", amount: 89.99, course: "Advanced Tagalog", date: "2026-05-12", reason: "Insufficient funds" },
  ]);

  const [reportedContent, setReportedContent] = useState([
    { id: 1, type: "course", title: "Philippine History 101", reporter: "student_789", reason: "Inaccurate historical information", date: "2026-05-13", status: "pending" },
    { id: 2, type: "review", content: "Review on 'Filipino Cooking Class'", reporter: "mentor_234", reason: "Harassment", date: "2026-05-12", status: "pending" },
  ]);

  const weeklyActivity = [65, 72, 78, 85, 92, 88, 76];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleRetryPayment = (id: number) => {
    setFailedPayments(prev => prev.filter(payment => payment.id !== id));
  };

  const handleRefundPayment = (id: number) => {
    setFailedPayments(prev => prev.filter(payment => payment.id !== id));
  };

  const handleDismissReport = (id: number) => {
    setReportedContent(prev => prev.filter(report => report.id !== id));
  };

  const totalPendingItems = pendingDiscussions.length + pendingEvents.length + stats.pendingCourses + stats.pendingApplications;

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          <h1 className="font-serif text-3xl font-bold text-navy">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening on your platform today.</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />+{stats.monthlyGrowth}%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-blue-600">{stats.totalLearners.toLocaleString()} learners</span>
                <span className="text-gold">{stats.totalMentors} mentors</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600">+{stats.publishedCourses - (stats.totalCourses - stats.pendingCourses)}</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{stats.totalCourses}</p>
              <p className="text-xs text-muted-foreground">Total Courses</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-green-600">{stats.publishedCourses} published</span>
                <span className="text-yellow-600">{stats.pendingCourses} pending</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />+{stats.revenueGrowth}%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold text-gold">₱{(stats.totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-muted-foreground mt-1">₱{(stats.totalRevenue * 0.3 / 1000).toFixed(0)}k platform fee</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="flex items-center gap-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                Live
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
              <p className="text-xs text-green-600 mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% engagement rate</p>
            </div>
          </div>
        </div>

        {/* Pending Review Alerts - Important Section */}
        {totalPendingItems > 0 && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                {/* <div>
                  <h3 className="font-semibold text-yellow-800">Pending Reviews</h3>
                  <p className="text-sm text-yellow-700">You have {totalPendingItems} items awaiting your review</p>
                </div> */}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to="/admin/courses">
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                    {stats.pendingCourses} Pending Courses
                  </Button>
                </Link>
                <Link to="/admin/users/mentors">
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                    {stats.pendingApplications} Mentor Apps
                  </Button>
                </Link>
                <Link to="/admin/discussions">
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                    {pendingDiscussions.length} Discussions
                  </Button>
                </Link>
                <Link to="/admin/events">
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                    {pendingEvents.length} Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Activity Chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gold" />
              Weekly Platform Activity
            </h3>
            <div className="h-48 flex items-end gap-2">
              {weeklyActivity.map((value, index) => {
                const height = value;
                let barColor = "bg-blue-500";
                if (value >= 80) barColor = "bg-green-500";
                else if (value >= 60) barColor = "bg-gold";
                else if (value >= 40) barColor = "bg-orange-500";
                else barColor = "bg-red-500";
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full">
                      <div 
                        className={`w-full ${barColor} rounded-t-lg transition-all duration-500 group-hover:opacity-80`}
                        style={{ height: `${height}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value}% activity
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{weekdays[index]}</span>
                    <span className="text-xs font-semibold text-navy">{value}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-2">
              <Zap className="h-3 w-3 text-gold" />
              Peak activity on Fridays
              <ThumbsUp className="h-3 w-3 text-green-500" />
            </p>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              Platform Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <span className="font-semibold">{stats.averageRating}</span>
                    <span className="text-xs text-muted-foreground">/5.0</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(parseFloat(stats.averageRating) / 5) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Course Completion Rate</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "68%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">User Satisfaction</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div className="pt-2 border-t border-border grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">+245</p>
                  <p className="text-xs text-muted-foreground">New Users (7d)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gold">₱28.5k</p>
                  <p className="text-xs text-muted-foreground">Revenue (7d)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section - Failed Payments & Reported Content */}
        {/* {(failedPayments.length > 0 || reportedContent.length > 0) && (
          <div className="grid gap-6 lg:grid-cols-2">
            Failed Payments
            {failedPayments.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
                <div className="px-5 py-3 border-b border-red-200 bg-red-100/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Failed Payments</h3>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full ml-2">
                      {failedPayments.length} pending
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-red-100">
                  {failedPayments.map((payment) => (
                    <div key={payment.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-900">{payment.userName}</p>
                          <p className="text-sm text-red-700">{payment.course}</p>
                          <p className="text-xs text-red-600 mt-1">Reason: {payment.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-800">₱{payment.amount}</p>
                          <p className="text-xs text-red-600">{payment.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 px-3 text-xs" onClick={() => handleRetryPayment(payment.id)}>
                          Retry
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 h-7 px-3 text-xs" onClick={() => handleRefundPayment(payment.id)}>
                          Refund
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reported Content */}
            {/* {reportedContent.length > 0 && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 overflow-hidden">
                <div className="px-5 py-3 border-b border-orange-200 bg-orange-100/50">
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Reported Content</h3>
                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full ml-2">
                      {reportedContent.length} pending
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-orange-100">
                  {reportedContent.map((report) => (
                    <div key={report.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-orange-900">
                            {report.type === 'course' ? '📚 Course' : '💬 Review'}: {report.title}
                          </p>
                          <p className="text-xs text-orange-700">Reported by: {report.reporter}</p>
                          <p className="text-xs text-orange-600">Reason: {report.reason}</p>
                        </div>
                        <p className="text-xs text-orange-600">{report.date}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link to="/admin/community/reports">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-7 px-3 text-xs">
                            Review
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 h-7 px-3 text-xs" onClick={() => handleDismissReport(report.id)}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )} */} 

        {/* Recent Mentor Applications */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h2 className="font-serif text-lg font-bold text-navy">Pending Mentor Applications</h2>
            <Link to="/admin/users/mentors">
              <Button variant="ghost" size="sm" className="text-gold">
                View All →
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-navy">{app.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.expertise}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-green-500 text-green-600 h-7 text-xs">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 h-7 text-xs">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4">
          <Link to="/admin/courses">
            <div className="rounded-lg border border-border bg-card p-4 text-center hover:shadow-md transition-all hover:border-gold cursor-pointer">
              <BookOpen className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="font-medium text-navy">Course Management</p>
              <p className="text-xs text-muted-foreground">{stats.pendingCourses} pending reviews</p>
            </div>
          </Link>
          <Link to="/admin/payments">
            <div className="rounded-lg border border-border bg-card p-4 text-center hover:shadow-md transition-all hover:border-gold cursor-pointer">
              <Wallet className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-navy">Payment Management</p>
              <p className="text-xs text-muted-foreground">{failedPayments.length} failed transactions</p>
            </div>
          </Link>
          <Link to="/admin/payments/payouts">
            <div className="rounded-lg border border-border bg-card p-4 text-center hover:shadow-md transition-all hover:border-gold cursor-pointer">
              <Send className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-navy">Mentor Payouts</p>
              <p className="text-xs text-muted-foreground">Process monthly earnings</p>
            </div>
          </Link>
          <Link to="/admin/analytics">
            <div className="rounded-lg border border-border bg-card p-4 text-center hover:shadow-md transition-all hover:border-gold cursor-pointer">
              <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-navy">Analytics</p>
              <p className="text-xs text-muted-foreground">View platform insights</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}