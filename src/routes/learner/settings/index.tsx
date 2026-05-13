import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Bell, Lock, Palette, Save, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/learner/settings/")({
  head: () => ({
    meta: [
      { title: "Settings — Sandiwa" }, 
      { name: "description", content: "Manage your account settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("notifications");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
  });

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: "/learner/dashboard" });
    }
  };

  const handleSave = () => {
    // Save notification settings
    toast.success("Settings saved successfully!");
    
    if (window.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: "/learner/dashboard" });
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-6">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="font-serif text-3xl font-bold text-navy">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account preferences</p>
            </div>

            <div className="flex gap-6 flex-col md:flex-row">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-48 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-gold/10 text-gold font-medium"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <h2 className="font-serif text-xl font-bold text-navy">Notification Preferences</h2>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive important updates via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                          className="toggle"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-xs text-muted-foreground">Receive promotions and updates</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.marketingEmails}
                          onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
                          className="toggle"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                    <h2 className="font-serif text-xl font-bold text-navy">Security</h2>
                    <div>
                      <h3 className="font-semibold text-navy mb-3">Change Password</h3>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                        <Button variant="outline">Update Password</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === "appearance" && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="font-serif text-xl font-bold text-navy mb-4">Appearance</h2>
                    <div>
                      <p className="font-medium mb-2">Theme</p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-md border border-gold bg-gold/10 text-gold">Light</button>
                        <button className="px-4 py-2 rounded-md border border-border hover:border-gold">Dark</button>
                        <button className="px-4 py-2 rounded-md border border-border hover:border-gold">System</button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave} className="bg-gold hover:bg-gold/90 text-white">
                    <Save className="h-4 w-4 mr-2" /> Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}