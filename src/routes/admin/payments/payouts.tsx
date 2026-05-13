// // src/routes/admin/payments/payouts.tsx
// import { createFileRoute, Link } from "@tanstack/react-router";
// import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Pagination } from "@/components/Pagination";
// import { 
//   CheckCircle, 
//   XCircle,
//   Clock,
//   Search,
//   Filter,
//   Download,
//   Send,
//   Eye
// } from "lucide-react";
// import { useState, useEffect } from "react";

// export const Route = createFileRoute("/admin/payments/payouts")({
//   component: MentorPayoutsPage,
// });

// interface Payout {
//   id: number;
//   mentorName: string;
//   amount: number;
//   status: "pending" | "completed" | "processing";
//   date: string;
//   courseCount: number;
//   email: string;
// }

// function MentorPayoutsPage() {
//   const [payouts, setPayouts] = useState<Payout[]>([
//     { id: 1, mentorName: "Maria Garcia", amount: 1250, status: "pending", date: "2026-05", courseCount: 3, email: "maria.garcia@example.com" },
//     { id: 2, mentorName: "John Santos", amount: 890, status: "completed", date: "2026-04", courseCount: 2, email: "john.santos@example.com" },
//     { id: 3, mentorName: "Ana Reyes", amount: 2100, status: "processing", date: "2026-05", courseCount: 4, email: "ana.reyes@example.com" },
//     { id: 4, mentorName: "Roberto Tan", amount: 450, status: "pending", date: "2026-05", courseCount: 1, email: "roberto.tan@example.com" },
//     { id: 5, mentorName: "Cristina Lopez", amount: 3200, status: "pending", date: "2026-05", courseCount: 5, email: "cristina.lopez@example.com" },
//     { id: 6, mentorName: "Miguel Fernandez", amount: 670, status: "completed", date: "2026-03", courseCount: 2, email: "miguel.fernandez@example.com" },
//     { id: 7, mentorName: "Patricia Cruz", amount: 1500, status: "pending", date: "2026-05", courseCount: 3, email: "patricia.cruz@example.com" },
//     { id: 8, mentorName: "Ramon Villanueva", amount: 980, status: "processing", date: "2026-05", courseCount: 2, email: "ramon.villanueva@example.com" },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'completed': return 'bg-green-100 text-green-700';
//       case 'pending': return 'bg-yellow-100 text-yellow-700';
//       case 'processing': return 'bg-blue-100 text-blue-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch(status) {
//       case 'completed': return <CheckCircle className="h-4 w-4" />;
//       case 'pending': return <Clock className="h-4 w-4" />;
//       case 'processing': return <Clock className="h-4 w-4" />;
//       default: return <Clock className="h-4 w-4" />;
//     }
//   };

//   const filteredPayouts = payouts.filter(payout => {
//     const matchesStatus = filterStatus === 'all' ? true : payout.status === filterStatus;
//     const matchesSearch = searchTerm === '' || 
//       payout.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payout.email.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   // Pagination logic
//   const paginatedPayouts = filteredPayouts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterStatus, searchTerm]);

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
//   };

//   const totalPending = filteredPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
//   const totalCompleted = filteredPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
//   const totalProcessing = filteredPayouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);

//   const handleProcessPayout = (id: number) => {
//     setPayouts(prev => 
//       prev.map(payout => 
//         payout.id === id ? { ...payout, status: "processing" } : payout
//       )
//     );
//     alert(`Processing payout for mentor. Funds will be transferred within 3-5 business days.`);
//   };

//   const handleMarkComplete = (id: number) => {
//     setPayouts(prev => 
//       prev.map(payout => 
//         payout.id === id ? { ...payout, status: "completed" } : payout
//       )
//     );
//     alert(`Payout marked as completed. Mentor has been notified.`);
//   };

//   return (
//     <AdminDashboardLayout>
//       <div className="p-6">
//         {/* Breadcrumbs */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
//             <Link to="/admin/dashboard" className="hover:text-red-600 transition-colors">
//               Dashboard
//             </Link>
//             <span>/</span>
//             <Link to="/admin/payments" className="hover:text-red-600 transition-colors">
//               Payment Management
//             </Link>
//             <span>/</span>
//             <span className="text-foreground font-medium">Mentor Payouts</span>
//           </div>

