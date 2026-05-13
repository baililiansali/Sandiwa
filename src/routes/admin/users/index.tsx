// import { createFileRoute, Link } from "@tanstack/react-router";
// import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Pagination } from "@/components/Pagination";
// import { 
//   Search, 
//   UserCheck, 
//   UserX, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye,
//   CheckCircle,
//   Clock,
//   XCircle,
//   MessageSquare,
//   Calendar,
//   FileText
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";

// export const Route = createFileRoute("/admin/users/")({
//   component: AdminUsersPage,
// });

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: "learner" | "mentor" | "admin";
//   status: "active" | "suspended" | "pending";
//   joined: string;
//   lastActive: string;
//   coursesEnrolled?: number;
//   coursesTaught?: number;
//   rating?: number;
//   verified: boolean;
//   discussionsCount?: number;
//   eventsVerified?: number;
// }

// interface AuditLog {
//   id: number;
//   action: string;
//   userId: number;
//   userName: string;
//   details: string;
//   timestamp: string;
//   performedBy: string;
// }

// interface PendingDiscussion {
//   id: number;
//   userId: number;
//   userName: string;
//   title: string;
//   content: string;
//   courseName: string;
//   postedAt: string;
// }

// interface PendingEvent {
//   id: number;
//   mentorId: number;
//   mentorName: string;
//   title: string;
//   description: string;
//   date: string;
//   location: string;
//   expectedAttendees: number;
//   submittedAt: string;
// }

// // Mock users data
// const MOCK_USERS: User[] = [
//   { 
//     id: 1, 
//     name: "Maria Santos", 
//     email: "maria@example.com", 
//     role: "learner", 
//     status: "active", 
//     joined: "2024-01-15", 
//     lastActive: "2024-03-15",
//     coursesEnrolled: 5,
//     verified: true,
//     discussionsCount: 12
//   },
//   { 
//     id: 2, 
//     name: "John Reyes", 
//     email: "john@example.com", 
//     role: "learner", 
//     status: "active", 
//     joined: "2024-02-10", 
//     lastActive: "2024-03-14",
//     coursesEnrolled: 2,
//     verified: true,
//     discussionsCount: 5
//   },
//   { 
//     id: 3, 
//     name: "Jose Reyes", 
//     email: "mentor.jose@gmail.com", 
//     role: "mentor", 
//     status: "active", 
//     joined: "2024-01-05", 
//     lastActive: "2024-03-15",
//     coursesTaught: 3,
//     rating: 4.8,
//     verified: true,
//     eventsVerified: 8
//   },
//   { 
//     id: 4, 
//     name: "Ana Cruz", 
//     email: "mentor.ana@gmail.com", 
//     role: "mentor", 
//     status: "active", 
//     joined: "2024-01-20", 
//     lastActive: "2024-03-13",
//     coursesTaught: 2,
//     rating: 4.7,
//     verified: true,
//     eventsVerified: 5
//   },
//   { 
//     id: 5, 
//     name: "Pending User", 
//     email: "pending@example.com", 
//     role: "learner", 
//     status: "pending", 
//     joined: "2024-03-14", 
//     lastActive: "2024-03-14",
//     coursesEnrolled: 0,
//     verified: false,
//     discussionsCount: 0
//   },
// ];

// // Mock audit logs
// const MOCK_AUDIT_LOGS: AuditLog[] = [
//   { id: 1, action: "user_suspended", userId: 6, userName: "Spam User", details: "User suspended for violating terms", timestamp: "2024-03-09 10:15:00", performedBy: "admin@sandiwa.com" },
//   { id: 2, action: "user_added", userId: 5, userName: "Pending User", details: "New user registered", timestamp: "2024-03-08 09:00:00", performedBy: "System" },
//   { id: 3, action: "discussion_verified", userId: 1, userName: "Maria Santos", details: "Discussion post verified", timestamp: "2024-03-07 16:20:00", performedBy: "mentor.jose@gmail.com" },
//   { id: 4, action: "event_verified", userId: 4, userName: "Ana Cruz", details: "Event verified", timestamp: "2024-03-06 11:45:00", performedBy: "admin@sandiwa.com" },
//   { id: 5, action: "user_edited", userId: 2, userName: "John Reyes", details: "User information updated", timestamp: "2024-03-05 09:30:00", performedBy: "admin@sandiwa.com" },
// ];

