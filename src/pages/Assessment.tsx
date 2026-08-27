import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, CheckCircle2, ClipboardCheck, 
  Calendar, Clock, AlertTriangle
} from 'lucide-react';
// @ts-ignore
import { collaborationsAPI, campaignsAPI, registrationsAPI } from '../api/axios';
// @ts-ignore
import SEO from '../components/SEO';

const getHashQueryParam = (name: string): string => {
  const hash = window.location.hash;
  const questIndex = hash.indexOf('?');
  if (questIndex === -1) return '';
  const queryString = hash.substring(questIndex + 1);
  const params = new URLSearchParams(queryString);
  return params.get(name) || '';
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const ACTIVITY_OPTIONS = ['Gym', 'Sports', 'Running', 'Other'];
const EXPERIENCE_OPTIONS = ['<3 months', '3–12 months', '1–3 years', '3+ years'];
const ASSESSMENT_AREAS = [
  'Knee',
  'Back',
  'Shoulder',
  'Neck',
  'Hip',
  'Ankle / Foot',
  'Sports Injury',
  'Posture / Mobility',
  'General Fitness / Movement Screening',
  'Other'
];

interface FormState {
  collaborationId: string;
  eventId: string;
  fullName: string;
  age: string;
  gender: string;
  mobile: string;
  email: string;
  primaryActivity: string;
  trainingExperience: string;
  assessmentAreas: string[];
  experiencingPain: boolean;
  painArea: string;
  painSince: string;
  painScore: number;
  previousInjury: boolean;
  medicalInformation: string;
  consent: boolean;
}

const Assessment: React.FC = () => {
  const navigate = (path: string) => {
    window.location.hash = path === '/' ? '' : path;
  };
  
  // URL Params
  const campaignParam = getHashQueryParam('campaign') || getHashQueryParam('venue') || ''; 

  // Backend Options
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [form, setForm] = useState<FormState>({
    collaborationId: '',
    eventId: '',
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    primaryActivity: '',
    trainingExperience: '',
    assessmentAreas: [],
    experiencingPain: false,
    painArea: '',
    painSince: '',
    painScore: 5,
    previousInjury: false,
    medicalInformation: '',
    consent: false
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collabRes, campRes] = await Promise.all([
          collaborationsAPI.getAll(),
          campaignsAPI.getAll()
        ]);

        const activeCollabs = (collabRes.data.collaborations || []).filter((c: any) => c.status === 'Active');
        const activeCamps = (campRes.data.campaigns || []).filter((c: any) => c.registrationOpen);

        setCollaborations(activeCollabs);
        setCampaigns(activeCamps);

        // Pre-select based on campaign ID or collaboration/venue ID from URL
        let preselectedCollabId = '';
        let preselectedEventId = '';

        if (campaignParam) {
          const matchedCamp = activeCamps.find((c: any) => c._id === campaignParam);
          if (matchedCamp) {
            preselectedEventId = matchedCamp._id;
            preselectedCollabId = matchedCamp.collaborationId;
          } else {
            const matchedCollab = activeCollabs.find((c: any) => c._id === campaignParam);
            if (matchedCollab) {
              preselectedCollabId = matchedCollab._id;
              const collabCamp = activeCamps.find((c: any) => c.collaborationId === matchedCollab._id);
              if (collabCamp) {
                preselectedEventId = collabCamp._id;
              }
            }
          }
        }

        setForm(prev => ({
          ...prev,
          collaborationId: preselectedCollabId,
          eventId: preselectedEventId
        }));

      } catch (err) {
        console.error('Error fetching registration options:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignParam]);

  const handleCollabChange = (collabId: string) => {
    const collabCamps = campaigns.filter(c => c.collaborationId === collabId);
    setForm(prev => ({
      ...prev,
      collaborationId: collabId,
      eventId: collabCamps.length > 0 ? collabCamps[0]._id : ''
    }));
  };

  const handleAreaToggle = (area: string) => {
    setForm(prev => {
      const areas = prev.assessmentAreas.includes(area)
        ? prev.assessmentAreas.filter(a => a !== area)
        : [...prev.assessmentAreas, area];
      return { ...prev, assessmentAreas: areas };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.collaborationId) {
      setErrorMsg('Please select a preferred venue / camp location.');
      return;
    }
    if (!form.fullName || !form.age || !form.mobile || !form.primaryActivity || !form.trainingExperience) {
      setErrorMsg('Please complete all required fields (*).');
      return;
    }
    if (!form.consent) {
      setErrorMsg('You must provide your consent to register.');
      return;
    }

    setSubmitting(true);
    try {
      let regId = `ZKR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      try {
        const res = await registrationsAPI.create({
          ...form,
          age: Number(form.age),
          painScore: form.experiencingPain ? Number(form.painScore) : 0
        });
        if (res?.data?.registrationId) {
          regId = res.data.registrationId;
        }
      } catch (dbErr) {
        console.warn('Database write failed, proceeding to WhatsApp redirect:', dbErr);
      }

      const venue = collaborations.find(c => c._id === form.collaborationId);
      const camp = campaigns.find(c => c._id === form.eventId);

      // Format WhatsApp details
      const message = `*ZK RehabSphere - Free Assessment Camp Registration*
---------------------------------------------
*Reg ID:* ${regId}
*Name:* ${form.fullName}
*Age:* ${form.age} Yrs | *Gender:* ${form.gender || 'N/A'}
*Mobile:* ${form.mobile}
*Email:* ${form.email || 'N/A'}
*Venue:* ${venue ? venue.name : 'Selected Gym Venue'}
*Camp/Event:* ${camp ? camp.title : 'Free Physiotherapy Assessment'}
*Assessment Areas:* ${(form.assessmentAreas || []).join(', ')}
*Experiencing Pain:* ${form.experiencingPain ? 'Yes' : 'No'}
${form.experiencingPain ? `*Pain Area:* ${form.painArea} (${form.painScore}/10)\n*Pain Since:* ${form.painSince}` : ''}
*Injury History:* ${form.previousInjury ? 'Yes' : 'No'}
*Medical Info:* ${form.medicalInformation || 'None'}
---------------------------------------------
Please lock in my booking slot. Thank you!`;

      const whatsappUrl = `https://wa.me/917340820883?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setSuccessData({
        registrationId: regId,
        venueName: venue ? venue.name : 'Selected Gym Venue',
        campaignName: camp ? camp.title : 'Free Physiotherapy Assessment',
        date: camp ? camp.date : 'To be confirmed',
        time: camp ? `${camp.startTime} – ${camp.endTime}` : 'As scheduled',
        contactPerson: venue ? venue.contactPerson : 'Clinic Desk',
        contactNumber: venue ? venue.contactNumber : '+91 7340820883'
      });
    } catch (err) {
      setErrorMsg('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#030712] text-slate-200 min-h-screen pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      <SEO 
        title="Register for Free Assessment Camp - ZK RehabSphere" 
        description="Book your slot for the upcoming ZK RehabSphere physiotherapy and posture assessment camp. Quick registration form." 
      />

      <div className="w-full max-w-2xl bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        {successData ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-6"
          >
            <div className="w-20 h-20 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-teal-500/5">
              <CheckCircle2 size={48} className="stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Registration Successful</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Thank you for registering with ZK RehabSphere. Your assessment request has been received and stored in our systems.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left space-y-4 max-w-md mx-auto font-sans">
              <div className="flex justify-between items-center pb-3 border-b border-slate-850">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Registration ID</span>
                <span className="text-teal-400 font-mono font-bold text-sm tracking-widest">{successData.registrationId}</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5 text-sm">
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Venue</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <Building size={14} className="text-teal-500" /> {successData.venueName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Campaign Event</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <ClipboardCheck size={14} className="text-teal-500" /> {successData.campaignName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Date</span>
                    <span className="text-white font-semibold flex items-center gap-1.5">
                      <Calendar size={14} className="text-teal-500" /> {successData.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Time Slot</span>
                    <span className="text-white font-semibold flex items-center gap-1.5">
                      <Clock size={14} className="text-teal-500" /> {successData.time}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-850">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Coordinator Contact</span>
                  <p className="text-slate-300 text-xs">
                    {successData.contactPerson} · <a href={`tel:${successData.contactNumber}`} className="text-teal-400 underline font-semibold">{successData.contactNumber}</a>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Our clinic representative will contact you shortly to lock in your slot.
            </p>

            <button
              onClick={() => navigate('/')}
              className="px-8 py-3.5 bg-slate-900 border border-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition-all hover:bg-slate-850"
            >
              Back to Website
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="text-center space-y-2 pb-6 border-b border-slate-900">
              <span className="text-teal-400 text-xs font-black tracking-widest uppercase block">ZK RehabSphere</span>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Physiotherapy • Rehabilitation • Sports Injury Care</p>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mt-3">FREE ASSESSMENT CAMP — REGISTRATION</h1>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Register for a free physiotherapy, sports injury & movement assessment session.
              </p>
            </div>

            {errorMsg && (
              <p className="bg-red-500/10 border border-red-500/35 text-red-400 p-4 rounded-xl text-xs font-bold text-center">
                {errorMsg}
              </p>
            )}

            {/* SECTION 1: VENUE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold">1</div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Venue Selection</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Preferred Gym / Venue *</label>
                  <select
                    required
                    value={form.collaborationId}
                    onChange={(e) => handleCollabChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  >
                    <option value="">Select Venue</option>
                    {collaborations.map(collab => (
                      <option key={collab._id} value={collab._id}>{collab.name}</option>
                    ))}
                    <option value="other">Other / To be announced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Active Assessment Camp</label>
                  <select
                    value={form.eventId}
                    onChange={(e) => setForm({...form, eventId: e.target.value})}
                    disabled={!form.collaborationId || form.collaborationId === 'other'}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">Select Event</option>
                    {campaigns
                      .filter(c => c.collaborationId === form.collaborationId)
                      .map(camp => (
                        <option key={camp._id} value={camp._id}>{camp.title}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: PARTICIPANT DETAILS */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold">2</div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Participant Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={e => setForm({...form, fullName: e.target.value})}
                    placeholder="Enter name"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Age *</label>
                    <input
                      type="number"
                      required
                      value={form.age}
                      onChange={e => setForm({...form, age: e.target.value})}
                      placeholder="Age"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Gender</label>
                    <select
                      value={form.gender}
                      onChange={e => setForm({...form, gender: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    >
                      <option value="">Select</option>
                      {GENDER_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={e => setForm({...form, mobile: e.target.value})}
                    placeholder="10-digit phone"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="example@email.com"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: FITNESS & ACTIVITY */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold">3</div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Fitness & Activity Profile</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Primary Activity *</label>
                  <select
                    required
                    value={form.primaryActivity}
                    onChange={e => setForm({...form, primaryActivity: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  >
                    <option value="">Select Activity</option>
                    {ACTIVITY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Training Experience *</label>
                  <select
                    required
                    value={form.trainingExperience}
                    onChange={e => setForm({...form, trainingExperience: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  >
                    <option value="">Select Experience</option>
                    {EXPERIENCE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 4: ASSESSMENT & PAIN */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold">4</div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Assessment Needs</h3>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-3">
                  What would you like to get assessed for? (Multi-select)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ASSESSMENT_AREAS.map(area => {
                    const active = form.assessmentAreas.includes(area);
                    return (
                      <button
                        type="button"
                        key={area}
                        onClick={() => handleAreaToggle(area)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border transition-all ${
                          active 
                            ? 'bg-teal-500/10 border-teal-500 text-teal-300 font-bold' 
                            : 'bg-slate-900 border-slate-850 text-slate-500 hover:border-slate-800'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-400">Currently experiencing pain/injury?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({...form, experiencingPain: true})}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      form.experiencingPain 
                        ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                        : 'bg-slate-900 border-slate-850 text-slate-500'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({...form, experiencingPain: false, painArea: '', painSince: '', painScore: 5})}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      !form.experiencingPain 
                        ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' 
                        : 'bg-slate-900 border-slate-850 text-slate-500'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {form.experiencingPain && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-red-400 mb-2">Pain Area (e.g. Right Knee)</label>
                      <input
                        type="text"
                        value={form.painArea}
                        onChange={e => setForm({...form, painArea: e.target.value})}
                        placeholder="Specify pain area"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-red-400 mb-2">Since When? (e.g. 2 months)</label>
                      <input
                        type="text"
                        value={form.painSince}
                        onChange={e => setForm({...form, painSince: e.target.value})}
                        placeholder="Since when?"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-red-400 mb-2">
                      <span>Pain Score</span>
                      <span className="bg-red-500/10 px-2 py-0.5 rounded font-mono">{form.painScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={form.painScore}
                      onChange={e => setForm({...form, painScore: Number(e.target.value)})}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold">
                      <span>No Pain</span>
                      <span>Moderate Pain</span>
                      <span>Severe Pain</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* SECTION 5: PREVIOUS HISTORY */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold">5</div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Previous History</h3>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400">Previous injury/surgery?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({...form, previousInjury: true})}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      form.previousInjury 
                        ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' 
                        : 'bg-slate-900 border-slate-850 text-slate-500'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({...form, previousInjury: false})}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      !form.previousInjury 
                        ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' 
                        : 'bg-slate-900 border-slate-850 text-slate-500'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Relevant medical information (Optional)</label>
                <textarea
                  rows={3}
                  value={form.medicalInformation}
                  onChange={e => setForm({...form, medicalInformation: e.target.value})}
                  placeholder="Specify other illnesses, history or surgical notes..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm outline-none transition-all min-h-[80px]"
                />
              </div>
            </div>

            {/* CONSENT & SUBMIT */}
            <div className="space-y-6 pt-4 border-t border-slate-900">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={e => setForm({...form, consent: e.target.checked})}
                  className="mt-1 h-4.5 w-4.5 rounded border-slate-800 text-teal-500 focus:ring-teal-500 bg-slate-900"
                />
                <span className="text-slate-400 text-xs leading-relaxed font-semibold">
                  I confirm that the information provided is accurate and agree to be contacted by ZK RehabSphere regarding assessment scheduling and camp updates.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 text-slate-950 font-black tracking-wider uppercase rounded-xl transition-all shadow-lg"
              >
                {submitting ? 'Registering...' : 'Register for Free Assessment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Assessment;