//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="font-serif text-3xl font-bold text-navy">Mentor Payouts</h1>
//               <p className="text-muted-foreground mt-1">Track and manage mentor earnings and payouts</p>
//             </div>
//             <Button className="bg-green-600 hover:bg-green-700">
//               <Download className="h-4 w-4 mr-2" />
//               Export Report
//             </Button>
//           </div>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid gap-4 md:grid-cols-3 mb-6">
//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
//                 <Clock className="h-5 w-5" />
//               </div>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">{formatCurrency(totalPending)}</p>
//               <p className="text-xs text-muted-foreground">Pending Payouts</p>
//             </div>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
//                 <Clock className="h-5 w-5" />
//               </div>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">{formatCurrency(totalProcessing)}</p>
//               <p className="text-xs text-muted-foreground">Processing</p>
//             </div>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-4">
//             <div className="flex items-center justify-between">
//               <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
//                 <CheckCircle className="h-5 w-5" />
//               </div>
//             </div>
//             <div className="mt-3">
//               <p className="text-2xl font-serif font-bold">{formatCurrency(totalCompleted)}</p>
//               <p className="text-xs text-muted-foreground">Completed Payouts</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
//           <div className="px-6 py-4 border-b border-border bg-muted/30">
//             <div className="flex flex-wrap gap-4">
//               <div className="flex-1 min-w-[200px]">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <input
//                     type="text"
//                     placeholder="Search by mentor name or email..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//               </div>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="completed">Completed</option>
//               </select>
//               <Button variant="outline" onClick={() => {
//                 setFilterStatus('all');
//                 setSearchTerm('');
//               }}>
//                 <Filter className="h-4 w-4 mr-2" />
//                 Clear Filters
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Payouts Table */}
//         <div className="rounded-xl border border-border bg-card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted/20">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Mentor Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Courses</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Period</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {paginatedPayouts.map((payout) => (
//                   <tr key={payout.id} className="hover:bg-muted/50 transition-colors">
//                     <td className="px-6 py-4 text-sm font-medium">{payout.mentorName}</td>
//                     <td className="px-6 py-4 text-sm text-muted-foreground">{payout.email}</td>
//                     <td className="px-6 py-4 text-sm">{payout.courseCount} courses</td>
//                     <td className="px-6 py-4 text-sm">{payout.date}</td>
//                     <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payout.amount)}</td>
//                     <td className="px-6 py-4">
//                       <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${getStatusColor(payout.status)}`}>
//                         {getStatusIcon(payout.status)}
//                         <span className="capitalize">{payout.status}</span>
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex gap-2">
//                         {payout.status === 'pending' && (
//                           <Button 
//                             size="sm" 
//                             className="bg-green-600 hover:bg-green-700"
//                             onClick={() => handleProcessPayout(payout.id)}
//                           >
//                             <Send className="h-3 w-3 mr-1" />
//                             Process Payout
//                           </Button>
//                         )}
//                         {payout.status === 'processing' && (
//                           <Button 
//                             size="sm" 
//                             variant="outline"
//                             className="border-blue-500 text-blue-600"
//                             onClick={() => handleMarkComplete(payout.id)}
//                           >
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Mark Complete
//                           </Button>
//                         )}
//                         <Button size="sm" variant="outline">
//                           <Eye className="h-3 w-3 mr-1" />
//                           View Details
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary and Pagination */}
//           <div className="px-6 py-4 border-t border-border">
//             <Pagination
//               currentPage={currentPage}
//               totalItems={filteredPayouts.length}
//               itemsPerPage={itemsPerPage}
//               onPageChange={setCurrentPage}
//               showEntries={true}
//             />
//           </div>
//         </div>
//       </div>
//     </AdminDashboardLayout>
//   );
// }


























// src/routes/admin/payments/payouts.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { 
  CheckCircle, 
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  User,
  Mail,
  BookOpen,
  Calendar,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { courses, type Course } from "@/data/mockCourses";

export const Route = createFileRoute("/admin/payments/payouts")({
  component: MentorPayoutsPage,
});

interface Payout {
  id: number;
  mentorName: string;
  mentorId: string;
  amount: number;
  status: "pending" | "completed" | "processing";
  period: string;
  courseCount: number;
  email: string;
  bankAccount?: string;
  bankName?: string;
  transactionId?: string;
  completionDate?: string;
  courses: Course[];
}