// // Mock pending discussions for verification
// const MOCK_PENDING_DISCUSSIONS: PendingDiscussion[] = [
//   { id: 1, userId: 1, userName: "Maria Santos", title: "Filipino Grammar Tips", content: "I need help with verb conjugation...", courseName: "Filipino for Beginners", postedAt: "2024-03-16" },
//   { id: 2, userId: 2, userName: "John Reyes", title: "History Question", content: "Can someone explain the Philippine Revolution?", courseName: "Philippine History 101", postedAt: "2024-03-15" },
// ];

// // Mock pending events for verification
// const MOCK_PENDING_EVENTS: PendingEvent[] = [
//   { id: 1, mentorId: 3, mentorName: "Jose Reyes", title: "Filipino Cultural Workshop", description: "Learn about traditional Filipino customs", date: "2024-03-25", location: "Online", expectedAttendees: 50, submittedAt: "2024-03-14" },
//   { id: 2, mentorId: 4, mentorName: "Ana Cruz", title: "Filipino Cooking Class", description: "Learn to cook adobo and sinigang", date: "2024-03-28", location: "Makati City", expectedAttendees: 30, submittedAt: "2024-03-13" },
// ];

// function AdminUsersPage() {
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [users, setUsers] = useState<User[]>(MOCK_USERS);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAuditModal, setShowAuditModal] = useState(false);
//   const [showDiscussionsModal, setShowDiscussionsModal] = useState(false);
//   const [showEventsModal, setShowEventsModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [newUserName, setNewUserName] = useState("");
//   const [newUserEmail, setNewUserEmail] = useState("");
//   const [newUserRole, setNewUserRole] = useState<"learner" | "mentor">("learner");
//   const [pendingDiscussions, setPendingDiscussions] = useState<PendingDiscussion[]>(MOCK_PENDING_DISCUSSIONS);
//   const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(MOCK_PENDING_EVENTS);
//   const [auditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
//   const itemsPerPage = 10;

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = search === "" || 
//       user.name.toLowerCase().includes(search.toLowerCase()) ||
//       user.email.toLowerCase().includes(search.toLowerCase());
//     const matchesRole = roleFilter === "all" || user.role === roleFilter;
//     const matchesStatus = statusFilter === "all" || user.status === statusFilter;
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, roleFilter, statusFilter]);

//   const stats = {
//     total: users.length,
//     learners: users.filter(u => u.role === "learner").length,
//     mentors: users.filter(u => u.role === "mentor").length,
//     active: users.filter(u => u.status === "active").length,
//     pendingDiscussions: pendingDiscussions.length,
//     pendingEvents: pendingEvents.length,
//   };

//   const handleAddUser = () => {
//     if (!newUserName || !newUserEmail) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     const newId = Math.max(...users.map(u => u.id), 0) + 1;
//     const newUser: User = {
//       id: newId,
//       name: newUserName,
//       email: newUserEmail,
//       role: newUserRole,
//       status: "active",
//       joined: new Date().toISOString().split('T')[0],
//       lastActive: new Date().toISOString().split('T')[0],
//       verified: false,
//       coursesEnrolled: 0,
//       discussionsCount: 0,
//     };
//     setUsers([...users, newUser]);
//     setShowAddModal(false);
//     setNewUserName("");
//     setNewUserEmail("");
//     setNewUserRole("learner");
//     toast.success(`User ${newUserName} added successfully`);
//   };

//   const handleEditUser = () => {
//     if (!editingUser) return;
//     setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
//     setShowEditModal(false);
//     setEditingUser(null);
//     toast.success(`User ${editingUser.name} updated successfully`);
//   };

//   const handleDeleteUser = (user: User) => {
//     if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
//       setUsers(users.filter(u => u.id !== user.id));
//       toast.success(`User ${user.name} deleted successfully`);
//     }
//   };

//   const handleSuspendUser = (user: User) => {
//     const newStatus = user.status === "active" ? "suspended" : "active";
//     setUsers(users.map(u => 
//       u.id === user.id ? { ...u, status: newStatus } : u
//     ));
//     toast.success(`${user.name} ${newStatus === "suspended" ? "suspended" : "activated"}`);
//   };

