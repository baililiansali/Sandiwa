// import { createFileRoute, Link } from "@tanstack/react-router";
// import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Users, BookOpen, Star, UserCheck, TrendingUp, DollarSign, Eye } from "lucide-react";
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

//         {/* Quick Actions */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <Link to="/admin/users">
//             <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
//               <Users className="h-8 w-8 text-red-500 mb-3" />
//               <h3 className="font-semibold text-navy">Manage Users</h3>
//               <p className="text-xs text-muted-foreground mt-1">View and manage all platform users</p>
//             </div>
//           </Link>
//           <Link to="/admin/courses">
//             <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
//               <BookOpen className="h-8 w-8 text-blue-500 mb-3" />
//               <h3 className="font-semibold text-navy">Manage Courses</h3>
//               <p className="text-xs text-muted-foreground mt-1">Review and manage all courses</p>
//             </div>
//           </Link>
//           <Link to="/admin/mentors">
//             <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
//               <UserCheck className="h-8 w-8 text-green-500 mb-3" />
//               <h3 className="font-semibold text-navy">Review Applications</h3>
//               <p className="text-xs text-muted-foreground mt-1">Review mentor applications</p>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </AdminDashboardLayout>
//   );
// }




























// src/routes/admin/dashboard.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Star, UserCheck, TrendingUp, DollarSign, Eye, AlertCircle, Flag } from "lucide-react";
import { useState, useEffect } from "react";
import { courses } from "@/data/mockCourses";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 12450,
    totalMentors: 6,
    totalCourses: courses.length,
    totalRevenue: courses.reduce((sum, c) => sum + (c.enrolled * c.price), 0),
    pendingApplications: 3,
    averageRating: 4.8,
  });

  const recentApplications = [
    { id: 1, name: "John Smith", expertise: "Filipino Language", appliedAt: "2026-05-01", status: "pending" },
    { id: 2, name: "Maria Garcia", expertise: "Philippine History", appliedAt: "2026-04-28", status: "pending" },
    { id: 3, name: "Robert Tan", expertise: "Arts & Crafts", appliedAt: "2026-04-25", status: "pending" },
  ];

  // Alert states
  const [failedPayments, setFailedPayments] = useState([
    { id: 1, userId: "user_123", userName: "Juan Dela Cruz", amount: 49.99, course: "Filipino for Beginners", date: "2026-05-13", reason: "Expired card" },
    { id: 2, userId: "user_456", userName: "Maria Santos", amount: 89.99, course: "Advanced Tagalog", date: "2026-05-12", reason: "Insufficient funds" },
  ]);

  const [reportedContent, setReportedContent] = useState([
    { id: 1, type: "course", title: "Philippine History 101", reporter: "student_789", reason: "Inaccurate historical information", date: "2026-05-13", status: "pending" },
    { id: 2, type: "review", content: "Review on 'Filipino Cooking Class'", reporter: "mentor_234", reason: "Harassment", date: "2026-05-12", status: "pending" },
  ]);

  // Handle approve/reject for failed payments (simulate retry or refund)
  const handleRetryPayment = (id: number) => {
    setFailedPayments(prev => prev.filter(payment => payment.id !== id));
    // In real app: call API to retry payment
    console.log(`Retrying payment ${id}`);
  };

  const handleRefundPayment = (id: number) => {
    setFailedPayments(prev => prev.filter(payment => payment.id !== id));
    // In real app: call API to process refund
    console.log(`Refunding payment ${id}`);
  };

  // Handle reported content actions
  const handleDismissReport = (id: number) => {
    setReportedContent(prev => prev.filter(report => report.id !== id));
    console.log(`Dismissing report ${id}`);
  };

  const handleReviewContent = (id: number) => {
    // In real app: navigate to content moderation page or open modal
    console.log(`Reviewing content ${id}`);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users, courses, and platform settings</p>
        </div>

        {/* Priority Alerts Section */}
        {(failedPayments.length > 0 || reportedContent.length > 0) && (
          <div className="mb-6 space-y-3">
            {failedPayments.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-800">Failed Payments</span>
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                          {failedPayments.length} pending
                        </span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        {failedPayments.length} payment{failedPayments.length > 1 ? 's have' : ' has'} failed. Requires immediate attention to prevent revenue loss.
                      </p>
                    </div>
                  </div>
                  <Link to="/admin/payments/failed">
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                      View All
                    </Button>
                  </Link>
                </div>

                {/* Quick actions for recent failed payments */}
                <div className="mt-3 space-y-2">
                  {failedPayments.slice(0, 2).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between text-sm bg-white/50 rounded p-2">
                      <div>
                        <p className="font-medium text-red-900">{payment.userName}</p>
                        <p className="text-xs text-red-700">₱{payment.amount} - {payment.course}</p>
                        <p className="text-xs text-red-600">Reason: {payment.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleRetryPayment(payment.id)}
                        >
                          Retry
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-300 text-red-700"
                          onClick={() => handleRefundPayment(payment.id)}
                        >
                          Refund
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportedContent.length > 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Flag className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-orange-800">Reported Content</span>
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">
                          {reportedContent.length} pending
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        {reportedContent.length} content report{reportedContent.length > 1 ? 's have' : ' has'} been filed. Needs review within 24 hours for compliance.
                      </p>
                    </div>
                  </div>
                  <Link to="/admin/reports">
                    <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                      View All
                    </Button>
                  </Link>
                </div>

                {/* Quick actions for recent reports */}
                <div className="mt-3 space-y-2">
                  {reportedContent.slice(0, 2).map((report) => (
                    <div key={report.id} className="flex items-center justify-between text-sm bg-white/50 rounded p-2">
                      <div>
                        <p className="font-medium text-orange-900">
                          {report.type === 'course' ? '📚 Course' : '💬 Review'}: {report.title}
                        </p>
                        <p className="text-xs text-orange-700">Reported by: {report.reporter}</p>
                        <p className="text-xs text-orange-600">Reason: {report.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleReviewContent(report.id)}
                        >
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-orange-300 text-orange-700"
                          onClick={() => handleDismissReport(report.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600">+12%</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600">+5</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{stats.totalCourses}</p>
              <p className="text-xs text-muted-foreground">Total Courses</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600">+18%</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">₱{(stats.totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-red-600">{stats.pendingApplications}</span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{stats.pendingApplications}</p>
              <p className="text-xs text-muted-foreground">Pending Applications</p>
            </div>
          </div>
        </div>

        {/* Recent Mentor Applications */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-serif text-xl font-bold text-navy">Pending Mentor Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{app.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.expertise}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-green-500 text-green-600">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-600">
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

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link to="/admin/users">
            <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 text-red-500 mb-3" />
              <h3 className="font-semibold text-navy">Manage Users</h3>
              <p className="text-xs text-muted-foreground mt-1">View and manage all platform users</p>
            </div>
          </Link>
          <Link to="/admin/courses">
            <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <BookOpen className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-navy">Manage Courses</h3>
              <p className="text-xs text-muted-foreground mt-1">Review and manage all courses</p>
            </div>
          </Link>
          <Link to="/admin/mentors">
            <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <UserCheck className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-navy">Review Applications</h3>
              <p className="text-xs text-muted-foreground mt-1">Review mentor applications</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}