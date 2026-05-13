// src/routes/admin/users/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, UserCheck, UserX, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const users = [
    { id: 1, name: "Maria Santos", email: "maria@example.com", role: "learner", status: "active", joined: "2024-01-15", courses: 3 },
    { id: 2, name: "John Reyes", email: "john@example.com", role: "learner", status: "active", joined: "2024-02-10", courses: 1 },
    { id: 3, name: "Jose Reyes", email: "mentor.jose@gmail.com", role: "mentor", status: "active", joined: "2024-01-05", courses: 2, rating: 4.8 },
    { id: 4, name: "Ana Cruz", email: "mentor.ana@gmail.com", role: "mentor", status: "active", joined: "2024-01-20", courses: 2, rating: 4.7 },
  ];

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Manage Users</h1>
          <p className="text-muted-foreground mt-1">View and manage all platform users</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin" ? "bg-red-100 text-red-700" :
                        user.role === "mentor" ? "bg-gold/10 text-gold" : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}