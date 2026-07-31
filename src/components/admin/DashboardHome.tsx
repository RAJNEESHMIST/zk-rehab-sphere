import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, FileText, Calendar, Database, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export const DashboardHome: React.FC = () => {
  const { experts, blogs, resources, appointments, updateAppointmentStatus } = useSiteData();

  return (
    <div className="space-y-8">
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
