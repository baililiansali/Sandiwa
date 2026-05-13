// src/routes/admin/settings/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Bell, Lock, Palette, Save, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Define the settings interface
interface AdminSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  // Notification Settings
  emailNotifications: boolean;
  newUserAlerts: boolean;
  newCourseAlerts: boolean;
  newMentorAlerts: boolean;
  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: string;
  // Appearance
  theme: "light" | "dark" | "system";
}

export const Route = createFileRoute("/admin/settings/")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "security" | "appearance">("general");
  const [settings, setSettings] = useState<AdminSettings>({
    // General Settings
    siteName: "Sandiwa",
    siteDescription: "Learn Filipino language and culture",
    contactEmail: "admin@sandiwa.com",
    // Notification Settings
    emailNotifications: true,
    newUserAlerts: true,
    newCourseAlerts: true,
    newMentorAlerts: true,
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "60",
    // Appearance
    theme: "light",
  });

  const tabs = [
    { id: "general" as const, label: "General", icon: Globe },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
  ];

  const handleSave = () => {
    localStorage.setItem("sandiwa.admin.settings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const handleInputChange = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleThemeChange = (theme: AdminSettings["theme"]) => {
    setSettings({ ...settings, theme });
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage platform settings and preferences</p>
        </div>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-500/10 text-red-500 font-medium"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-serif text-xl font-bold text-navy">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange("siteName", e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Site Description</label>
                    <textarea
                      rows={3}
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-serif text-xl font-bold text-navy">Notification Preferences</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive system notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                      className="toggle accent-red-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">New User Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified when new users register</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.newUserAlerts}
                      onChange={(e) => handleInputChange("newUserAlerts", e.target.checked)}
                      className="toggle accent-red-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">New Course Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified when new courses are published</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.newCourseAlerts}
                      onChange={(e) => handleInputChange("newCourseAlerts", e.target.checked)}
                      className="toggle accent-red-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">New Mentor Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified when new mentors apply</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.newMentorAlerts}
                      onChange={(e) => handleInputChange("newMentorAlerts", e.target.checked)}
                      className="toggle accent-red-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                <h2 className="font-serif text-xl font-bold text-navy">Security Settings</h2>
                <div>
                  <h3 className="font-semibold text-navy mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Button variant="outline" className="border-red-500 text-red-500">Update Password</Button>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
                      className="toggle accent-red-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl font-bold text-navy mb-4">Appearance</h2>
                <div>
                  <p className="font-medium mb-2">Theme</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`px-4 py-2 rounded-md border transition ${
                        settings.theme === "light" 
                          ? "border-red-500 bg-red-500/10 text-red-500" 
                          : "border-border hover:border-red-500"
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`px-4 py-2 rounded-md border transition ${
                        settings.theme === "dark" 
                          ? "border-red-500 bg-red-500/10 text-red-500" 
                          : "border-border hover:border-red-500"
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`px-4 py-2 rounded-md border transition ${
                        settings.theme === "system" 
                          ? "border-red-500 bg-red-500/10 text-red-500" 
                          : "border-border hover:border-red-500"
                      }`}
                    >
                      System
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600">
                <Save className="h-4 w-4 mr-2" /> Save All Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}