//   const handleVerifyDiscussion = (discussionId: number) => {
//     const discussion = pendingDiscussions.find(d => d.id === discussionId);
//     if (discussion) {
//       setPendingDiscussions(pendingDiscussions.filter(d => d.id !== discussionId));
//       setUsers(users.map(u => 
//         u.id === discussion.userId ? { ...u, discussionsCount: (u.discussionsCount || 0) + 1, verified: true } : u
//       ));
//       toast.success(`Discussion "${discussion.title}" verified for ${discussion.userName}`);
//     }
//   };

//   const handleVerifyEvent = (eventId: number) => {
//     const event = pendingEvents.find(e => e.id === eventId);
//     if (event) {
//       setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
//       setUsers(users.map(u => 
//         u.id === event.mentorId ? { ...u, eventsVerified: (u.eventsVerified || 0) + 1 } : u
//       ));
//       toast.success(`Event "${event.title}" verified for mentor ${event.mentorName}`);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Active</span>;
//       case "suspended":
//         return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" /> Suspended</span>;
//       case "pending":
//         return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock className="h-3 w-3" /> Pending</span>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <AdminDashboardLayout>
//       <div className="p-6">
//         {/* Header */}
//         <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <h1 className="font-serif text-3xl font-bold text-navy">User Management</h1>
//             <p className="text-muted-foreground mt-1">Manage learners, mentors, and platform users</p>
//           </div>
//           <div className="flex gap-2">
//             <Button onClick={() => setShowAuditModal(true)} variant="outline">
//               <FileText className="h-4 w-4 mr-2" />
//               Audit Logs
//             </Button>
//             <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
//               <Plus className="h-4 w-4 mr-2" />
//               Add User
//             </Button>
//           </div>
//         </div>

//         {/* Stats Summary */}
//         <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mb-6">
//           <div className="rounded-lg border border-border bg-card p-3">
//             <p className="text-2xl font-bold text-navy">{stats.total}</p>
//             <p className="text-xs text-muted-foreground">Total Users</p>
//           </div>
//           <div className="rounded-lg border border-border bg-card p-3">
//             <p className="text-2xl font-bold text-blue-600">{stats.learners}</p>
//             <p className="text-xs text-muted-foreground">Learners</p>
//           </div>
//           <div className="rounded-lg border border-border bg-card p-3">
//             <p className="text-2xl font-bold text-gold">{stats.mentors}</p>
//             <p className="text-xs text-muted-foreground">Mentors</p>
//           </div>
//           <div className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/50" onClick={() => setShowDiscussionsModal(true)}>
//             <p className="text-2xl font-bold text-orange-600">{stats.pendingDiscussions}</p>
//             <p className="text-xs text-muted-foreground">Pending Discussions</p>
//           </div>
//           <div className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/50" onClick={() => setShowEventsModal(true)}>
//             <p className="text-2xl font-bold text-purple-600">{stats.pendingEvents}</p>
//             <p className="text-xs text-muted-foreground">Pending Events</p>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           <div className="relative flex-1 min-w-[200px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by name or email..."
//               className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//           </div>
//           <select
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//             className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             <option value="all">All Roles</option>
//             <option value="learner">Learner</option>
//             <option value="mentor">Mentor</option>
//             <option value="admin">Admin</option>
//           </select>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="suspended">Suspended</option>
//             <option value="pending">Pending</option>
//           </select>
//         </div>

//         {/* Users Table */}
//         <div className="rounded-xl border border-border bg-card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">User</th>
//                   <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Role</th>
//                   <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
//                   <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
//                   <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Last Active</th>
//                   <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {paginatedUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-muted/50">
//                     <td className="px-4 py-3">
//                       <div>
//                         <p className="text-sm font-medium">{user.name}</p>
//                         <p className="text-xs text-muted-foreground">{user.email}</p>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         user.role === "admin" ? "bg-red-100 text-red-700" :
//                         user.role === "mentor" ? "bg-gold/10 text-gold" : "bg-blue-100 text-blue-700"
//                       }`}>
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
//                     <td className="px-4 py-3 text-sm text-muted-foreground">{user.joined}</td>
//                     <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastActive}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-1">
//                         <Button 
//                           size="sm" 
//                           variant="ghost" 
//                           className="h-8 w-8 p-0"
//                           onClick={() => setSelectedUser(user)}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="ghost" 
//                           className="h-8 w-8 p-0 text-blue-600"
//                           onClick={() => {
//                             setEditingUser(user);
//                             setShowEditModal(true);
//                           }}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="ghost" 
//                           className="h-8 w-8 p-0 text-yellow-600"
//                           onClick={() => handleSuspendUser(user)}
//                         >
//                           {user.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="ghost" 
//                           className="h-8 w-8 p-0 text-red-600"
//                           onClick={() => handleDeleteUser(user)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="px-4 py-3 border-t border-border">
//             <Pagination
//               currentPage={currentPage}
//               totalItems={filteredUsers.length}
//               itemsPerPage={itemsPerPage}
//               onPageChange={setCurrentPage}
//               showEntries={true}
//             />
//           </div>
//         </div>

