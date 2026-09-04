import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, MessageSquare, BookOpen, Activity,
  UserCheck, Bell, Trash2, Eye, CheckCircle, XCircle,
  Clock, ChevronDown, Plus, Shield, Edit, BarChart2, Mail, RefreshCw, X, Phone, FileText, Folder,
  QrCode, Download, Printer, Copy, ClipboardCheck, ExternalLink, Building2,
  Globe, MoreVertical, Archive, MapPin, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';
import { 
  usersAPI, appointmentsAPI, contactAPI, expertsAPI, slotsAPI, 
  newsletterAPI, blogsAPI, resourcesAPI, collaborationsAPI, 
  campaignsAPI, registrationsAPI, enquiriesAPI 
} from '../../api/axios';
import SEO from '../../components/SEO';
import { resolveImageUrl } from '../../utils/imageUtils';

// ─── React Error Boundary ──────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught rendering exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 border border-red-500/30 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-white">Something went wrong</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            This section could not be loaded due to a rendering error.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
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


const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="glass-panel border border-white/10 p-6 rounded-3xl text-white bg-slate-950/40">
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-300 text-sm font-medium">{label}</span>
      <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-20 flex items-center justify-center`}>
        {Icon ? <Icon size={20} className={color.replace('bg-', 'text-')} /> : null}
      </div>
    </div>
    <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
  </div>
);

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg[status] || 'bg-slate-100 text-slate-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Role Badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const cfg = {
    admin: 'bg-purple-100 text-purple-800',
    expert: 'bg-blue-100 text-blue-800',
    patient: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg[role] || ''}`}>
      {role}
    </span>
  );
};

const normalizeExpertRecords = (users = [], profiles = []) => {
  const mergedExperts = users.map((user) => {
    const profile = profiles.find(
      (e) => e.linkedUserId?._id === user._id || e.linkedUserId === user._id
    );
    return { type: 'user', user, profile };
  });

  const standaloneProfiles = profiles
    .filter(
      (profile) =>
        !users.some(
          (user) => profile.linkedUserId?._id === user._id || profile.linkedUserId === user._id
        )
    )
    .map((profile) => ({ type: 'profile', profile }));

  return [...mergedExperts, ...standaloneProfiles];
};

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'slots', label: 'Slots', icon: Clock },
  { id: 'experts', label: 'Experts', icon: Activity },
  { id: 'users', label: 'Patients', icon: Users },
  { id: 'blogs', label: 'Blogs', icon: FileText },
  { id: 'resources', label: 'Resources', icon: Folder },
  { id: 'collaborations', label: 'Collaborations', icon: Shield },
  { id: 'registrations', label: 'Camps / Registrations', icon: ClipboardCheck },
  { id: 'enquiries', label: 'Partnership Enquiries', icon: MessageSquare },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
];


const AVAILABLE_TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM'
];

// ─── Add Slot Form ─────────────────────────────────────────────────────────────
const extractExpertOption = (item) => {
  if (item.user) {
    return {
      id: item.user._id,
      label: item.user.name || item.user.email || 'Unnamed Expert',
      subtitle: item.user.email,
    };
  }

  if (item.profile) {
    const linkedUser = item.profile.linkedUserId;
    const id = linkedUser?._id || linkedUser || item.profile._id;
    return {
      id,
      label: item.profile.name || item.profile.email || 'Unnamed Expert',
      subtitle: item.profile.email || (linkedUser?.email || ''),
    };
  }

  return {
    id: item._id,
    label: item.name || item.displayName || item.email || 'Unnamed Expert',
    subtitle: item.email || '',
  };
};

