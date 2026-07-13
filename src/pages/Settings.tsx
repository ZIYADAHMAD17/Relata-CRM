import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Lock, Palette, Download, Trash2, Shield, LogOut, Camera, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTasks, getMeetings, getPeople, getOrganizations, getInvoices } from '@/services/api';

const settingsNav = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'privacy', label: 'Privacy', icon: Shield },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Building better professional relationships with Relata.',
    avatar: user?.avatar || '',
  });

  // Security form
  const [securityForm, setSecurityForm] = useState({ current: '', newPass: '', confirm: '' });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    meetings: true,
    tasks: true,
    invoices: true,
    documents: false,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: profileForm.name, email: profileForm.email, avatar: profileForm.avatar });
    showToast('Profile saved successfully! ✓');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.current) {
      showToast('Please enter your current password.');
      return;
    }
    if (securityForm.newPass !== securityForm.confirm) {
      showToast('New passwords do not match.');
      return;
    }
    if (securityForm.newPass.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }
    setSecurityForm({ current: '', newPass: '', confirm: '' });
    showToast('Password updated successfully! ✓');
  };

  const handleExportData = async () => {
    showToast('Preparing export...');
    try {
      const [tasks, meetings, people, orgs, invoices] = await Promise.all([
        getTasks(), getMeetings(), getPeople(), getOrganizations(), getInvoices(),
      ]);
      const exportData = { people, organizations: orgs, tasks, meetings, invoices, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relata-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported successfully! ✓');
    } catch (e) {
      showToast('Export failed. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      logout();
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your personal information and public presence.</p>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-4 border-card shadow-xl ring-2 ring-primary/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role} Account</p>
                <Button size="sm" variant="outline" className="rounded-full h-8 w-fit mt-1 bg-card/50 border-border/50 text-xs" onClick={() => {
                  const url = window.prompt("Enter avatar image URL (e.g., https://example.com/photo.jpg)");
                  if (url) {
                    setProfileForm({ ...profileForm, avatar: url });
                    updateUser({ avatar: url });
                  }
                }}>
                  <Camera className="w-3.5 h-3.5 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="bg-muted/30 border-border/50 focus-visible:ring-primary rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="bg-muted/30 border-border/50 focus-visible:ring-primary rounded-xl" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-semibold">Bio</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="rounded-full px-8 shadow-lg shadow-primary/20">Save Changes</Button>
              </div>
            </form>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize how Relata looks and feels for you.</p>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all relative ${theme === t ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border hover:bg-muted/30'}`}
                  >
                    {theme === t && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`w-full h-14 rounded-xl border border-border/30 overflow-hidden ${t === 'dark' ? 'bg-gray-900' : t === 'system' ? '' : 'bg-gray-100'}`}>
                      {t === 'system' ? (
                        <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-900" />
                      ) : t === 'light' ? (
                        <div className="h-full w-full bg-white flex flex-col gap-1.5 p-2">
                          <div className="h-2 w-1/2 rounded-full bg-gray-200" />
                          <div className="h-1.5 w-3/4 rounded-full bg-gray-100" />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-900 flex flex-col gap-1.5 p-2">
                          <div className="h-2 w-1/2 rounded-full bg-gray-700" />
                          <div className="h-1.5 w-3/4 rounded-full bg-gray-800" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-semibold capitalize ${theme === t ? 'text-primary' : 'text-muted-foreground'}`}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-sm text-muted-foreground flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" />
              Theme is applied instantly. Your preference is saved automatically.
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Notifications</h2>
              <p className="text-sm text-muted-foreground">Choose how and when you receive notifications.</p>
            </div>
            <Separator className="bg-border/50" />
            {[
              { key: 'meetings', label: 'New Meeting Scheduled', desc: 'Get notified when a meeting is added' },
              { key: 'tasks', label: 'Task Assigned to You', desc: 'Get notified when a task is assigned' },
              { key: 'invoices', label: 'Invoice Status Updated', desc: 'Get notified when an invoice is paid or updated' },
              { key: 'documents', label: 'Document Uploaded', desc: 'Get notified when a document is uploaded' },
            ].map((item) => {
              const isOn = notifications[item.key as keyof typeof notifications];
              return (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }));
                      showToast(`${item.label} notifications ${isOn ? 'disabled' : 'enabled'}.`);
                    }}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${isOn ? 'bg-primary/80' : 'bg-muted-foreground/30'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${isOn ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              );
            })}
          </motion.div>
        );

      case 'security':
        return (
          <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Security</h2>
              <p className="text-sm text-muted-foreground">Manage your account security settings.</p>
            </div>
            <Separator className="bg-border/50" />
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Current Password</label>
                <Input type="password" placeholder="••••••••" value={securityForm.current} onChange={e => setSecurityForm({ ...securityForm, current: e.target.value })} className="bg-muted/30 border-border/50 rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">New Password</label>
                <Input type="password" placeholder="••••••••" value={securityForm.newPass} onChange={e => setSecurityForm({ ...securityForm, newPass: e.target.value })} className="bg-muted/30 border-border/50 rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Confirm New Password</label>
                <Input type="password" placeholder="••••••••" value={securityForm.confirm} onChange={e => setSecurityForm({ ...securityForm, confirm: e.target.value })} className="bg-muted/30 border-border/50 rounded-xl" />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="rounded-full px-8">Update Password</Button>
              </div>
            </form>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-6 flex flex-col gap-4 border-danger/20">
            <div>
              <h2 className="text-xl font-semibold text-danger mb-1">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible actions. Proceed with caution.</p>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="font-semibold text-sm">Export All Data</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Download a full backup of your CRM data as JSON.</p>
                </div>
                <Button onClick={handleExportData} variant="outline" size="sm" className="rounded-full shrink-0 bg-card/50">
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="font-semibold text-sm">Sign Out</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sign out of this device.</p>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full shrink-0 bg-card/50">
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-danger/5 border border-danger/20">
                <div>
                  <p className="font-semibold text-sm text-danger">Delete Account</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account. This cannot be undone.</p>
                </div>
                <Button onClick={handleDeleteAccount} variant="outline" size="sm" className="rounded-full shrink-0 text-danger border-danger/30 hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20 md:pb-0 relative">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 bg-card border border-border shadow-xl rounded-xl px-5 py-3 text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and configurations.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Nav */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-1">
          <div className="glass-panel p-2 flex flex-col gap-0.5">
            {settingsNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors w-full ${activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Panel */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