//         {/* User Detail Modal */}
//         {selectedUser && !showEditModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
//                 <h2 className="font-serif text-xl font-bold text-navy">User Details</h2>
//                 <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">✕</button>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div><label className="text-xs text-muted-foreground">Name</label><p className="font-medium">{selectedUser.name}</p></div>
//                   <div><label className="text-xs text-muted-foreground">Email</label><p>{selectedUser.email}</p></div>
//                   <div><label className="text-xs text-muted-foreground">Role</label><p className="capitalize">{selectedUser.role}</p></div>
//                   <div><label className="text-xs text-muted-foreground">Status</label><p className="capitalize">{selectedUser.status}</p></div>
//                   <div><label className="text-xs text-muted-foreground">Joined</label><p>{selectedUser.joined}</p></div>
//                   <div><label className="text-xs text-muted-foreground">Last Active</label><p>{selectedUser.lastActive}</p></div>
//                 </div>

//                 {/* Learner-specific info */}
//                 {selectedUser.role === "learner" && (
//                   <div className="border-t pt-4">
//                     <h3 className="font-semibold text-navy mb-3">Learner Information</h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div><label className="text-xs text-muted-foreground">Courses Enrolled</label><p>{selectedUser.coursesEnrolled || 0}</p></div>
//                       <div><label className="text-xs text-muted-foreground">Discussions Posted</label><p>{selectedUser.discussionsCount || 0}</p></div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Mentor-specific info */}
//                 {selectedUser.role === "mentor" && (
//                   <div className="border-t pt-4">
//                     <h3 className="font-semibold text-navy mb-3">Mentor Information</h3>
//                     <div className="grid grid-cols-3 gap-4">
//                       <div><label className="text-xs text-muted-foreground">Courses Taught</label><p>{selectedUser.coursesTaught || 0}</p></div>
//                       <div><label className="text-xs text-muted-foreground">Rating</label><p>{selectedUser.rating || 0} ⭐</p></div>
//                       <div><label className="text-xs text-muted-foreground">Events Verified</label><p>{selectedUser.eventsVerified || 0}</p></div>
//                     </div>
//                     <div className="mt-3">
//                       <Link to="/admin/users/mentors">
//                         <Button size="sm" variant="outline">
//                           <Eye className="h-3 w-3 mr-1" />
//                           View Mentor Applications
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit User Modal */}
//         {showEditModal && editingUser && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-md w-full">
//               <div className="p-6 border-b border-border">
//                 <h2 className="font-serif text-xl font-bold text-navy">Edit User</h2>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">Full Name</label>
//                   <input
//                     type="text"
//                     value={editingUser.name}
//                     onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
//                     className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Email</label>
//                   <input
//                     type="email"
//                     value={editingUser.email}
//                     onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
//                     className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//                 {/* ROLE FIELD REMOVED - Admin cannot change user role here */}
//               </div>
//               <div className="p-6 border-t border-border flex justify-end gap-2">
//                 <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
//                 <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add User Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-md w-full">
//               <div className="p-6 border-b border-border">
//                 <h2 className="font-serif text-xl font-bold text-navy">Add New User</h2>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">Full Name</label>
//                   <input
//                     type="text"
//                     value={newUserName}
//                     onChange={(e) => setNewUserName(e.target.value)}
//                     placeholder="Enter full name"
//                     className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Email</label>
//                   <input
//                     type="email"
//                     value={newUserEmail}
//                     onChange={(e) => setNewUserEmail(e.target.value)}
//                     placeholder="Enter email address"
//                     className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Role</label>
//                   <select
//                     value={newUserRole}
//                     onChange={(e) => setNewUserRole(e.target.value as "learner" | "mentor")}
//                     className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                   >
//                     <option value="learner">Learner</option>
//                     <option value="mentor">Mentor</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="p-6 border-t border-border flex justify-end gap-2">
//                 <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
//                 <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">Add User</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Audit Logs Modal */}
//         {showAuditModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-5xl w-full max-h-[80vh] overflow-y-auto">
//               <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
//                 <h2 className="font-serif text-xl font-bold text-navy">Audit Logs</h2>
//                 <button onClick={() => setShowAuditModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
//               </div>
//               <div className="p-6">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-muted">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium">Timestamp</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium">Action</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium">User</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium">Details</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium">Performed By</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                       {auditLogs.map((log) => (
//                         <tr key={log.id}>
//                           <td className="px-4 py-2 text-xs font-mono">{log.timestamp}</td>
//                           <td className="px-4 py-2 text-xs capitalize">{log.action.replace(/_/g, ' ')}</td>
//                           <td className="px-4 py-2 text-xs font-medium">{log.userName}</td>
//                           <td className="px-4 py-2 text-xs">{log.details}</td>
//                           <td className="px-4 py-2 text-xs">{log.performedBy}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Pending Discussions Modal */}
//         {showDiscussionsModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
//               <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
//                 <h2 className="font-serif text-xl font-bold text-navy">Pending Discussion Verification</h2>
//                 <button onClick={() => setShowDiscussionsModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
//               </div>
//               <div className="p-6">
//                 {pendingDiscussions.length === 0 ? (
//                   <div className="text-center py-8">
//                     <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
//                     <p className="text-muted-foreground">No pending discussions to verify</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingDiscussions.map((discussion) => (
//                       <div key={discussion.id} className="border rounded-lg p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h3 className="font-semibold text-navy">{discussion.title}</h3>
//                             <p className="text-sm text-muted-foreground">by {discussion.userName} • {discussion.courseName}</p>
//                           </div>
//                           <Button 
//                             size="sm" 
//                             className="bg-green-600 hover:bg-green-700"
//                             onClick={() => handleVerifyDiscussion(discussion.id)}
//                           >
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Verify
//                           </Button>
//                         </div>
//                         <p className="text-sm">{discussion.content}</p>
//                         <p className="text-xs text-muted-foreground mt-2">Posted: {discussion.postedAt}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Pending Events Modal */}
//         {showEventsModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
//               <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
//                 <h2 className="font-serif text-xl font-bold text-navy">Pending Event Verification</h2>
//                 <button onClick={() => setShowEventsModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
//               </div>
//               <div className="p-6">
//                 {pendingEvents.length === 0 ? (
//                   <div className="text-center py-8">
//                     <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
//                     <p className="text-muted-foreground">No pending events to verify</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingEvents.map((event) => (
//                       <div key={event.id} className="border rounded-lg p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h3 className="font-semibold text-navy">{event.title}</h3>
//                             <p className="text-sm text-muted-foreground">by {event.mentorName}</p>
//                           </div>
//                           <Button 
//                             size="sm" 
//                             className="bg-green-600 hover:bg-green-700"
//                             onClick={() => handleVerifyEvent(event.id)}
//                           >
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Verify Event
//                           </Button>
//                         </div>
//                         <p className="text-sm">{event.description}</p>
//                         <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
//                           <p><span className="text-muted-foreground">Date:</span> {event.date}</p>
//                           <p><span className="text-muted-foreground">Location:</span> {event.location}</p>
//                           <p><span className="text-muted-foreground">Expected Attendees:</span> {event.expectedAttendees}</p>
//                           <p><span className="text-muted-foreground">Submitted:</span> {event.submittedAt}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminDashboardLayout>
//   );
// }



































