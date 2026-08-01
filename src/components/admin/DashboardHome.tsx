import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, FileText, Calendar, Database, AlertTriangle, 
  CheckCircle2, XCircle, Star, Sparkles, MapPin, Phone
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export const DashboardHome: React.FC = () => {
  const { 
    experts, blogs, appointments, reviews, 
    updateAppointmentStatus, updateReviewStatus 
  } = useSiteData();

  // Filter pending items for urgency callouts
  const pendingReviews = reviews.filter((r) => r.status === 'pending');
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');

  const totalUrgentCount = pendingReviews.length + pendingAppointments.length;

  return (
    <div className="space-y-8 text-white">
      
      {/* Dynamic Urgency / Alerts Section */}
      {totalUrgentCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/30 space-y-4"
        >
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle size={20} className="animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Urgent Operations Center ({totalUrgentCount} Tasks Pending)
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Please resolve the pending items below to publish reviews or confirm home therapist assignments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Reviews Actions */}
            {pendingReviews.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-400 block">
                  Pending Patient Reviews ({pendingReviews.length})
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {pendingReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-white">{rev.patientName}</strong>
                          <p className="text-[10px] text-slate-400">{rev.city} • {rev.treatment}</p>
                        </div>
                        <div className="flex text-yellow-400 gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={10} className="fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 italic font-medium leading-relaxed">
                        "{rev.message}"
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'approved')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500 hover:text-slate-950 transition-colors font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'rejected')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 hover:bg-rose-500 hover:text-white transition-colors font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Appointments Actions */}
            {pendingAppointments.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 block">
                  Pending Appointment Calls ({pendingAppointments.length})
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {pendingAppointments.map((appt) => (
                    <div key={appt.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-white">{appt.patientName}</strong>
                          <p className="text-[10px] text-slate-400">{appt.locationArea} Tricity</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 text-[9px] font-black uppercase">
                          Call Patient
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 space-y-0.5">
                        <p>📞 Phone: {appt.patientPhone}</p>
                        <p>📅 Date: {appt.preferredDate}</p>
                        <p>💆 Service: {appt.selectedService}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500 hover:text-slate-950 transition-colors font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Confirm Visit
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:bg-rose-500/20 hover:text-rose-300 transition-colors font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Doctors</span>
            <UserCheck size={18} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{experts.length}</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Published Articles</span>
            <FileText size={18} className="text-sky-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{blogs.length}</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Patient Bookings</span>
            <Calendar size={18} className="text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{appointments.length}</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Storage Engine</span>
            <Database size={18} className="text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-emerald-400">IndexedDB Active</p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Recent Patient Home Appointments</h3>
          <span className="text-xs text-slate-400 font-mono">{appointments.length} Total Requests</span>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-400">
            No patient appointment bookings recorded yet. Use "Book Home Visit" on the public website to test!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Phone / Email</th>
                  <th className="py-3 px-4">Area / Location</th>
                  <th className="py-3 px-4">Preferred Date</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-white/5">
                    <td className="py-3 px-4 font-bold text-white">{appt.patientName}</td>
                    <td className="py-3 px-4">
                      <p>{appt.patientPhone}</p>
                      <p className="text-[10px] text-slate-400">{appt.patientEmail}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-cyan-300">{appt.locationArea}</td>
                    <td className="py-3 px-4">{appt.preferredDate}</td>
                    <td className="py-3 px-4">{appt.selectedService}</td>
                    <td className="py-3 px-4">
                      <select
                        value={appt.status}
                        onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as any)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-cyan-300 font-bold focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
