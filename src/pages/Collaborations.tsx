import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Calendar, ArrowRight, ShieldCheck, 
  MapPin, Award, CheckCircle2, Sparkles, Dumbbell,
  QrCode, Share2, Check
} from 'lucide-react';
// @ts-ignore
import { collaborationsAPI, campaignsAPI, enquiriesAPI } from '../api/axios';
// @ts-ignore
import SEO from '../components/SEO';
import physioGymImg from '../assets/physio-gym.png';
// @ts-ignore
import { resolveImageUrl } from '../utils/imageUtils';

const ORG_TYPES = [
  'Gym',
  'Sports Academy',
  'Fitness Center',
  'Running Club',
  'Sports Club',
  'School',
  'College',
  'Corporate',
  'Other'
];

const COLLAB_SERVICES = [
  'Free Physiotherapy Assessment',
  'Sports Injury Screening',
  'Movement Assessment',
  'Posture Assessment',
  'Injury Prevention',
  'Sports Performance',
  'Physiotherapy Consultation',
  'Recovery Program',
  'Workshop',
  'Awareness Camp',
  'Other'
];

interface EnquiryFormState {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  memberCount: string;
  interestedServices: string[];
  preferredDate: string;
  message: string;
}

const Collaborations: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const campsRef = useRef<HTMLDivElement>(null);

  // States
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [enquiryForm, setEnquiryForm] = useState<EnquiryFormState>({
    organizationName: '',
    organizationType: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    memberCount: '',
    interestedServices: [],
    preferredDate: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [qrModalTitle, setQrModalTitle] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collabRes, campRes] = await Promise.all([
          collaborationsAPI.getAll(),
          campaignsAPI.getAll()
        ]);
        const activeCollabs = (collabRes.data.collaborations || []).filter(
          (c: any) => c.status === 'Active'
        );
        setCollaborations(activeCollabs);
        setCampaigns(campRes.data.campaigns || []);
      } catch (err) {
        console.error('Error fetching collaborations data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleServiceToggle = (service: string) => {
    setEnquiryForm(prev => {
      const services = prev.interestedServices.includes(service)
        ? prev.interestedServices.filter(s => s !== service)
        : [...prev.interestedServices, service];
      return { ...prev, interestedServices: services };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.organizationName || !enquiryForm.organizationType || !enquiryForm.contactPerson || !enquiryForm.phone) {
      setErrorMsg('Please fill in all required fields (*).');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      try {
        await enquiriesAPI.create({
          ...enquiryForm,
          memberCount: enquiryForm.memberCount ? Number(enquiryForm.memberCount) : null
        });
      } catch (dbErr) {
        console.warn('Database write failed, proceeding to WhatsApp redirect:', dbErr);
      }

      // Format WhatsApp details
      const message = `*ZK RehabSphere - New Partnership Enquiry*
---------------------------------------------
*Organization:* ${enquiryForm.organizationName}
*Type:* ${enquiryForm.organizationType}
*Contact Person:* ${enquiryForm.contactPerson}
*Phone:* ${enquiryForm.phone}
*Email:* ${enquiryForm.email || 'N/A'}
*City:* ${enquiryForm.city || 'N/A'}
*Members:* ${enquiryForm.memberCount || 'N/A'}
*Interested Services:* ${(enquiryForm.interestedServices || []).join(', ')}
*Preferred Date:* ${enquiryForm.preferredDate || 'N/A'}
*Message:* ${enquiryForm.message || 'None'}
---------------------------------------------
We would like to collaborate with ZK RehabSphere.`;

      const whatsappUrl = `https://wa.me/917340820883?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setSubmitSuccess(true);
      setEnquiryForm({
        organizationName: '',
        organizationType: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: '',
        memberCount: '',
        interestedServices: [],
        preferredDate: '',
        message: ''
      });
    } catch (err) {
      setErrorMsg('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegisterRedirect = (campId: string) => {
    window.location.hash = `#assessment?campaign=${campId}`;
  };

  const handleVenueRedirect = (venueId: string) => {
    window.location.hash = `#assessment?venue=${venueId}`;
  };

  const handleShareLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full bg-[#030712] text-slate-100 min-h-screen">
      <SEO 
        title="Gym & Academy Collaborations - ZK RehabSphere" 
        description="Explore collaborations between ZK RehabSphere and premium Chandigarh Tricity fitness centers, schools, and academies. Free diagnostic assessments." 
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.15),rgba(255,255,255,0))] z-0"></div>
        <div className="absolute inset-0 bg-[#030712] opacity-40 z-0"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-semibold tracking-wider uppercase">
              <Sparkles size={14} /> Partner With ZK RehabSphere
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Better Movement.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Better Performance.</span><br />
              Better Recovery.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
              We collaborate with gyms, sports academies, and active communities to provide professional physiotherapy, injury prevention screenings, and advanced movement assessment programs directly to your venue.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => scrollToSection(formRef)}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Partner With Us <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => scrollToSection(campsRef)}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-all"
              >
                Explore Assessment Camps
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[480px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center bg-slate-900"
          >
            <img 
              src={physioGymImg} 
              alt="Physiotherapy Gym Screening" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
            <div className="relative z-10 p-8 text-center text-white space-y-4 max-w-sm">
              <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/40">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-xl font-bold">On-Site Injury Screenings</h3>
              <p className="text-slate-300 text-sm">
                Advanced diagnostic tools, orthopedic tests, and movement profiling conducted live at partner fitness facilities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY WE COLLABORATE SECTION */}
      <section className="py-24 border-y border-slate-900 bg-slate-950 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Why Partner With Us?</h2>
            <p className="text-slate-400 text-base md:text-lg">
              Add diagnostic excellence to your facility. We help gyms, athletic academies, and fitness centers elevate member retention, prevent training injuries, and provide premium clinical value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Ethical Clinical Expertise</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Provide members access to verified physiotherapy practitioners specializing in sports biomechanics, pain management, and athletic performance recovery.
              </p>
            </div>

            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Injury Risk Reductions</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Screen members for joint instabilites, muscular imbalances, or mobility restrictions before they develop into training setbacks or heavy tears.
              </p>
            </div>

            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Premium Added Value</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Host customized clinical workshops and movement camps. Position your establishment as a health-first performance hub in your region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-[#030712]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">How It Works</h2>
            <p className="text-slate-400 text-base">
              Getting registered and receiving your professional biomechanical assessment is direct and painless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-4 p-6 bg-slate-900/30 border border-slate-900 rounded-2xl">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">01</div>
              <h3 className="text-lg font-bold text-white">Choose Your Venue</h3>
              <p className="text-slate-400 text-xs">
                Select your preferred neighborhood gym or upcoming camp location from the live list.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-slate-900/30 border border-slate-900 rounded-2xl">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">02</div>
              <h3 className="text-lg font-bold text-white">Register for Assessment</h3>
              <p className="text-slate-400 text-xs">
                Complete our secure assessment intake form online in under two minutes to reserve your time slot.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-slate-900/30 border border-slate-900 rounded-2xl">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">03</div>
              <h3 className="text-lg font-bold text-white">Visit the Camp</h3>
              <p className="text-slate-400 text-xs">
                Present your Unique Registration ID to the check-in desk at the scheduled date and venue.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-slate-900/30 border border-slate-900 rounded-2xl">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">04</div>
              <h3 className="text-lg font-bold text-white">Get Movement Profile</h3>
              <p className="text-slate-400 text-xs">
                Receive hands-on clinical evaluation, joint mobility report, and injury risk feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE PARTNERS & UPCOMING CAMPS */}
      <section ref={campsRef} className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Active Partners & Upcoming Camps</h2>
            <p className="text-slate-400">
              Browse current partners and register for live clinical screening slots near you.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : collaborations.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-400">No active collaborations listed publicly at this moment.</p>
              <button 
                onClick={() => scrollToSection(formRef)}
                className="mt-4 px-6 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-lg hover:bg-teal-400 text-sm"
              >
                Inquire to Host a Camp
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collaborations.map((partner) => {
                const partnerCampaigns = campaigns.filter(
                  c => c.collaborationId === partner._id && c.registrationOpen
                );

                return (
                  <div key={partner._id} className="group relative overflow-hidden bg-slate-950/40 border border-white/10 hover:border-teal-500/50 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
                    {/* Hover line highlighting */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shrink-0 overflow-hidden">
                          {partner.logo ? (
                            <img src={resolveImageUrl(partner.logo)} alt={partner.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={24} className="text-teal-400" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                            {partner.type}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1 leading-snug">{partner.name}</h3>
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {partner.description || `Proudly partnering with ${partner.name} to deliver clinical assessment support and injury screenings.`}
                      </p>

                      <div className="flex items-start gap-2.5 text-slate-400 text-xs mb-6">
                        <MapPin size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <span>{partner.address ? `${partner.address}, ` : ''}{partner.city}, {partner.state}</span>
                      </div>

                      {partner.servicesOffered && Array.isArray(partner.servicesOffered) && partner.servicesOffered.length > 0 && (
                        <div className="mb-8">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Collaboration Services</p>
                          <div className="flex flex-wrap gap-1.5">
                            {partner.servicesOffered.slice(0, 3).map((svc: string) => (
                              <span key={svc} className="text-[10px] font-semibold bg-slate-800/80 border border-slate-700/50 text-slate-300 px-2 py-0.5 rounded-md">
                                {svc}
                              </span>
                            ))}
                            {partner.servicesOffered.length > 3 && (
                              <span className="text-[10px] text-slate-500 px-1 py-0.5 font-bold">
                                +{partner.servicesOffered.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-4">
                      {partnerCampaigns.length > 0 && (
                        <div className="bg-teal-950/20 border border-teal-500/20 rounded-2xl p-4">
                          <span className="text-[10px] font-black text-teal-400 uppercase tracking-wider block mb-1">
                            Upcoming: FREE ASSESSMENT CAMP
                          </span>
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <Calendar size={13} className="text-cyan-400" />
                            <span>{(() => {
                              const dateVal = partnerCampaigns[0].date;
                              if (!dateVal) return 'Date TBA';
                              let d: Date;
                              if (typeof dateVal === 'string' || typeof dateVal === 'number') {
                                d = new Date(dateVal);
                              } else if (dateVal && typeof dateVal === 'object' && 'seconds' in dateVal) {
                                d = new Date((dateVal as any).seconds * 1000);
                              } else {
                                return 'Date TBA';
                              }
                              return isNaN(d.getTime()) ? 'Date TBA' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                            })()}</span>
                          </div>
                        </div>
                      )}

                      {/* Registration Options */}
                      {(() => {
                        const targetId = partnerCampaigns.length > 0 ? partnerCampaigns[0]._id : partner._id;
                        const registerUrl = partnerCampaigns.length > 0 
                          ? `${window.location.origin}/#assessment?campaign=${targetId}` 
                          : `${window.location.origin}/#assessment?venue=${targetId}`;
                        
                        return (
                          <div className="space-y-2">
                            {partnerCampaigns.length > 0 ? (
                              <button
                                onClick={() => handleRegisterRedirect(partnerCampaigns[0]._id)}
                                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <span>Register for Free Assessment</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVenueRedirect(partner._id)}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <span>Book Free Appointment</span>
                              </button>
                            )}

                            {/* Additional Action Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  setQrModalUrl(registerUrl);
                                  setQrModalTitle(partner.name);
                                }}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-450/40 transition-all cursor-pointer"
                                title="Scan to register"
                              >
                                <QrCode size={13} className="text-cyan-400" />
                                <span>Scan QR</span>
                              </button>
                              
                              <button
                                onClick={() => handleShareLink(registerUrl, targetId)}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 hover:text-teal-400 hover:border-teal-450/40 transition-all cursor-pointer"
                                title="Copy registration link"
                              >
                                {copiedId === targetId ? (
                                  <>
                                    <Check size={13} className="text-emerald-400" />
                                    <span className="text-emerald-400 font-extrabold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Share2 size={13} className="text-teal-400" />
                                    <span>Share URL</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PARTNER WITH US CTA */}
      <section ref={formRef} className="py-24 bg-[#030712] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Want to Collaborate?</h2>
            <p className="text-slate-400 text-sm">
              Bring professional physiotherapy diagnostic support, postural screenings, and injury preventative assessments directly to your athletic venue.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-md">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/30">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white">Enquiry Received Successfully!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Thank you for showing interest in partnering with ZK RehabSphere. Our clinical coordination team will review your requirements and reach out to you shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {errorMsg && (
                  <p className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold text-center">
                    {errorMsg}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.organizationName}
                      onChange={e => setEnquiryForm({...enquiryForm, organizationName: e.target.value})}
                      placeholder="e.g. The Platinum Gym"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Organization Type *
                    </label>
                    <select
                      required
                      value={enquiryForm.organizationType}
                      onChange={e => setEnquiryForm({...enquiryForm, organizationType: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-all"
                    >
                      <option value="">Select Type</option>
                      {ORG_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.contactPerson}
                      onChange={e => setEnquiryForm({...enquiryForm, contactPerson: e.target.value})}
                      placeholder="Full Name"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={e => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                      placeholder="10-digit number"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={enquiryForm.email}
                      onChange={e => setEnquiryForm({...enquiryForm, email: e.target.value})}
                      placeholder="Optional"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={enquiryForm.city}
                      onChange={e => setEnquiryForm({...enquiryForm, city: e.target.value})}
                      placeholder="e.g. Chandigarh"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Number of Members / Athletes
                    </label>
                    <input
                      type="number"
                      value={enquiryForm.memberCount}
                      onChange={e => setEnquiryForm({...enquiryForm, memberCount: e.target.value})}
                      placeholder="e.g. 250"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Interested Services
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
                    {COLLAB_SERVICES.map(svc => {
                      const checked = enquiryForm.interestedServices.includes(svc);
                      return (
                        <button
                          type="button"
                          key={svc}
                          onClick={() => handleServiceToggle(svc)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                            checked
                              ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                              : 'bg-slate-900 border-slate-880 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            checked ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-700 bg-slate-950'
                          }`}>
                            {checked && <CheckCircle2 size={12} className="stroke-[3]" />}
                          </div>
                          <span>{svc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Preferred Collaboration Date
                    </label>
                    <input
                      type="date"
                      value={enquiryForm.preferredDate}
                      onChange={e => setEnquiryForm({...enquiryForm, preferredDate: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Message / Special Requests
                  </label>
                  <textarea
                    rows={4}
                    value={enquiryForm.message}
                    onChange={e => setEnquiryForm({...enquiryForm, message: e.target.value})}
                    placeholder="Brief details about your target event..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all min-h-[100px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 text-slate-950 font-black tracking-wider uppercase rounded-xl transition-all shadow-lg"
                >
                  {submitting ? 'Submitting Enquiry...' : 'Start a Collaboration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* QR Code Modal Overlay */}
      {qrModalUrl && (
        <div 
          className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setQrModalUrl(null)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl glass-panel border border-cyan-500/30 p-6 space-y-6 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setQrModalUrl(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                Scan to Register
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {qrModalTitle}
              </h3>
            </div>

            {/* QR Image */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-inner border border-slate-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrModalUrl)}`} 
                alt="Registration QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
              Scan this QR code with your smartphone camera to quickly load the registration form and secure your time slot.
            </p>

            <button
              onClick={() => setQrModalUrl(null)}
              className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-xs font-bold text-cyan-300 rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborations;