// src/routes/admin/users/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { 
  Search, 
  UserCheck, 
  UserX, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Calendar,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

interface User {
  id: number;
  name: string;
  email: string;
  role: "learner" | "mentor" | "admin";
  status: "active" | "suspended" | "pending";
  joined: string;
  lastActive: string;
  coursesEnrolled?: number;
  coursesTaught?: number;
  rating?: number;
  verified: boolean;
  discussionsCount?: number;
  eventsVerified?: number;
}

interface PendingDiscussion {
  id: number;
  userId: number;
  userName: string;
  title: string;
  content: string;
  courseName: string;
  postedAt: string;
}

interface PendingEvent {
  id: number;
  creatorId: number;      // Can be learner ID or mentor ID
  creatorName: string;
  creatorType: "learner" | "mentor";
  title: string;
  description: string;
  date: string;
  location: string;
  expectedAttendees: number;
  submittedAt: string;
}

// Mock users data
const MOCK_USERS: User[] = [
  { 
    id: 1, 
    name: "Maria Santos", 
    email: "maria@example.com", 
    role: "learner", 
    status: "active", 
    joined: "2024-01-15", 
    lastActive: "2024-03-15",
    coursesEnrolled: 5,
    verified: true,
    discussionsCount: 12
  },
  { 
    id: 2, 
    name: "John Reyes", 
    email: "john@example.com", 
    role: "learner", 
    status: "active", 
    joined: "2024-02-10", 
    lastActive: "2024-03-14",
    coursesEnrolled: 2,
    verified: true,
    discussionsCount: 5
  },
  { 
    id: 3, 
    name: "Jose Reyes", 
    email: "mentor.jose@gmail.com", 
    role: "mentor", 
    status: "active", 
    joined: "2024-01-05", 
    lastActive: "2024-03-15",
    coursesTaught: 3,
    rating: 4.8,
    verified: true,
    eventsVerified: 8
  },
  { 
    id: 4, 
    name: "Ana Cruz", 
    email: "mentor.ana@gmail.com", 
    role: "mentor", 
    status: "active", 
    joined: "2024-01-20", 
    lastActive: "2024-03-13",
    coursesTaught: 2,
    rating: 4.7,
    verified: true,
    eventsVerified: 5
  },
  { 
    id: 5, 
    name: "Pending User", 
    email: "pending@example.com", 
    role: "learner", 
    status: "pending", 
    joined: "2024-03-14", 
    lastActive: "2024-03-14",
    coursesEnrolled: 0,
    verified: false,
    discussionsCount: 0
  },
  { 
    id: 6, 
    name: "Carlos Mendoza", 
    email: "carlos@example.com", 
    role: "learner", 
    status: "active", 
    joined: "2024-03-01", 
    lastActive: "2024-03-12",
    coursesEnrolled: 3,
    verified: true,
    discussionsCount: 8
  },
  { 
    id: 7, 
    name: "Isabella Flores", 
    email: "isabella@example.com", 
    role: "learner", 
    status: "active", 
    joined: "2024-02-20", 
    lastActive: "2024-03-11",
    coursesEnrolled: 4,
    verified: true,
    discussionsCount: 15
  },
  { 
    id: 8, 
    name: "Miguel Santos", 
    email: "miguel@example.com", 
    role: "mentor", 
    status: "active", 
    joined: "2024-01-10", 
    lastActive: "2024-03-10",
    coursesTaught: 4,
    rating: 4.9,
    verified: true,
    eventsVerified: 12
  },
  { 
    id: 9, 
    name: "Patricia Cruz", 
    email: "patricia@example.com", 
    role: "learner", 
    status: "suspended", 
    joined: "2024-01-25", 
    lastActive: "2024-02-28",
    coursesEnrolled: 1,
    verified: false,
    discussionsCount: 2
  },
  { 
    id: 10, 
    name: "Ramon Villanueva", 
    email: "ramon@example.com", 
    role: "mentor", 
    status: "active", 
    joined: "2024-01-08", 
    lastActive: "2024-03-09",
    coursesTaught: 5,
    rating: 4.9,
    verified: true,
    eventsVerified: 15
  },
  { 
    id: 11, 
    name: "Sofia Garcia", 
    email: "sofia@example.com", 
    role: "learner", 
    status: "active", 
    joined: "2024-02-15", 
    lastActive: "2024-03-08",
    coursesEnrolled: 2,
    verified: true,
    discussionsCount: 7
  },
  { 
    id: 12, 
    name: "Luis Fernandez", 
    email: "luis@example.com", 
    role: "learner", 
    status: "active", 
    joined: "2024-02-01", 
    lastActive: "2024-03-07",
    coursesEnrolled: 3,
    verified: true,
    discussionsCount: 4
  },
];