function MentorPayoutsPage() {
  const getCoursesByMentor = (mentorId: string): Course[] => {
    return courses.filter(course => course.mentorId === mentorId);
  };

  const calculateMentorRevenue = (mentorCourses: Course[]): number => {
    return mentorCourses.reduce((total, course) => total + (course.price * 0.7), 0);
  };

  const [payouts, setPayouts] = useState<Payout[]>([
    { 
      id: 1, 
      mentorName: "Maria Santos", 
      mentorId: "maria-santos",
      amount: calculateMentorRevenue(getCoursesByMentor("maria-santos")), 
      status: "pending", 
      period: "2026-05", 
      courseCount: getCoursesByMentor("maria-santos").length, 
      email: "mentor.santos@gmail.com",
      bankAccount: "XXXX-XXXX-1234",
      bankName: "BPI",
      courses: getCoursesByMentor("maria-santos")
    },
    { 
      id: 2, 
      mentorName: "Jose Reyes", 
      mentorId: "jose-reyes",
      amount: calculateMentorRevenue(getCoursesByMentor("jose-reyes")), 
      status: "completed", 
      period: "2026-04", 
      courseCount: getCoursesByMentor("jose-reyes").length, 
      email: "mentor.jose@gmail.com",
      bankAccount: "XXXX-XXXX-5678",
      bankName: "BDO",
      transactionId: "TRX-202404-001",
      completionDate: "2026-04-15",
      courses: getCoursesByMentor("jose-reyes")
    },
    { 
      id: 3, 
      mentorName: "Ana Cruz", 
      mentorId: "ana-cruz",
      amount: calculateMentorRevenue(getCoursesByMentor("ana-cruz")), 
      status: "processing", 
      period: "2026-05", 
      courseCount: getCoursesByMentor("ana-cruz").length, 
      email: "mentor.cruz@gmail.com",
      bankAccount: "XXXX-XXXX-9012",
      bankName: "Metrobank",
      transactionId: "TRX-202405-002",
      courses: getCoursesByMentor("ana-cruz")
    },
    { 
      id: 4, 
      mentorName: "Ramon Villanueva", 
      mentorId: "ramon-villanueva",
      amount: calculateMentorRevenue(getCoursesByMentor("ramon-villanueva")), 
      status: "pending", 
      period: "2026-05", 
      courseCount: getCoursesByMentor("ramon-villanueva").length, 
      email: "mentor.villanueva@gmail.com",
      bankAccount: "XXXX-XXXX-3456",
      bankName: "UnionBank",
      courses: getCoursesByMentor("ramon-villanueva")
    },
    { 
      id: 5, 
      mentorName: "Lita Mendoza", 
      mentorId: "lita-mendoza",
      amount: calculateMentorRevenue(getCoursesByMentor("lita-mendoza")), 
      status: "pending", 
      period: "2026-05", 
      courseCount: getCoursesByMentor("lita-mendoza").length, 
      email: "mentor.mendoza@gmail.com",
      bankAccount: "XXXX-XXXX-7890",
      bankName: "BPI",
      courses: getCoursesByMentor("lita-mendoza")
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 5;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesStatus = filterStatus === 'all' ? true : payout.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      payout.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  const totalPending = filteredPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = filteredPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalProcessing = filteredPayouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);

  const handleProcessPayout = (id: number) => {
    setPayouts(prev => 
      prev.map(payout => 
        payout.id === id ? { ...payout, status: "processing" } : payout
      )
    );
    alert(`Processing payout for mentor. Funds will be transferred within 3-5 business days.`);
  };

  const handleMarkComplete = (id: number) => {
    setPayouts(prev => 
      prev.map(payout => 
        payout.id === id ? { 
          ...payout, 
          status: "completed",
          completionDate: new Date().toISOString().split('T')[0],
          transactionId: `TRX-${Date.now()}`
        } : payout
      )
    );
    alert(`Payout marked as completed. Mentor has been notified.`);
  };

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedPayout(null);
  };

  const getBadgeColor = (badge?: string) => {
    switch(badge) {
      case 'Bestseller': return 'bg-amber-100 text-amber-700';
      case 'Popular': return 'bg-blue-100 text-blue-700';
      case 'New': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/admin/dashboard" className="hover:text-red-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/admin/payments" className="hover:text-red-600 transition-colors">
              Payment Management
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Mentor Payouts</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Mentor Payouts</h1>
              <p className="text-muted-foreground mt-1">Track and manage mentor earnings and payouts</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-muted-foreground">Pending Payouts</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{formatCurrency(totalProcessing)}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-serif font-bold">{formatCurrency(totalCompleted)}</p>
              <p className="text-xs text-muted-foreground">Completed Payouts</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by mentor name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
              <Button variant="outline" onClick={() => {
                setFilterStatus('all');
                setSearchTerm('');
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Mentor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{payout.mentorName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payout.email}</td>
                    <td className="px-6 py-4 text-sm">{payout.courseCount} courses</td>
                    <td className="px-6 py-4 text-sm">{payout.period}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payout.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${getStatusColor(payout.status)}`}>
                        {getStatusIcon(payout.status)}
                        <span className="capitalize">{payout.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {payout.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Process Payout
                          </Button>
                        )}
                        {payout.status === 'processing' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-blue-500 text-blue-600"
                            onClick={() => handleMarkComplete(payout.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(payout)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary and Pagination */}
          <div className="px-6 py-4 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPayouts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              showEntries={true}
            />
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-navy">Payout Details</h2>
                <p className="text-sm text-muted-foreground">Complete payout information for {selectedPayout.mentorName}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Mentor Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Mentor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedPayout.mentorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {selectedPayout.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mentor ID</p>
                    <p className="font-mono text-sm">{selectedPayout.mentorId}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedPayout.amount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mentor receives 70% of course revenue</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(selectedPayout.status)}`}>
                      {getStatusIcon(selectedPayout.status)}
                      <span className="capitalize">{selectedPayout.status}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payout Period</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {selectedPayout.period}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bank Account</p>
                    <p className="font-medium">{selectedPayout.bankName || 'N/A'} - {selectedPayout.bankAccount || 'N/A'}</p>
                  </div>
                  {selectedPayout.transactionId && (
                    <div>
                      <p className="text-xs text-muted-foreground">Transaction ID</p>
                      <p className="font-mono text-sm">{selectedPayout.transactionId}</p>
                    </div>
                  )}
                  {selectedPayout.completionDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Completion Date</p>
                      <p className="font-medium">{new Date(selectedPayout.completionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Details */}
              {selectedPayout.courses && selectedPayout.courses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Course Breakdown ({selectedPayout.courseCount} courses)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="px-4 py-2 text-left">Course Title</th>
                          <th className="px-4 py-2 text-center">Category</th>
                          <th className="px-4 py-2 text-center">Students</th>
                          <th className="px-4 py-2 text-center">Course Price</th>
                          <th className="px-4 py-2 text-right">Mentor Revenue (70%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedPayout.courses.map((course, idx) => (
                          <tr key={idx} className="hover:bg-muted/20">
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span>{course.title}</span>
                                {course.badge && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${getBadgeColor(course.badge)}`}>
                                    {course.badge}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">{course.category}</td>
                            <td className="px-4 py-2 text-center">{course.enrolled.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center">{formatCurrency(course.price)}</td>
                            <td className="px-4 py-2 text-right font-semibold text-green-600">
                              {formatCurrency(course.price * 0.7)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-muted/20 font-semibold">
                          <td className="px-4 py-2" colSpan={2}>Total</td>
                          <td className="px-4 py-2 text-center">
                            {selectedPayout.courses.reduce((sum, c) => sum + c.enrolled, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {formatCurrency(selectedPayout.courses.reduce((sum, c) => sum + c.price, 0))}
                          </td>
                          <td className="px-4 py-2 text-right text-green-600">
                            {formatCurrency(selectedPayout.amount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-sm">
                    <p className="text-blue-800">
                      <strong>Note:</strong> Mentors receive 70% of each course sale. Platform fee is 30%.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                {selectedPayout.status === 'pending' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleProcessPayout(selectedPayout.id);
                      closeModal();
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Process Payout
                  </Button>
                )}
                {selectedPayout.status === 'processing' && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      handleMarkComplete(selectedPayout.id);
                      closeModal();
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}