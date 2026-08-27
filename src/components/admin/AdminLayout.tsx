import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, UserCheck, FileText, Image as ImageIcon, Settings as SettingsIcon, LogOut, ArrowLeft, Lock, Star, Eye, EyeOff, Gift, Building2, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardHome } from './DashboardHome';
import { ExpertManager } from './ExpertManager';
import { BlogManager } from './BlogManager';
import { MediaLibrary } from './MediaLibrary';
import { SiteSettingsEditor } from './SiteSettings';
import { ReviewManager } from './ReviewManager';

import { GalleryManager } from './GalleryManager';
import { ServiceManager } from './ServiceManager';
import { OfferManager } from './OfferManager';
// @ts-ignore
import AdminDashboard from '../../pages/dashboard/AdminDashboard';

const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));

class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Admin Dashboard Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-[#0b0f19] border border-red-500/20 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
          <h3 className="text-lg font-bold text-white">Something went wrong</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            The Collaborations & Camps section could not be loaded. Please try again.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminLayout: React.FC = () => {
  const { isAdmin, login, logout } = useAuth();
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('zk_admin_remember_me') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('zk_admin_saved_username') || '';
  });
  const [password, setPassword] = useState(() => {
    return localStorage.getItem('zk_admin_saved_password') || '';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'experts' | 'blogs' | 'reviews' | 'media' | 'settings' | 'gallery' | 'services' | 'offers' | 'collaborations' | 'analytics'>('dashboard');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      if (rememberMe) {
        localStorage.setItem('zk_admin_remember_me', 'true');
        localStorage.setItem('zk_admin_saved_username', username);
        localStorage.setItem('zk_admin_saved_password', password);
      } else {
        localStorage.removeItem('zk_admin_remember_me');
        localStorage.removeItem('zk_admin_saved_username');
        localStorage.removeItem('zk_admin_saved_password');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl glass-panel border border-cyan-500/30 p-8 text-white shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-white">Admin Portal</h2>
            <p className="text-xs text-slate-400">
              Enter admin credentials to manage Experts, Articles, Patient Reviews & Settings.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Username / Email</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

             <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300 font-bold">Remember Me & Save Password</span>
              </label>
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-semibold text-center">
                Invalid credentials. Please check your username and password.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:scale-[1.02] transition-all text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#home';
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Public Website
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-16 px-4 relative z-20">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Admin Sidebar Navigation */}
          <div className="lg:w-64 shrink-0 space-y-4">
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                  Admin Panel
                </span>
                <h3 className="text-base font-bold text-white">ZK Rehab Sphere</h3>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>

            <div className="p-2 rounded-3xl glass-panel border border-white/10 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
                { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart2 size={18} /> },
                { id: 'experts', label: 'Doctors / Experts', icon: <UserCheck size={18} /> },
                { id: 'services', label: 'Services & Cards', icon: <SettingsIcon size={18} /> },
                { id: 'blogs', label: 'Articles & Blogs', icon: <FileText size={18} /> },
                { id: 'reviews', label: 'Review Moderation', icon: <Star size={18} /> },
                { id: 'gallery', label: 'Patient Gallery', icon: <ImageIcon size={18} /> },
                { id: 'media', label: 'Media Library', icon: <ImageIcon size={18} /> },
                { id: 'offers', label: 'Website Offers', icon: <Gift size={18} /> },
                { id: 'collaborations', label: 'Collaborations & Camps', icon: <Building2 size={18} /> },
                { id: 'settings', label: 'Site Settings', icon: <SettingsIcon size={18} /> },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#home';
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-all"
            >
              <ArrowLeft size={14} /> View Public Website
            </a>
          </div>

          {/* Main Dashboard Content View */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <DashboardHome />}
            {activeTab === 'analytics' && (
              <Suspense fallback={<div className="p-8 text-center text-cyan-400">Loading Analytics...</div>}>
                <AnalyticsDashboard />
              </Suspense>
            )}
            {activeTab === 'experts' && <ExpertManager />}
            {activeTab === 'services' && <ServiceManager />}
            {activeTab === 'blogs' && <BlogManager />}
            {activeTab === 'reviews' && <ReviewManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'media' && <MediaLibrary />}
            {activeTab === 'offers' && <OfferManager />}
            {activeTab === 'collaborations' && (
              <AdminErrorBoundary>
                <AdminDashboard initialTab="collaborations" />
              </AdminErrorBoundary>
            )}
            {activeTab === 'settings' && <SiteSettingsEditor />}
          </div>

        </div>
      </div>
    </div>
  );
};