// Mock pending discussions for verification
const MOCK_PENDING_DISCUSSIONS: PendingDiscussion[] = [
  { id: 1, userId: 1, userName: "Maria Santos", title: "Filipino Grammar Tips", content: "I need help with verb conjugation...", courseName: "Filipino for Beginners", postedAt: "2024-03-16" },
  { id: 2, userId: 2, userName: "John Reyes", title: "History Question", content: "Can someone explain the Philippine Revolution?", courseName: "Philippine History 101", postedAt: "2024-03-15" },
  { id: 3, userId: 6, userName: "Carlos Mendoza", title: "Pronunciation Help", content: "How do you pronounce 'ng' correctly?", courseName: "Filipino for Beginners", postedAt: "2024-03-14" },
];

// Mock pending events for verification (updated with creatorId and creatorType)
const MOCK_PENDING_EVENTS: PendingEvent[] = [
  // Mentor-created events
  { id: 1, creatorId: 3, creatorName: "Jose Reyes", creatorType: "mentor", title: "Filipino Cultural Workshop", description: "Learn about traditional Filipino customs", date: "2024-03-25", location: "Online", expectedAttendees: 50, submittedAt: "2024-03-14" },
  { id: 2, creatorId: 4, creatorName: "Ana Cruz", creatorType: "mentor", title: "Filipino Cooking Class", description: "Learn to cook adobo and sinigang", date: "2024-03-28", location: "Makati City", expectedAttendees: 30, submittedAt: "2024-03-13" },
  
  // Learner-created events
  { id: 3, creatorId: 1, creatorName: "Maria Santos", creatorType: "learner", title: "Tagalog Study Group", description: "Weekly meetup to practice Tagalog conversation", date: "2024-03-30", location: "Coffee Shop, Makati", expectedAttendees: 15, submittedAt: "2024-03-15" },
  { id: 4, creatorId: 2, creatorName: "John Reyes", creatorType: "learner", title: "History Discussion Night", description: "Group discussion about Philippine Revolution", date: "2024-04-02", location: "Online (Zoom)", expectedAttendees: 25, submittedAt: "2024-03-14" },
];