const AddSlotForm = ({ experts, onCreated }) => {
  const [form, setForm] = useState({ expertId: '', date: '', times: [] });
  const [assignExpert, setAssignExpert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const toggleTime = (time) => {
    setForm(prev => {
      const times = prev.times.includes(time) 
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time];
      return { ...prev, times };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (assignExpert && !form.expertId) {
      setMsg('❌ Please select an expert before creating slots.');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    if (form.times.length === 0) {
      setMsg('❌ Please select at least one time slot.');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setLoading(true);
    try {
      await slotsAPI.create({
        expertId: assignExpert ? form.expertId : undefined,
        date: form.date,
        times: form.times,
      });
      setMsg(`✅ Slots created!`);
      setForm({ expertId: '', date: '', times: [] });
      if (onCreated) onCreated();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setTimeout(() => setMsg(''), 3000);
      setLoading(false);
    }
  };

  const expertOptions = experts.map((item) => extractExpertOption(item)).filter(opt => opt.id);
  const expertCount = expertOptions.length;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={16} /> Add Slots</h3>
      <div className="mb-4">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={assignExpert}
            onChange={(e) => {
              const next = e.target.checked;
              setAssignExpert(next);
              if (!next) {
                setForm((prev) => ({ ...prev, expertId: '' }));
              }
            }}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          Assign an expert now
        </label>
        <p className="text-sm text-slate-500 mt-2">
          {assignExpert
            ? 'Pick the expert who will own this slot.'
            : 'Create an open slot without an assigned expert. You can assign one later.'}
        </p>
      </div>
      {assignExpert ? (
        expertCount > 0 ? (
          <p className="text-sm text-slate-500 mb-4">Select from {expertCount} expert{expertCount === 1 ? '' : 's'} below.</p>
        ) : (
          <p className="text-sm text-red-500 mb-4">No experts found. Please add expert accounts first in the Experts tab or switch to open slot mode.</p>
        )
      ) : (
        <p className="text-sm text-slate-500 mb-4">This will create an open slot without an assigned expert. You can assign the expert later.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {assignExpert && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Expert</label>
            <select
              required={assignExpert}
              value={form.expertId}
              onChange={(e) => setForm({ ...form, expertId: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select Expert</option>
              {expertOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}{option.subtitle ? ` — ${option.subtitle}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={assignExpert ? '' : 'md:col-span-2'}>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-2">Select Times</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TIMES.map(time => {
            const isSelected = form.times.includes(time);
            
            // Check if time is in the past for today
            let isPast = false;
            if (form.date === new Date().toISOString().split('T')[0]) {
              const [hStr, mStr] = time.split(' ')[0].split(':');
              const mod = time.split(' ')[1];
              let h = parseInt(hStr);
              if (mod === 'PM' && h < 12) h += 12;
              if (mod === 'AM' && h === 12) h = 0;
              const slotTime = new Date();
              slotTime.setHours(h, parseInt(mStr), 0, 0);
              isPast = slotTime < new Date();
            }

            if (isPast) return null;

            return (
              <button
                type="button"
                key={time}
                onClick={() => toggleTime(time)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected 
                    ? 'bg-primary text-white border-primary shadow-sm scale-105' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {time}
              </button>
            );
          })}

        </div>
      </div>
      
      {msg && <p className={`mt-3 text-sm font-semibold ${msg.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
      
      <button
        type="submit"
        disabled={loading || (assignExpert && expertCount === 0)}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating...' : assignExpert ? 'Create Slots' : 'Create Open Slot'}
      </button>
    </form>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
// ─── Edit Appointment Modal ───────────────────────────────────────────────────
const EditAppointmentModal = ({ appointment, isOpen, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    patientName: '',
    patientAge: '',
    patientPhone: '',
    patientAddress: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setForm({
        patientName: appointment.patientName || '',
        patientAge: appointment.patientAge || '',
        patientPhone: appointment.patientPhone || '',
        patientAddress: appointment.patientAddress || '',
        purpose: appointment.purpose || '',
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentsAPI.update(appointment._id, form);
      onUpdated();
      onClose();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Edit Appointment</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Patient Name</label>
            <input required type="text" value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Age</label>
              <input required type="number" value={form.patientAge} onChange={e => setForm({...form, patientAge: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
              <input required type="text" value={form.patientPhone} onChange={e => setForm({...form, patientPhone: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
            <textarea required value={form.patientAddress} onChange={e => setForm({...form, patientAddress: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none min-h-[80px]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Purpose / Condition</label>
            <textarea value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:border-primary outline-none min-h-[80px]" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
  
// ─── User Detail Modal ──────────────────────────────────────────────────────
const UserDetailModal = ({ user, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [isOpen, user]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const roleKey = user.role === 'expert' ? 'expert' : 'patient';
      const res = await appointmentsAPI.getAll({ [roleKey]: user._id, limit: 10 });
      setHistory(res.data.appointments || []);
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !user) return null;
  const expert = user.profile;
  const isexpert = user.role === 'expert';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {isexpert ? <Activity className="text-primary" /> : <UserCheck className="text-green-500" />}
            {isexpert ? 'expert Profile Details' : 'Patient Account Details'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><X /></button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-48 shrink-0">
             <img 
               src={expert?.image?.startsWith('/uploads') ? `${API_BASE}${expert.image}` : expert?.image || user.photo || '/placeholder.jpg'} 
               alt={user.name}
               className="w-full h-48 rounded-2xl object-cover shadow-lg border-2 border-slate-100"
             />
             <div className="mt-4 flex flex-col items-center gap-2">
                <RoleBadge role={user.role} />
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Account: {user.isActive !== false ? 'Active' : 'Blocked'}
                </span>
             </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{user.name}</h1>
              <p className="text-primary font-bold uppercase tracking-widest text-sm">
                {isexpert && expert ? `${expert.role} · ${expert.degree}` : `Role: ${user.role}`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Contact Details</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={14} className="text-blue-500" /> {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-green-500" /> {user.phone}
                      </div>
                    )}
                  </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Internal Meta</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Shield size={14} className="text-purple-500" /> ID: <span className="font-mono text-[10px]">{user._id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock size={14} className="text-orange-500" /> 
                      {isexpert ? `Experience: ${expert?.experience || 'N/A'}` : `Joined: ${new Date(user.createdAt).toLocaleDateString()}`}
                    </div>
                  </div>
               </div>
            </div>

            {user.address && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Registered Address</p>
                <p className="text-slate-600 text-sm italic">{user.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment History Section */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Recent Appointments History
          </h3>
          
          {loadingHistory ? (
             <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((apt) => (
                <div key={apt._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors">
                  <div className="flex gap-4">
                    <div className="text-center bg-white px-3 py-2 rounded-xl border border-slate-200 min-w-[70px]">
                      <p className="text-[10px] font-bold text-primary uppercase">{apt.slotDate.split('-')[1]}</p>
                      <p className="text-lg font-black text-slate-800">{apt.slotDate.split('-')[0]}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{isexpert ? apt.patientName : `Dr. ${apt.expert?.name || 'Unknown'}`}</p>
                      <p className="text-slate-500 text-xs">{apt.slotTime}</p>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">No appointment records found for this user.</p>
            </div>
          )}
        </div>

        {isexpert && expert && (
          <div className="space-y-6 pt-8 mt-8 border-t border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Professional Bio</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{expert.bio}</p>
            </div>

            {expert.specializations?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Core Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {expert.specializations.map(s => (
                    <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wide">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-10">
          {isexpert && (
            <a 
              href={expert ? `/dashboard/admin/experts/${expert._id}/edit` : `/dashboard/admin/experts/new?userId=${user._id}`} 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Edit size={16} /> {expert ? 'Edit Profile' : 'Create Profile'}
            </a>
          )}
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};




const AdminDashboard = ({ initialTab = 'overview' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [experts, setExperts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('patient'); // Reverting back to patient as default for this section




  const [collaborations, setCollaborations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [prefilledCollabData, setPrefilledCollabData] = useState(null);

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);




  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const res = await usersAPI.getDashboardStats();
        setStats(res.data.stats);
      } else if (tab === 'appointments') {
        const res = await appointmentsAPI.getAll({ limit: 50 });
        setAppointments(res.data.appointments || []);
      } else if (tab === 'slots') {
        const [slotsRes, usersRes, expertsRes] = await Promise.all([
          slotsAPI.getAll(),
          usersAPI.getAll({ role: 'expert', limit: 100 }),
          expertsAPI.getAllAdmin(),
        ]);
        setSlots(slotsRes.data.slots || []);
        setExperts(normalizeExpertRecords(slotsRes.data.slots || [], expertsRes.data.experts || []));
      } else if (tab === 'experts') {
        // Fetch expert users plus all expert profiles so admin can see both linked and standalone profiles.
        const [usersRes, expertsRes] = await Promise.all([
          usersAPI.getAll({ role: 'expert', limit: 100 }),
          expertsAPI.getAllAdmin(),
        ]);

        const users = usersRes.data.users || [];
        const profiles = expertsRes.data.experts || [];

        const mergedExperts = users.map((user) => {
          const profile = profiles.find(
            (e) => e.linkedUserId?._id === user._id || e.linkedUserId === user._id
          );
          return { type: 'user', user, profile };
        });

        const standaloneProfiles = profiles
          .filter((profile) =>
            !users.some(
              (user) => profile.linkedUserId?._id === user._id || profile.linkedUserId === user._id
            )
          )
          .map((profile) => ({ type: 'profile', profile }));

        setExperts([...mergedExperts, ...standaloneProfiles]);

      } else if (tab === 'users') {
        const res = await usersAPI.getAll({ role: roleFilter, limit: 100 });
        setUsers(res.data.users || []);
      } else if (tab === 'blogs') {
        const res = await blogsAPI.getAllAdmin();
        setBlogs(res.data.blogs || []);
      } else if (tab === 'resources') {
        const res = await resourcesAPI.getAllAdmin({ limit: 100 });
        setResources(res.data.resources || []);
      } else if (tab === 'collaborations') {
        const [collabRes, campRes, regRes] = await Promise.all([
          collaborationsAPI.getAll(),
          campaignsAPI.getAll(),
          registrationsAPI.getAll()
        ]);
        setCollaborations(collabRes?.data?.collaborations || []);
        setCampaigns(campRes?.data?.campaigns || []);
        setRegistrations(regRes?.data?.registrations || []);
      } else if (tab === 'registrations') {
        const [regRes, collabRes, campRes] = await Promise.all([
          registrationsAPI.getAll(),
          collaborationsAPI.getAll(),
          campaignsAPI.getAll()
        ]);
        setRegistrations(regRes?.data?.registrations || []);
        setCollaborations(collabRes?.data?.collaborations || []);
        setCampaigns(campRes?.data?.campaigns || []);
      } else if (tab === 'enquiries') {
        const res = await enquiriesAPI.getAll();
        setEnquiries(res?.data?.enquiries || []);
      } else if (tab === 'messages') {
        const res = await contactAPI.getAll({ limit: 50 });
        setMessages(res?.data?.messages || []);
      } else if (tab === 'newsletter') {
        const res = await newsletterAPI.getAll();
        setSubscribers(res?.data?.subscribers || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(activeTab); }, [activeTab, roleFilter]);


  const handleRoleChange = async (userId, role) => {
    try {
      await usersAPI.updateRole(userId, role);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) { alert(err.message); }
  };

  const handleQuickListAsPartner = async (enq) => {
    if (!confirm(`Are you sure you want to approve and list "${enq.organizationName}" directly as an active partner on the collaborations page?`)) return;
    try {
      const newPartner = {
        name: enq.organizationName,
        type: enq.organizationType || 'Gym',
        description: enq.message || `Proudly partnering with ${enq.organizationName} to deliver clinical assessment support and injury screenings.`,
        address: '',
        city: enq.city || 'Chandigarh',
        state: 'Chandigarh',
        contactPerson: enq.contactPerson,
        contactNumber: enq.phone,
        email: enq.email || '',
        website: '',
        instagram: '',
        facebook: '',
        startDate: enq.preferredDate || new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Active',
        servicesOffered: enq.interestedServices || []
      };

      await collaborationsAPI.create(newPartner);
      alert('Partner listed successfully and published to the public collaborations page!');
      fetchData('enquiries');
    } catch (err) {
      console.error('Error listing partner from enquiry:', err);
      alert(`Partner could not be saved.\nPlease try again.`);
    }
  };


  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await usersAPI.setActive(userId, newStatus);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
    } catch (err) { alert(err.message); }
  };

  const handleViewUser = (u) => {
    setViewingUser(u);
    setIsDetailModalOpen(true);
  };


  const handleDeleteUser = async (userId) => {
    if (!confirm('PERMANENTLY delete this user account? This cannot be undone.')) return;
    try {
      await usersAPI.delete(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) { alert(err.message); }
  };


  const handleAppointmentStatus = async (id, status) => {
    let cancelReason = '';
    if (status === 'cancelled') {
        cancelReason = prompt('Reason for cancellation (optional):') || 'Cancelled by Admin';
    }
    try {
      await appointmentsAPI.updateStatus(id, { status, cancelReason });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) { alert(err.message); }
  };

  const handleEditClick = (apt) => {
    setEditingAppointment(apt);
    setIsEditModalOpen(true);
  };

  const handleDeleteAppointment = async (id) => {

    if (!confirm('Are you sure you want to PERMANENTLY delete this appointment? This cannot be undone.')) return;
    try {
        await appointmentsAPI.delete(id);
        setAppointments(prev => prev.filter(a => a._id !== id));
        alert('Appointment deleted successfully.');
    } catch (err) { alert(err.message); }
  };


  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteExpert = async (id) => {
    if (!confirm('Delete this expert profile?')) return;
    try {
      await expertsAPI.delete(id);
      setExperts(prev => prev.filter(e => e.profile?._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await blogsAPI.delete(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="w-full text-slate-100 space-y-6">
      <SEO title="Admin Dashboard — ZK Rehab Sphere" />

      {/* Header */}
      <div className="glass-panel border border-white/10 bg-slate-950/40 p-6 rounded-3xl flex items-center justify-between shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield size={20} className="text-cyan-400" /> Admin Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1">Welcome back, {user?.name}</p>
        </div>
        {user?.photo && <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border border-cyan-400/40" />}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-1.5 p-1.5 rounded-2xl border border-white/10 bg-slate-950/40 overflow-x-auto shadow-lg">
          {TABS.filter(({ id }) => {
            if (initialTab === 'collaborations') {
              return ['collaborations', 'registrations', 'enquiries'].includes(id);
            }
            return true;
          }).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === id ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              {Icon ? <Icon size={14} /> : <span>📋</span>} {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
        )}

        {/* ── Overview ── */}
        {activeTab === 'overview' && !loading && stats && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500" bg="bg-blue-50" />
              <StatCard icon={UserCheck} label="Patients" value={stats.totalPatients} color="bg-green-500" bg="bg-green-50" />
              <StatCard icon={Activity} label="experts" value={stats.totalexperts} color="bg-purple-500" bg="bg-purple-50" />
              <StatCard icon={Calendar} label="Appointments" value={stats.totalAppointments} color="bg-orange-500" bg="bg-orange-50" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Clock} label="Pending" value={stats.pendingAppointments} color="bg-yellow-500" bg="bg-yellow-50" />
              <StatCard icon={MessageSquare} label="Unread Messages" value={stats.unreadMessages} color="bg-red-500" bg="bg-red-50" />
              <StatCard icon={Mail} label="Subscribers" value={stats.totalSubscribers} color="bg-teal-500" bg="bg-teal-50" />
              <StatCard icon={Bell} label="New This Week" value={stats.recentAppointments} color="bg-indigo-500" bg="bg-indigo-50" />
            </div>
          </div>
        )}

        {/* ── Appointments ── */}
        {activeTab === 'appointments' && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">All Appointments ({appointments.length})</h2>
              <button onClick={() => fetchData('appointments')} className="text-slate-400 hover:text-primary"><RefreshCw size={16} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Patient', 'expert', 'Date & Time', 'Purpose', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{apt.patientName}</div>
                        <div className="text-slate-400 text-xs">{apt.patientPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{apt.expert?.name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800">{apt.slotDate}</div>
                        <div className="text-slate-400 text-xs">{apt.slotTime}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{apt.purpose || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                           <select
                            value={apt.status}
                            onChange={(e) => handleAppointmentStatus(apt._id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                          >
                            {['pending', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button 
                            onClick={() => handleEditClick(apt)}
                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Appointment"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(apt._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Appointment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>


                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <p className="text-center text-slate-400 py-10">No appointments yet.</p>}
            </div>
          </div>
        )}

        {/* ── Slots ── */}
        {activeTab === 'slots' && !loading && (
          <div>
            <AddSlotForm experts={experts} onCreated={() => fetchData('slots')} />
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">All Slots ({slots.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {['expert', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {slots.map((slot) => (
                      <tr key={slot._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">{slot.expert?.name || 'N/A'}</td>
                        <td className="px-4 py-3">{slot.date}</td>
                        <td className="px-4 py-3">{slot.time}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${slot.isBooked ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {!slot.isBooked && (
                            <button onClick={() => handleDeleteSlot(slot._id)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {slots.length === 0 && <p className="text-center text-slate-400 py-10">No slots created yet. Add some above.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Experts ── */}
        {activeTab === 'experts' && !loading && (
          <div>
            <div className="mb-4 flex justify-end">
              <a href="/dashboard/admin/experts/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus size={16} /> Add Expert
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experts.map((entry) => {
                const isProfileOnly = entry.type === 'profile';
                const user = entry.user;
                const expert = entry.profile;
                const displayName = user?.name || expert?.name || 'Unknown Expert';
                const displayRole = expert?.role || user?.role || 'Expert';
                const displayEmail = expert?.linkedUserId?.email || user?.email || expert?.email;
                const displayPhone = expert?.phone || user?.phone;
                const imageUrl = expert?.image?.startsWith('/uploads')
                  ? `${API_BASE}${expert.image}`
                  : expert?.image || user?.photo || '/placeholder.jpg';
                const profileId = expert?._id;
                const cardKey = isProfileOnly ? `profile-${profileId}` : `user-${user._id}`;

                return (
                  <div key={cardKey} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={imageUrl}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 text-sm">{displayName}</h3>
                          <RoleBadge role={user?.role || 'expert'} />
                        </div>
                        <p className="text-slate-500 text-[10px] truncate mb-1">{displayEmail} {displayPhone && `| ${displayPhone}`}</p>
                        <p className="text-primary font-bold text-[10px] uppercase tracking-wider">
                          {expert ? `${expert.role} · ${expert.degree}` : 'No Profile Set Up'}
                        </p>
                        {expert?.experience && (
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <Clock size={10} /> {expert.experience}
                          </div>
                        )}
                      </div>
                    </div>

                    {expert ? (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleToggleExpertActive(expert)}
                          className={`flex-1 text-center py-1 rounded-lg text-xs font-semibold transition-colors ${expert.isActive !== false && expert.isActive !== 'false' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {expert.isActive !== false && expert.isActive !== 'false' ? 'Visible' : 'Hidden'}
                        </button>
                        {user && (
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye size={14} />
                          </button>
                        )}

                        <a href={`/dashboard/admin/experts/${profileId}/edit`} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Profile">
                          <Edit size={14} />
                        </a>
                        <button onClick={() => handleDeleteExpert(profileId)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Profile">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <a
                          href={`/dashboard/admin/experts/new?userId=${user._id}&name=${encodeURIComponent(user.name)}`}
                          className="flex-1 text-center py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors"
                        >
                          Create Professional Profile
                        </a>
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {experts.length === 0 && <p className="text-center text-slate-400 py-10">No expert accounts found. Create a user with the 'expert' role first.</p>}

          </div>
        )}

        {/* ── Blogs ── */}
        {activeTab === 'blogs' && !loading && (
          <div>
            <div className="mb-4 flex justify-end">
              <a href="/dashboard/admin/blogs/new" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus size={16} /> Write Blog Post
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-slate-100">
                    {blog.coverImage && <img src={resolveImageUrl(blog.coverImage)} alt={blog.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        blog.status === 'published' ? 'bg-green-100 text-green-700' : 
                        blog.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {blog.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-4 h-10">{blog.title}</h3>
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <Eye size={14} />
                      </a>
                      <div className="flex-1" />
                      <a href={`/dashboard/admin/blogs/${blog._id}/edit`} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={14} />
                      </a>
                      <button onClick={() => handleDeleteBlog(blog._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {blogs.length === 0 && <p className="text-center text-slate-400 py-10">No blog posts yet. Start writing your first article!</p>}
          </div>
        )}

        {/* ── Users (Patients) ── */}
        {activeTab === 'users' && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Account Management ({users.length})</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Filter:</span>
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
                >
                  <option value="patient">Patients Only</option>
                  <option value="expert">experts Only</option>
                  <option value="admin">Admins Only</option>
                  <option value="">All Users</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={u.photo || '/placeholder.jpg'} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          <span className="font-medium text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary"
                        >
                          {['patient', 'expert', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive !== false ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewUser(u)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="View Account Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleToggleActive(u._id, u.isActive !== false)}

                            className={`p-1.5 rounded-lg transition-colors ${u.isActive !== false ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                            title={u.isActive !== false ? 'Block User' : 'Unblock User'}
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center text-slate-400 py-10">No users found with this filter.</p>}
            </div>
          </div>
        )}        {/* ── Collaborations Tab ── */}
        {activeTab === 'collaborations' && !loading && (
          <ErrorBoundary>
            <CollaborationsManager 
              collaborations={collaborations} 
              campaigns={campaigns}
              registrations={registrations}
              onRefresh={() => fetchData('collaborations')} 
              prefilledCollabData={prefilledCollabData}
              clearPrefilledCollabData={() => setPrefilledCollabData(null)}
            />
          </ErrorBoundary>
        )}

        {/* ── Registrations Tab ── */}
        {activeTab === 'registrations' && !loading && (
          <RegistrationsManager 
            registrations={registrations} 
            collaborations={collaborations}
            campaigns={campaigns}
            onRefresh={() => fetchData('registrations')} 
          />
        )}

        {/* ── Enquiries Tab ── */}
        {activeTab === 'enquiries' && !loading && (
          <EnquiriesManager 
            enquiries={enquiries} 
            onRefresh={() => fetchData('enquiries')} 
            onAddAsPartner={(enq) => {
              setPrefilledCollabData(enq);
              setActiveTab('collaborations');
            }}
            onQuickList={handleQuickListAsPartner}
          />
        )}


        {/* ── Messages ── */}
        {activeTab === 'messages' && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Contact Messages ({messages.length})</h2>
              <span className="text-xs text-slate-500">{messages.filter(m => !m.isRead).length} unread</span>
            </div>
            {messages.map((msg) => (
              <div key={msg._id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${msg.isRead ? 'border-slate-200 opacity-75' : 'border-blue-200 ring-1 ring-blue-100'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-800">{msg.name}</span>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-slate-500 text-xs mb-1">{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                    <p className="text-slate-700 text-sm">{msg.message}</p>
                    <p className="text-slate-400 text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!msg.isRead && (
                      <button onClick={() => handleMarkRead(msg._id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Mark as read">
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && <div className="text-center text-slate-400 py-12 bg-white rounded-2xl border border-slate-200">No messages yet.</div>}
          </div>
        )}

        {/* ── Newsletter ── */}
        {activeTab === 'newsletter' && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Newsletter Subscribers ({subscribers.length})</h2>
              <span className="text-sm text-green-600 font-semibold">{subscribers.filter(s => s.isActive).length} active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Email', 'Status', 'Subscribed', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-700">{sub.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {sub.isActive ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteSubscriber(sub._id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && <p className="text-center text-slate-400 py-10">No subscribers yet.</p>}
            </div>
          </div>
        )}
      </div>

      <EditAppointmentModal 
        isOpen={isEditModalOpen} 
        appointment={editingAppointment} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdated={() => fetchData('appointments')} 
      />
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={viewingUser}
      />

    </div>
  );
};


// ─── COLLABORATIONS MANAGER ───────────────────────────────────────────────────
const CollaborationsManager = ({ collaborations = [], campaigns = [], registrations = [], onRefresh, prefilledCollabData, clearPrefilledCollabData }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollab, setEditingCollab] = useState(null);
  const [showEventFormCollabId, setShowEventFormCollabId] = useState(null);
  const [qrCampaign, setQrCampaign] = useState(null);
  const [qrCollab, setQrCollab] = useState(null);
  
  // Custom States for Redesign
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showActionsDropdownId, setShowActionsDropdownId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // (Rest of the component remains the same)


  // Collab Form State
  const [form, setForm] = useState({
    name: '',
    type: 'Gym',
    description: '',
    address: '',
    city: 'Chandigarh',
    state: 'Chandigarh',
    contactPerson: '',
    contactNumber: '',
    email: '',
    website: '',
    instagram: '',
    facebook: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    servicesOffered: []
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: 'Free Physiotherapy Assessment Camp',
    description: 'Get free posture, spinal biomechanics and injury screening with our senior clinical team.',
    venue: '',
    date: '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    registrationOpen: true,
    participantLimit: 100,
    status: 'Active'
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);

  useEffect(() => {
    if (editingCollab) {
      setForm({
        name: editingCollab.name || '',
        type: editingCollab.type || 'Gym',
        description: editingCollab.description || '',
        address: editingCollab.address || '',
        city: editingCollab.city || 'Chandigarh',
        state: editingCollab.state || 'Chandigarh',
        contactPerson: editingCollab.contactPerson || '',
        contactNumber: editingCollab.contactNumber || '',
        email: editingCollab.email || '',
        website: editingCollab.website || '',
        instagram: editingCollab.instagram || '',
        facebook: editingCollab.facebook || '',
        startDate: editingCollab.startDate?.split('T')[0] || '',
        endDate: editingCollab.endDate?.split('T')[0] || '',
        status: editingCollab.status || 'Active',
        servicesOffered: editingCollab.servicesOffered || []
      });
      setExistingGallery(editingCollab.gallery || []);
      setLogoFile(null);
      setCoverFile(null);
      setGalleryFiles([]);
      setShowAddForm(true);
    } else {
      setForm({
        name: '',
        type: 'Gym',
        description: '',
        address: '',
        city: 'Chandigarh',
        state: 'Chandigarh',
        contactPerson: '',
        contactNumber: '',
        email: '',
        website: '',
        instagram: '',
        facebook: '',
        startDate: '',
        endDate: '',
        status: 'Active',
        servicesOffered: []
      });
      setExistingGallery([]);
      setLogoFile(null);
      setCoverFile(null);
      setGalleryFiles([]);
    }
  }, [editingCollab]);

  useEffect(() => {
    if (prefilledCollabData) {
      setForm({
        name: prefilledCollabData.organizationName || '',
        type: prefilledCollabData.organizationType || 'Gym',
        description: prefilledCollabData.message || '',
        address: '',
        city: prefilledCollabData.city || 'Chandigarh',
        state: 'Chandigarh',
        contactPerson: prefilledCollabData.contactPerson || '',
        contactNumber: prefilledCollabData.phone || '',
        email: prefilledCollabData.email || '',
        website: '',
        instagram: '',
        facebook: '',
        startDate: prefilledCollabData.preferredDate || '',
        endDate: '',
        status: 'Active',
        servicesOffered: prefilledCollabData.interestedServices || []
      });
      setLogoFile(null);
      setCoverFile(null);
      setGalleryFiles([]);
      setShowAddForm(true);
      clearPrefilledCollabData();
    }
  }, [prefilledCollabData]);

  const handleServiceToggle = (svc) => {
    setForm(prev => {
      const services = prev.servicesOffered.includes(svc)
        ? prev.servicesOffered.filter(s => s !== svc)
        : [...prev.servicesOffered, svc];
      return { ...prev, servicesOffered: services };
    });
  };

  const handleCollabSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'servicesOffered') {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key] !== undefined ? form[key] : '');
        }
      });
      
      if (logoFile) formData.append('logo', logoFile);
      if (coverFile) formData.append('coverImage', coverFile);
      
      // Append gallery files
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          formData.append('gallery', file);
        });
      }
      
      // Preserve or pass existing gallery links
      if (editingCollab) {
        formData.append('existingGallery', JSON.stringify(existingGallery));
      }

      if (editingCollab) {
        await collaborationsAPI.update(editingCollab._id, formData);
      } else {
        await collaborationsAPI.create(formData);
      }

      setEditingCollab(null);
      setShowAddForm(false);
      await onRefresh();
    } catch (err) {
      console.error("Database write error saving collaboration partner:", err);
      alert(`Partner could not be saved.\nPlease try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollab = async (id) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this collaboration? Historical camp data may be affected.')) return;
    try {
      await collaborationsAPI.delete(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleArchiveCollab = async (collab) => {
    if (!confirm(`Are you sure you want to archive "${collab.name}"? It will be set to Inactive status.`)) return;
    try {
      const formData = new FormData();
      formData.append('status', 'Inactive');
      await collaborationsAPI.update(collab._id, formData);
      onRefresh();
    } catch (err) {
      alert(`Archive failed: ${err.message}`);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSubmittingEvent(true);
    try {
      await campaignsAPI.create({
        ...eventForm,
        collaborationId: showEventFormCollabId,
        participantLimit: Number(eventForm.participantLimit)
      });
      setShowEventFormCollabId(null);
      setEventForm({
        title: 'Free Physiotherapy Assessment Camp',
        description: 'Get free posture, spinal biomechanics and injury screening with our senior clinical team.',
        venue: '',
        date: '',
        startTime: '10:00 AM',
        endTime: '04:00 PM',
        registrationOpen: true,
        participantLimit: 100,
        status: 'Active'
      });
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleToggleEventReg = async (camp) => {
    try {
      await campaignsAPI.update(camp._id, {
        registrationOpen: !camp.registrationOpen
      });
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Archive this assessment camp?')) return;
    try {
      await campaignsAPI.delete(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Close actions dropdown when clicking elsewhere
  useEffect(() => {
    const handleOutsideClick = () => setShowActionsDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gym & Partner Collaborations ({collaborations.length})</h2>
        <button
          onClick={() => {
            setEditingCollab(null);
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2"
        >
          {showAddForm ? 'Cancel Form' : <><Plus size={16} /> Add Partner</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCollabSubmit} className="glass-panel border border-white/10 bg-slate-950/60 p-6 rounded-3xl shadow-xl space-y-6 text-white animate-fadeIn">
          <h3 className="text-base font-bold text-white">{editingCollab ? 'Edit Collaboration Partner' : 'Create Collaboration Partner'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Organization Name *</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Organization Type *</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all">
                {['Gym', 'Sports Academy', 'Fitness Center', 'Running Club', 'Sports Club', 'School', 'College', 'Corporate', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Logo Upload DragZone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Partner Logo</label>
              <div className="relative border border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-4 bg-slate-900/60 transition-all flex flex-col items-center justify-center min-h-[120px] text-center cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setLogoFile(e.target.files?.[0] || null)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                {logoFile ? (
                  <div className="space-y-2">
                    <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="w-12 h-12 object-cover rounded-xl mx-auto border border-white/10" />
                    <p className="text-[10px] text-green-400 font-bold">✓ Selected: {logoFile.name.substring(0, 15)}...</p>
                  </div>
                ) : editingCollab?.logo ? (
                  <div className="space-y-2">
                    <img src={editingCollab.logo} alt="Current Logo" className="w-12 h-12 object-cover rounded-xl mx-auto border border-white/10" />
                    <p className="text-[10px] text-cyan-400 font-bold">Show Stored Logo (Click to Replace)</p>
                  </div>
                ) : (
                  <>
                    <span className="text-xl mb-1 text-slate-400 group-hover:scale-110 transition-transform">📷</span>
                    <span className="text-[10px] font-bold text-slate-300">Upload Logo Image</span>
                    <span className="text-[9px] text-slate-500">Drag & drop or browse (JPG, PNG, WebP)</span>
                  </>
                )}
              </div>
            </div>

            {/* Custom Cover Image DragZone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Image</label>
              <div className="relative border border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-4 bg-slate-900/60 transition-all flex flex-col items-center justify-center min-h-[120px] text-center cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setCoverFile(e.target.files?.[0] || null)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                {coverFile ? (
                  <div className="space-y-2">
                    <img src={URL.createObjectURL(coverFile)} alt="Cover Preview" className="w-20 h-10 object-cover rounded-lg mx-auto border border-white/10" />
                    <p className="text-[10px] text-green-400 font-bold">✓ Selected: {coverFile.name.substring(0, 15)}...</p>
                  </div>
                ) : editingCollab?.coverImage ? (
                  <div className="space-y-2">
                    <img src={editingCollab.coverImage} alt="Current Cover" className="w-20 h-10 object-cover rounded-lg mx-auto border border-white/10" />
                    <p className="text-[10px] text-cyan-400 font-bold">Show Stored Cover (Click to Replace)</p>
                  </div>
                ) : (
                  <>
                    <span className="text-xl mb-1 text-slate-400 group-hover:scale-110 transition-transform">📷</span>
                    <span className="text-[10px] font-bold text-slate-300">Upload Cover Photo</span>
                    <span className="text-[9px] text-slate-500">Drag & drop or browse (JPG, PNG, WebP)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Multiple Gallery Images Upload DragZone */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Partner Gallery Photos</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative border border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-4 bg-slate-900/60 transition-all flex flex-col items-center justify-center min-h-[100px] text-center cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setGalleryFiles(prev => [...prev, ...files]);
                  }} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <span className="text-lg mb-1 text-slate-400 group-hover:scale-110 transition-transform">🖼️</span>
                <span className="text-[10px] font-bold text-slate-300">Add Gallery Images</span>
                <span className="text-[8px] text-slate-500">Upload multiple files</span>
              </div>

              {/* Previews and Existing Gallery items */}
              <div className="md:col-span-2 flex flex-wrap gap-3 p-3 bg-slate-900/40 border border-white/5 rounded-2xl min-h-[100px] items-center">
                {/* Existing Stored Images */}
                {existingGallery.map((url, i) => (
                  <div key={`exist-${i}`} className="relative w-16 h-12 rounded-lg border border-white/10 overflow-hidden group">
                    <img src={url} alt="Stored Gallery" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setExistingGallery(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-red-650/90 text-white font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {/* New Files Chosen */}
                {galleryFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative w-16 h-12 rounded-lg border border-green-500/20 overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="New Gallery Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-slate-950/90 text-white font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                {existingGallery.length === 0 && galleryFiles.length === 0 && (
                  <p className="text-[10px] text-slate-500 mx-auto">No gallery images added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Address</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">City</label>
              <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">State</label>
              <input type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Person</label>
              <input type="text" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Number</label>
              <input type="tel" value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Website</label>
              <input type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Instagram Link</label>
              <input type="text" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Facebook Link</label>
              <input type="text" value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all">
                {['Active', 'Upcoming', 'Completed', 'Inactive'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Services Offered</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Free Physiotherapy Assessment', 'Sports Injury Screening', 'Movement Assessment', 'Posture Assessment', 'Injury Prevention', 'Sports Performance', 'Physiotherapy Consultation', 'Recovery Program', 'Workshop', 'Awareness Camp', 'Other'].map(svc => {
                const checked = form.servicesOffered.includes(svc);
                return (
                  <button
                    type="button"
                    key={svc}
                    onClick={() => handleServiceToggle(svc)}
                    className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold transition-all ${
                      checked
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {svc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => { setShowAddForm(false); setEditingCollab(null); }} className="px-5 py-2.5 text-slate-300 hover:bg-white/5 rounded-xl text-xs font-semibold transition-all">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Collaboration'}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collaborations.filter(Boolean).map(collab => {
          const collabCamps = (campaigns || []).filter(c => c.collaborationId === collab._id);
          const activeCamp = collabCamps.find(c => c.registrationOpen);
          const campRegistrations = activeCamp 
            ? (registrations || []).filter(r => r.eventId === activeCamp._id)
            : [];
            
          // Get distinct status classes
          const statusColors = {
            Active: 'bg-green-500/20 text-green-400 border-green-400/30',
            Upcoming: 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30',
            Completed: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
            Inactive: 'bg-slate-500/20 text-slate-400 border-slate-400/30'
          };
          
          return (
            <motion.div 
              key={collab._id} 
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPartner(collab)}
              className="group relative overflow-hidden glass-panel border border-white/10 bg-slate-950/40 rounded-3xl flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/5 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer"
            >
              {/* Premium Top Hover highlight line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 to-teal-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

              <div>
                {/* Cover Image Section */}
                <div className="h-44 relative bg-slate-900 overflow-hidden w-full select-none">
                  {collab.coverImage ? (
                    <motion.img 
                      src={resolveImageUrl(collab.coverImage)} 
                      alt={collab.name} 
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600 font-extrabold text-[10px] uppercase tracking-widest">
                      ZK RehabSphere Partner
                    </div>
                  )}
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/10 z-10" />

                  {/* Status Overlay Pill */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border ${statusColors[collab.status] || 'bg-slate-500/20 text-slate-400'} z-20`}>
                    ● {typeof collab.status === 'string' ? collab.status : 'Active'}
                  </span>

                  {/* Partner Logo overlapping cover image */}
                  <div className="absolute -bottom-6 left-6 w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:border-cyan-400/60 transition-colors z-20 overflow-hidden">
                    {collab.logo ? (
                      <img src={resolveImageUrl(collab.logo)} alt={collab.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={22} className="text-cyan-400" />
                    )}
                  </div>
                </div>

                <div className="p-6 pt-10 space-y-4">
                  {/* Category and Title */}
                  <div>
                    <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                      {typeof collab.type === 'string' ? collab.type : 'Partner'}
                    </span>
                    <h3 className="font-extrabold text-white text-base leading-tight mt-0.5 group-hover:text-cyan-300 transition-colors">
                      {typeof collab.name === 'string' ? collab.name : 'Unnamed Partner'}
                    </h3>
                  </div>

                  {/* Description snippet */}
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 h-8">
                    {typeof collab.description === 'string' ? collab.description : 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-300">
                    <MapPin size={12} className="text-rose-400 shrink-0" />
                    <span className="truncate">
                      {typeof collab.address === 'string' ? `${collab.address}, ` : ''}
                      {typeof collab.city === 'string' ? collab.city : ''}
                    </span>
                  </div>

                  {/* Services offered chips */}
                  {collab.servicesOffered && Array.isArray(collab.servicesOffered) && collab.servicesOffered.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex flex-wrap gap-1">
                        {collab.servicesOffered.slice(0, 2).map((svc) => (
                          <span key={typeof svc === 'string' ? svc : JSON.stringify(svc)} className="text-[9px] font-bold bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-lg whitespace-nowrap">
                            {typeof svc === 'string' ? svc : JSON.stringify(svc)}
                          </span>
                        ))}
                        {collab.servicesOffered.length > 2 && (
                          <span className="text-[9px] font-black text-cyan-400 px-1 py-0.5">
                            +{collab.servicesOffered.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Camp Section inside card */}
                  <div className="pt-4 border-t border-white/10">
                    {activeCamp ? (
                      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-3 space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-cyan-400 uppercase">
                          <span>Active Camp</span>
                          <span>{campRegistrations.length} Signed Up</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{activeCamp.title}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-350">
                          <Calendar size={11} className="text-cyan-400" />
                          <span>{typeof activeCamp.date === 'string' ? activeCamp.date : (activeCamp.date?.seconds ? new Date(activeCamp.date.seconds * 1000).toLocaleDateString('en-GB') : '')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-slate-900/40 border border-white/5 rounded-2xl p-3 text-[10px] text-slate-400">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-300">No active camps</p>
                          <p className="text-[9px] text-slate-500">Configure assessment camp</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEventFormCollabId(collab._id);
                          }}
                          className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-[9px]"
                        >
                          + Create
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar on Hover */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-900/30">
                <span className="text-[10px] text-slate-400 font-bold group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  View Partnership Details <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Actions Dot Menu */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowActionsDropdownId(showActionsDropdownId === collab._id ? null : collab._id);
                    }}
                    className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg transition-colors"
                  >
                    <MoreVertical size={14} />
                  </button>

                  <AnimatePresence>
                    {showActionsDropdownId === collab._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 bottom-full mb-2 w-44 bg-slate-950 border border-white/10 rounded-2xl shadow-xl p-1.5 z-30"
                      >
                        <button
                          onClick={() => {
                            setEditingCollab(collab);
                            setShowActionsDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Edit size={12} className="text-blue-400" /> Edit Partner
                        </button>
                        <button
                          onClick={() => {
                            setQrCollab(collab);
                            setShowActionsDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <QrCode size={12} className="text-cyan-400" /> Generate QR
                        </button>
                        <button
                          onClick={() => {
                            setShowEventFormCollabId(collab._id);
                            setShowActionsDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Plus size={12} className="text-emerald-400" /> Add Camp Event
                        </button>
                        <button
                          onClick={() => {
                            handleArchiveCollab(collab);
                            setShowActionsDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Archive size={12} className="text-yellow-400" /> Archive Partner
                        </button>
                        <hr className="border-white/5 my-1" />
                        <button
                          onClick={() => {
                            handleDeleteCollab(collab._id);
                            setShowActionsDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={12} /> Delete Partner
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
        {collaborations.length === 0 && (
          <div className="text-center py-16 bg-slate-900/20 rounded-3xl border border-dashed border-white/10 col-span-2 lg:col-span-3 space-y-3">
            <h3 className="font-bold text-white text-base uppercase tracking-wide">Building Stronger Communities</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">ZK RehabSphere is partnering with gyms, sports academies and active communities to deliver clinical assessment support.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Add Your First Partner
            </button>
          </div>
        )}
      </div>

      {/* Camp form model */}
      {showEventFormCollabId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowEventFormCollabId(null)} />
          <form onSubmit={handleEventSubmit} className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Add Assessment Event / Camp</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Camp Title</label>
                <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input required type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Venue Name</label>
                  <input type="text" placeholder="Same as partner" value={eventForm.venue} onChange={e => setEventForm({...eventForm, venue: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Start Time</label>
                  <input type="text" value={eventForm.startTime} onChange={e => setEventForm({...eventForm, startTime: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Time</label>
                  <input type="text" value={eventForm.endTime} onChange={e => setEventForm({...eventForm, endTime: e.target.value})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Participant Limit</label>
                <input type="number" value={eventForm.participantLimit} onChange={e => setEventForm({...eventForm, participantLimit: Number(e.target.value)})} className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button type="button" onClick={() => setShowEventFormCollabId(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold">Cancel</button>
              <button type="submit" disabled={submittingEvent} className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl shadow-md">
                {submittingEvent ? 'Creating...' : 'Save Camp'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partner Details Modal */}
      {selectedPartner && (
        <PartnerDetailsModal 
          collab={selectedPartner}
          campaigns={campaigns}
          registrations={registrations}
          onClose={() => setSelectedPartner(null)}
          onEdit={() => {
            setEditingCollab(selectedPartner);
            setSelectedPartner(null);
          }}
          onArchive={() => {
            handleArchiveCollab(selectedPartner);
            setSelectedPartner(null);
          }}
          setLightboxImage={setLightboxImage}
        />
      )}

      {/* Lightbox for Gallery */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <button 
            onClick={() => setLightboxImage(null)} 
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white z-50 transition-colors"
          >
            <X size={24} />
          </button>
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightboxImage} 
            alt="Gallery Lightbox" 
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/5" 
          />
        </div>
      )}

      {qrCampaign && (
        <QrModal 
          camp={qrCampaign.camp} 
          collab={qrCampaign.collab} 
          onClose={() => setQrCampaign(null)} 
        />
      )}

      {qrCollab && (
        <QrModal 
          collab={qrCollab} 
          onClose={() => setQrCollab(null)} 
        />
      )}
    </div>
  );
};


// ─── PARTNER DETAILS MODAL ──────────────────────────────────────────────────
const PartnerDetailsModal = ({ collab, campaigns = [], registrations = [], onClose, onEdit, onArchive, setLightboxImage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const partnerCamps = (campaigns || []).filter(c => c.collaborationId === collab._id);
  const partnerRegs = (registrations || []).filter(r => r.collaborationId === collab._id);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-100"
      >
        {/* Cover Photo */}
        <div className="h-56 relative bg-slate-900 overflow-hidden shrink-0">
          {collab.coverImage ? (
            <img src={resolveImageUrl(collab.coverImage)} alt={collab.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 font-extrabold text-xs uppercase tracking-widest bg-slate-900">
              ZK RehabSphere Partner
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-950/60 border border-white/10 rounded-full text-slate-300 hover:text-white transition-colors">
            <X size={18} />
          </button>

          {/* Logo Overlapping */}
          <div className="absolute -bottom-8 left-8 w-20 h-20 bg-slate-950 border-2 border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
            {collab.logo ? (
              <img src={resolveImageUrl(collab.logo)} alt={collab.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 size={32} className="text-cyan-400" />
            )}
          </div>
        </div>

        {/* Modal Info Content */}
        <div className="p-8 pt-12 overflow-y-auto space-y-6 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">{typeof collab.type === 'string' ? collab.type : 'Partner'}</span>
              <h2 className="text-2xl font-black mt-1 leading-snug">{typeof collab.name === 'string' ? collab.name : 'Unnamed Partner'}</h2>
              <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-rose-400" /> 
                {typeof collab.address === 'string' ? `${collab.address}, ` : ''}
                {typeof collab.city === 'string' ? collab.city : ''}
                {collab.city && collab.state ? ', ' : ''}
                {typeof collab.state === 'string' ? collab.state : ''}
              </p>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
              collab.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
              collab.status === 'Upcoming' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30' : 'bg-slate-500/20 text-slate-400'
            }`}>
              ● {typeof collab.status === 'string' ? collab.status : 'Active'}
            </span>
          </div>

          {/* Modal Tab select */}
          <div className="flex gap-2 border-b border-white/10 pb-2">
            {['overview', 'camps', 'gallery'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-xs font-black uppercase tracking-wider pb-1 px-1 transition-all ${
                  activeTab === t ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">About Partnership</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{typeof collab.description === 'string' ? collab.description : 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl space-y-2">
                  <h5 className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Contact Information</h5>
                  <div className="text-xs text-slate-300 space-y-1.5">
                    <p>🧑 <strong>Person:</strong> {typeof collab.contactPerson === 'string' ? collab.contactPerson : '—'}</p>
                    <p>📞 <strong>Phone:</strong> {typeof collab.contactNumber === 'string' ? collab.contactNumber : '—'}</p>
                    <p>✉️ <strong>Email:</strong> {typeof collab.email === 'string' ? collab.email : '—'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl space-y-2">
                  <h5 className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Partnership Info</h5>
                  <div className="text-xs text-slate-300 space-y-1.5">
                    <p>📅 <strong>Start Date:</strong> {typeof collab.startDate === 'string' ? collab.startDate : (collab.startDate?.seconds ? new Date(collab.startDate.seconds * 1000).toLocaleDateString('en-GB') : '—')}</p>
                    <p>📅 <strong>End Date:</strong> {typeof collab.endDate === 'string' ? collab.endDate : (collab.endDate?.seconds ? new Date(collab.endDate.seconds * 1000).toLocaleDateString('en-GB') : '—')}</p>
                    <p>👥 <strong>Total Camp Signups:</strong> {partnerRegs.length} Registered</p>
                  </div>
                </div>
              </div>

              {collab.servicesOffered && Array.isArray(collab.servicesOffered) && collab.servicesOffered.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Offered Services</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {collab.servicesOffered.map((svc) => (
                      <span key={typeof svc === 'string' ? svc : JSON.stringify(svc)} className="text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-xl">
                        {typeof svc === 'string' ? svc : JSON.stringify(svc)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social / Links */}
              {(collab.website || collab.instagram || collab.facebook) && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">External Links</h4>
                  <div className="flex gap-4">
                    {collab.website && (
                      <a href={collab.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                        <Globe size={13} /> Website <ExternalLink size={10} />
                      </a>
                    )}
                    {collab.instagram && (
                      <a href={collab.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                        📸 Instagram <ExternalLink size={10} />
                      </a>
                    )}
                    {collab.facebook && (
                      <a href={collab.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                        👥 Facebook <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'camps' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Diagnostic Campaigns</h4>
              {partnerCamps.map((camp) => {
                const count = (registrations || []).filter(r => r.eventId === camp._id).length;
                return (
                  <div key={camp._id} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white">{camp.title}</div>
                      <div className="text-[10px] text-slate-400">{camp.date} · {camp.startTime} - {camp.endTime}</div>
                      <div className="text-[9px] text-cyan-400 font-bold">👥 {count} Signups Registered</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      camp.registrationOpen ? 'bg-green-500/20 text-green-400 border border-green-400/20' : 'bg-rose-500/20 text-rose-400 border border-rose-400/20'
                    }`}>
                      {camp.registrationOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                );
              })}
              {partnerCamps.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No assessment camps configured for this partner.</p>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Partner Photos</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {collab.gallery && Array.isArray(collab.gallery) && collab.gallery.map((url, i) => (
                  <div 
                    key={i} 
                    onClick={() => setLightboxImage(resolveImageUrl(url))}
                    className="aspect-video bg-slate-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-cyan-400/50 hover:opacity-90 transition-all shadow-sm"
                  >
                    <img src={resolveImageUrl(url)} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {(!collab.gallery || !Array.isArray(collab.gallery) || collab.gallery.length === 0) && (
                <p className="text-xs text-slate-500 text-center py-6">No gallery photos uploaded yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between bg-slate-900/40 shrink-0">
          <div className="flex gap-2">
            <button onClick={onEdit} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all">
              Edit Partner
            </button>
            <button onClick={onArchive} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-yellow-400 rounded-xl text-xs font-bold transition-all">
              Archive Partner
            </button>
          </div>
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-bold transition-all border border-white/5">
            Close Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};



// ─── QR CARD MODAL ────────────────────────────────────────────────────────────
const QrModal = ({ camp, collab, onClose }) => {
  const [copied, setCopied] = useState(false);
  const registrationLink = camp 
    ? `${window.location.origin}/#assessment?campaign=${camp._id}`
    : `${window.location.origin}/#assessment?venue=${collab._id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(registrationLink)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const partnerNameStr = typeof collab.name === 'string' ? collab.name : 'partner';
      link.download = `QR-${partnerNameStr.replace(/\s+/g, '-').toLowerCase()}${camp ? `-${camp._id}` : ''}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      alert('Failed to download QR code.');
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ZK RehabSphere</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 40px; color: #1e293b; }
            .card { border: 3px double #0d9488; border-radius: 24px; padding: 30px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            h1 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; }
            h2 { font-size: 13px; font-weight: 600; color: #0d9488; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .qr-container { margin: 25px 0; }
            .qr-image { width: 220px; height: 220px; }
            .footer-text { font-size: 14px; font-weight: 700; color: #0f172a; margin: 20px 0 5px 0; }
            .url-text { font-size: 11px; color: #64748b; font-family: monospace; word-break: break-all; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="card">
            <h1>${camp ? 'FREE ASSESSMENT CAMP' : 'PARTNER REGISTRATION'}</h1>
            <h2>${collab.name.toUpperCase()}</h2>
            <div class="qr-container">
              <img class="qr-image" src="${qrCodeUrl}" />
            </div>
            <div class="footer-text">Scan to Register</div>
            <div class="url-text">${registrationLink}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] text-center space-y-6">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">{camp ? 'Campaign' : 'Partner'} QR Code</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={18} /></button>
        </div>

        {/* Printable Card Area */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center">
          <h4 className="font-bold text-slate-900 text-base uppercase tracking-tight">{camp ? 'FREE ASSESSMENT CAMP' : 'PARTNER REGISTRATION'}</h4>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block mt-0.5">{collab.name}</span>
          {camp && <span className="text-[9px] text-slate-500 block mt-0.5">Camp Date: {camp.date}</span>}

          <div className="my-4 bg-white p-3 rounded-xl border border-slate-200">
            <img src={qrCodeUrl} alt="Assessment QR Code" className="w-48 h-48" />
          </div>

          <p className="text-slate-800 text-xs font-bold uppercase tracking-wider">Scan to Register</p>
          <p className="text-[9px] text-slate-400 font-mono select-all truncate max-w-xs mt-1">{registrationLink}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleDownloadQR}
            className="py-2.5 border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Download size={15} /> Download
          </button>
          <button
            onClick={handlePrintQR}
            className="py-2.5 border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Printer size={15} /> Print QR
          </button>
          <button
            onClick={handleCopyLink}
            className="py-2.5 border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Copy size={15} /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};


// ─── REGISTRATIONS MANAGER ────────────────────────────────────────────────────
const RegistrationsManager = ({ registrations, collaborations, campaigns, onRefresh }) => {
  const [selectedReg, setSelectedReg] = useState(null);

  // States for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVenue, setFilterVenue] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterActivity, setFilterActivity] = useState('');
  const [filterPain, setFilterPain] = useState('all');
  const [filterArea, setFilterArea] = useState('');

  // 1. Calculate statistics
  const totalCount = registrations.length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayCount = registrations.filter(r => r.createdAt?.startsWith(today)).length;
  
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekCount = registrations.filter(r => new Date(r.createdAt).getTime() >= weekAgo).length;

  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const monthCount = registrations.filter(r => new Date(r.createdAt).getTime() >= monthAgo).length;

  const activeCamps = campaigns.filter(c => c.registrationOpen).length;

  // 2. Filter records
  const filteredRegs = registrations.filter(reg => {
    // Search Name or Mobile
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = reg.fullName?.toLowerCase().includes(q);
      const matchMobile = reg.mobile?.includes(q);
      const matchId = reg.registrationId?.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchId) return false;
    }
    // Venue Filter
    if (filterVenue && reg.collaborationId !== filterVenue) return false;
    // Campaign Filter
    if (filterCampaign && reg.eventId !== filterCampaign) return false;
    // Gender Filter
    if (filterGender && reg.gender !== filterGender) return false;
    // Activity Filter
    if (filterActivity && reg.primaryActivity !== filterActivity) return false;
    // Pain Filter
    if (filterPain !== 'all') {
      const wantPain = filterPain === 'yes';
      if (reg.experiencingPain !== wantPain) return false;
    }
    // Assessment Area Filter
    if (filterArea && (!reg.assessmentAreas || !reg.assessmentAreas.includes(filterArea))) return false;

    return true;
  });

  // Handle CSV Export
  const handleCSVExport = () => {
    if (filteredRegs.length === 0) {
      alert('No registrations match the selected filters to export.');
      return;
    }

    const headers = [
      'Registration ID', 'Full Name', 'Age', 'Gender', 'Mobile', 'Email', 
      'Venue Name', 'Campaign Name', 'Activity', 'Experience', 'Assessment Areas', 
      'Experiencing Pain', 'Pain Area', 'Pain Score', 'Previous Injury', 
      'Medical Info', 'Status', 'Date Registered'
    ];

    const rows = filteredRegs.map(reg => {
      const collab = collaborations.find(c => c._id === reg.collaborationId);
      const camp = campaigns.find(c => c._id === reg.eventId);

      return [
        reg.registrationId || '',
        reg.fullName || '',
        reg.age || '',
        reg.gender || '',
        reg.mobile || '',
        reg.email || '',
        collab ? collab.name : 'Other',
        camp ? camp.title : 'Free Camp',
        reg.primaryActivity || '',
        reg.trainingExperience || '',
        (reg.assessmentAreas || []).join(', '),
        reg.experiencingPain ? 'Yes' : 'No',
        reg.painArea || '',
        reg.painScore || '0',
        reg.previousInjury ? 'Yes' : 'No',
        (reg.medicalInformation || '').replace(/[\r\n]+/g, ' '),
        reg.status || 'Registered',
        reg.createdAt || ''
      ].map(val => `"${String(val).replace(/"/g, '""')}"`);
    });

    const csvContent = [headers.join(','), ...rows.join('\n')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `registrations-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await registrationsAPI.updateStatus(id, newStatus);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReg = async (id) => {
    if (!confirm('Permanently delete this registration record?')) return;
    try {
      await registrationsAPI.delete(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={ClipboardCheck} label="Total Registrations" value={totalCount} color="bg-blue-500" bg="bg-blue-50" />
        <StatCard icon={Clock} label="Registered Today" value={todayCount} color="bg-green-500" bg="bg-green-50" />
        <StatCard icon={Calendar} label="Last 7 Days" value={weekCount} color="bg-purple-500" bg="bg-purple-50" />
        <StatCard icon={Activity} label="Last 30 Days" value={monthCount} color="bg-orange-500" bg="bg-orange-50" />
        <StatCard icon={QrCode} label="Active Camps" value={activeCamps} color="bg-teal-500" bg="bg-teal-50" />
      </div>

      {/* Filter panel */}
      <div className="glass-panel bg-slate-950/60 p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Advanced Search & Filters</h3>
          <button
            onClick={handleCSVExport}
            className="px-4 py-2 border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Export Filtered to CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Search Participant</label>
            <input
              type="text"
              placeholder="Name, Phone, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Filter Venue / Gym</label>
            <select
              value={filterVenue}
              onChange={e => {
                setFilterVenue(e.target.value);
                setFilterCampaign('');
              }}
              className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all"
            >
              <option value="">All Venues</option>
              {collaborations.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
              <option value="other">Other / To be announced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Filter Campaign / Camp</label>
            <select
              value={filterCampaign}
              disabled={!filterVenue || filterVenue === 'other'}
              onChange={e => setFilterCampaign(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary disabled:opacity-50"
            >
              <option value="">All Camps</option>
              {campaigns
                .filter(c => c.collaborationId === filterVenue)
                .map(camp => (
                  <option key={camp._id} value={camp._id}>{camp.title}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Assessment Area</label>
            <select
              value={filterArea}
              onChange={e => setFilterArea(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="">All Areas</option>
              {['Knee', 'Back', 'Shoulder', 'Neck', 'Hip', 'Ankle / Foot', 'Sports Injury', 'Posture / Mobility', 'General Fitness', 'Other'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Experiencing Pain</label>
            <select
              value={filterPain}
              onChange={e => setFilterPain(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Primary Activity</label>
            <select
              value={filterActivity}
              onChange={e => setFilterActivity(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="">All Activities</option>
              {['Gym', 'Sports', 'Running', 'Other'].map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="">All Genders</option>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterVenue('');
                setFilterCampaign('');
                setFilterGender('');
                setFilterActivity('');
                setFilterPain('all');
                setFilterArea('');
              }}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table grid list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Registrations list ({filteredRegs.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['ID / Participant', 'Contact Info', 'Venue & Campaign', 'Complaint & Pain', 'Date Registered', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegs.map(reg => {
                const collabName = collaborations.find(c => c._id === reg.collaborationId)?.name || 'Other';
                const campTitle = campaigns.find(c => c._id === reg.eventId)?.title || 'Free Screening';

                return (
                  <tr key={reg._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] font-black text-slate-400 block">{reg.registrationId}</span>
                      <div className="font-bold text-slate-850 mt-0.5">{reg.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{reg.age} Yrs · {reg.gender || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700 font-semibold">{reg.mobile}</div>
                      {reg.email && <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{reg.email}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-850 font-bold text-xs truncate max-w-[150px]">{collabName}</div>
                      <div className="text-slate-500 text-[10px] truncate max-w-[150px]">{campTitle}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="text-slate-800 font-semibold">{(reg.assessmentAreas || []).slice(0, 2).join(', ')}</div>
                      {reg.experiencingPain ? (
                        <span className="text-[10px] text-red-500 font-black block mt-0.5">Pain: {reg.painArea} ({reg.painScore}/10)</span>
                      ) : (
                        <span className="text-[10px] text-green-600 font-bold block mt-0.5">No Pain</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={reg.status || 'Registered'}
                        onChange={e => handleUpdateStatus(reg._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary font-semibold"
                      >
                        {['Registered', 'Contacted', 'Confirmed', 'Attended', 'Assessment Completed', 'Follow-up Required', 'Cancelled', 'No Show'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 border border-slate-250 rounded-lg transition-colors"
                          title="View Profile Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteReg(reg._id)}
                          className="p-1.5 text-red-400 hover:text-red-650 hover:bg-slate-50 border border-slate-250 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRegs.length === 0 && (
            <p className="text-center text-slate-400 py-10">No registrations found matching the applied filters.</p>
          )}
        </div>
      </div>

      {selectedReg && (
        <RegistrationDetailModal 
          registration={selectedReg} 
          collaborations={collaborations}
          campaigns={campaigns}
          onClose={() => setSelectedReg(null)} 
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};


// ─── REGISTRATION DETAIL MODAL ────────────────────────────────────────────────
const RegistrationDetailModal = ({ registration, collaborations, campaigns, onClose, onUpdateStatus }) => {
  const collab = collaborations.find(c => c._id === registration.collaborationId);
  const camp = campaigns.find(c => c._id === registration.eventId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] space-y-6">
        
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest block">{registration.registrationId}</span>
            <h3 className="font-bold text-slate-800 text-lg">Participant Intake Profile</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full"><X size={20} /></button>
        </div>

        {/* Status manager */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-sm">
          <span className="font-bold text-slate-600">Lead Status:</span>
          <select
            value={registration.status || 'Registered'}
            onChange={e => {
              onUpdateStatus(registration._id, e.target.value);
              registration.status = e.target.value;
            }}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary font-bold bg-white"
          >
            {['Registered', 'Contacted', 'Confirmed', 'Attended', 'Assessment Completed', 'Follow-up Required', 'Cancelled', 'No Show'].map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="space-y-5 text-sm">
          {/* Section 1: Participant */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participant Details</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div><strong>Name:</strong> {registration.fullName}</div>
              <div><strong>Age:</strong> {registration.age} Yrs</div>
              <div><strong>Gender:</strong> {registration.gender || '—'}</div>
              <div><strong>Mobile:</strong> {registration.mobile}</div>
              <div className="col-span-2"><strong>Email:</strong> {registration.email || 'None'}</div>
            </div>
          </div>

          {/* Section 2: Fitness */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fitness & Experience Profile</h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div><strong>Primary Activity:</strong> {registration.primaryActivity}</div>
              <div><strong>Experience:</strong> {registration.trainingExperience}</div>
            </div>
          </div>

          {/* Section 3: Assessment */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment Requirements</h4>
            <div className="text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div><strong>Areas of Assessment:</strong> {(registration.assessmentAreas || []).join(', ')}</div>
              <div><strong>Experiencing Active Pain?</strong> {registration.experiencingPain ? 'Yes' : 'No'}</div>
              {registration.experiencingPain && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-700 grid grid-cols-3 gap-2">
                  <div><strong>Area:</strong> {registration.painArea}</div>
                  <div><strong>Since:</strong> {registration.painSince}</div>
                  <div><strong>Pain Score:</strong> {registration.painScore}/10</div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previous Injury & Medical Notes</h4>
            <div className="text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div><strong>Previous Injury / Surgery?</strong> {registration.previousInjury ? 'Yes' : 'No'}</div>
              <div><strong>Clinical Medical Info:</strong> {registration.medicalInformation || 'None provided.'}</div>
            </div>
          </div>

          {/* Section 5: Venue metadata */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Booking Meta</h4>
            <div className="text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div><strong>Selected Venue:</strong> {collab ? collab.name : 'Other / To be announced'}</div>
              <div><strong>Screening Event:</strong> {camp ? camp.title : 'Free Assessment Camp'}</div>
              <div><strong>Registration Time:</strong> {new Date(registration.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};


// ─── PARTNERSHIP ENQUIRIES MANAGER ───────────────────────────────────────────
const EnquiriesManager = ({ enquiries, onRefresh, onAddAsPartner, onQuickList }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Partnership Enquiries ({enquiries.length})</h2>
      </div>

      <div className="glass-panel border border-white/10 bg-slate-950/40 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                {['Organization', 'Contact Person', 'Details', 'Interested Services', 'Message', 'Inquiry Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enquiries.map(enq => (
                <tr key={enq._id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{enq.organizationName}</div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{enq.organizationType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-200">{enq.contactPerson}</div>
                    <div className="text-slate-400 text-xs">{enq.phone} {enq.email && `| ${enq.email}`}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div>🏙️ {enq.city || '—'}</div>
                    <div>👥 Members: {enq.memberCount || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium max-w-[150px] truncate text-slate-350 font-sans">
                    {(enq.interestedServices || []).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-350 max-w-[200px] truncate" title={enq.message}>
                    {enq.message || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onQuickList(enq)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle size={12} /> Quick List
                      </button>
                      <button
                        onClick={() => onAddAsPartner(enq)}
                        className="px-2.5 py-1.5 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Edit size={12} /> Customize
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enquiries.length === 0 && (
            <p className="text-center text-slate-400 py-10">No partnership enquiries received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;

