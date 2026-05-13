// src/routes/admin/profile/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Calendar, Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile/")({
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");
  const [adminEmail, setAdminEmail] = useState("admin@sandiwa.com");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Admin User";
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "admin@sandiwa.com";
    setAdminName(name);
    setAdminEmail(email);
    setFormData({ fullName: name, email: email });
  }, []);

  const initials = adminName.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleSave = () => {
    localStorage.setItem("userName", formData.fullName);
    sessionStorage.setItem("userName", formData.fullName);
    localStorage.setItem("userEmail", formData.email);
    sessionStorage.setItem("userEmail", formData.email);
    
    setAdminName(formData.fullName);
    setAdminEmail(formData.email);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ fullName: adminName, email: adminEmail });
    setIsEditing(false);
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-3xl font-serif font-bold mx-auto">
              {initials}
            </div>
            {!isEditing ? (
              <>
                <h1 className="mt-4 font-serif text-3xl font-bold text-navy">{adminName}</h1>
                <p className="text-red-500 font-medium">System Administrator</p>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-4 flex gap-3 justify-center">
                <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold text-navy mb-4">Profile Information</h2>
            
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-red-500" />
                  <span className="font-medium w-24">Full Name:</span>
                  <span className="text-muted-foreground">{adminName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span className="font-medium w-24">Email:</span>
                  <span className="text-muted-foreground">{adminEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="font-medium w-24">Role:</span>
                  <span className="text-muted-foreground">Administrator</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="font-medium w-24">Joined:</span>
                  <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}