function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDiscussionsModal, setShowDiscussionsModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"learner" | "mentor">("learner");
  const [pendingDiscussions, setPendingDiscussions] = useState<PendingDiscussion[]>(MOCK_PENDING_DISCUSSIONS);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(MOCK_PENDING_EVENTS);
  const itemsPerPage = 5;

  const filteredUsers = users.filter(user => {
    const matchesSearch = search === "" || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  const stats = {
    total: users.length,
    learners: users.filter(u => u.role === "learner").length,
    mentors: users.filter(u => u.role === "mentor").length,
    active: users.filter(u => u.status === "active").length,
    pendingDiscussions: pendingDiscussions.length,
    pendingEvents: pendingEvents.length,
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Please fill in all fields");
      return;
    }
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const newUser: User = {
      id: newId,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "active",
      joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      verified: false,
      coursesEnrolled: 0,
      discussionsCount: 0,
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("learner");
    toast.success(`User ${newUserName} added successfully`);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setShowEditModal(false);
    setEditingUser(null);
    toast.success(`User ${editingUser.name} updated successfully`);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      setUsers(users.filter(u => u.id !== user.id));
      toast.success(`User ${user.name} deleted successfully`);
    }
  };

  const handleSuspendUser = (user: User) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    toast.success(`${user.name} ${newStatus === "suspended" ? "suspended" : "activated"}`);
  };

  const handleVerifyDiscussion = (discussionId: number) => {
    const discussion = pendingDiscussions.find(d => d.id === discussionId);
    if (discussion) {
      setPendingDiscussions(pendingDiscussions.filter(d => d.id !== discussionId));
      setUsers(users.map(u => 
        u.id === discussion.userId ? { ...u, discussionsCount: (u.discussionsCount || 0) + 1, verified: true } : u
      ));
      toast.success(`Discussion "${discussion.title}" verified for ${discussion.userName}`);
    }
  };

  const handleVerifyEvent = (eventId: number) => {
    const event = pendingEvents.find(e => e.id === eventId);
    if (event) {
      setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
      // Update the creator's eventsVerified count
      setUsers(users.map(u => 
        u.id === event.creatorId ? { ...u, eventsVerified: (u.eventsVerified || 0) + 1 } : u
      ));
      toast.success(`Event "${event.title}" verified for ${event.creatorName} (${event.creatorType === "mentor" ? "Mentor" : "Learner"})`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Active</span>;
      case "suspended":
        return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" /> Suspended</span>;
      case "pending":
        return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock className="h-3 w-3" /> Pending</span>;
      default:
        return null;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage learners, mentors, and platform users</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/users/audit-logs">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Audit Logs
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mb-6">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-blue-600">{stats.learners}</p>
            <p className="text-xs text-muted-foreground">Learners</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-gold">{stats.mentors}</p>
            <p className="text-xs text-muted-foreground">Mentors</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/50" onClick={() => setShowDiscussionsModal(true)}>
            <p className="text-2xl font-bold text-orange-600">{stats.pendingDiscussions}</p>
            <p className="text-xs text-muted-foreground">Pending Discussions</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/50" onClick={() => setShowEventsModal(true)}>
            <p className="text-2xl font-bold text-purple-600">{stats.pendingEvents}</p>
            <p className="text-xs text-muted-foreground">Pending Events</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Roles</option>
            <option value="learner">Learner</option>
            <option value="mentor">Mentor</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Last Active</th>
                  <th className="px-4 py-3 text-left text-[8px] font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin" ? "bg-red-100 text-red-700" :
                        user.role === "mentor" ? "bg-gold/10 text-gold" : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-yellow-600"
                          onClick={() => handleSuspendUser(user)}
                        >
                          {user.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              showEntries={true}
            />
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && !showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
                <h2 className="font-serif text-xl font-bold text-navy">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground">Name</label><p className="font-medium">{selectedUser.name}</p></div>
                  <div><label className="text-xs text-muted-foreground">Email</label><p>{selectedUser.email}</p></div>
                  <div><label className="text-xs text-muted-foreground">Role</label><p className="capitalize">{selectedUser.role}</p></div>
                  <div><label className="text-xs text-muted-foreground">Status</label><p className="capitalize">{selectedUser.status}</p></div>
                  <div><label className="text-xs text-muted-foreground">Joined</label><p>{selectedUser.joined}</p></div>
                  <div><label className="text-xs text-muted-foreground">Last Active</label><p>{selectedUser.lastActive}</p></div>
                </div>

                {/* Learner-specific info */}
                {selectedUser.role === "learner" && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-navy mb-3">Learner Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs text-muted-foreground">Courses Enrolled</label><p>{selectedUser.coursesEnrolled || 0}</p></div>
                      <div><label className="text-xs text-muted-foreground">Discussions Posted</label><p>{selectedUser.discussionsCount || 0}</p></div>
                    </div>
                  </div>
                )}

                {/* Mentor-specific info */}
                {selectedUser.role === "mentor" && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-navy mb-3">Mentor Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div><label className="text-xs text-muted-foreground">Courses Taught</label><p>{selectedUser.coursesTaught || 0}</p></div>
                      <div><label className="text-xs text-muted-foreground">Rating</label><p>{selectedUser.rating || 0} ⭐</p></div>
                      <div><label className="text-xs text-muted-foreground">Events Verified</label><p>{selectedUser.eventsVerified || 0}</p></div>
                    </div>
                    <div className="mt-3">
                      <Link to="/admin/users/mentors">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Mentor Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal - WITHOUT Role field */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-border">
                <h2 className="font-serif text-xl font-bold text-navy">Edit User</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Discussions Modal */}
        {showDiscussionsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
                <h2 className="font-serif text-xl font-bold text-navy">Pending Discussion Verification</h2>
                <button onClick={() => setShowDiscussionsModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="p-6">
                {pendingDiscussions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">No pending discussions to verify</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDiscussions.map((discussion) => (
                      <div key={discussion.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-navy">{discussion.title}</h3>
                            <p className="text-sm text-muted-foreground">by {discussion.userName} • {discussion.courseName}</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerifyDiscussion(discussion.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        </div>
                        <p className="text-sm">{discussion.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">Posted: {discussion.postedAt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}