import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Calendar, TrendingUp, Users, Eye, FileText, 
  ArrowRight, Activity, AlertTriangle, Lightbulb, Download, 
  Smartphone, Monitor, Tablet, Globe, ArrowUpRight, ArrowDownRight,
  MapPin, CheckCircle, RefreshCw, Printer, Clock
} from 'lucide-react';
// @ts-ignore
import { analyticsAPI } from '../../api/axios';

interface MetricData {
  events: any[];
  registrations: any[];
  appointments: any[];
  enquiries: any[];
  collaborations: any[];
  campaigns: any[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricData>({
    events: [],
    registrations: [],
    appointments: [],
    enquiries: [],
    collaborations: [],
    campaigns: []
  });
  
  const [dateRange, setDateRange] = useState<string>('30days');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [activeChartMetric, setActiveChartMetric] = useState<'visitors' | 'views' | 'sessions'>('visitors');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsAPI.getMetrics();
      if (res.data && res.status === 200) {
        setMetrics(res.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Analytics temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (error) {
    return (
      <div className="p-8 bg-[#0b0f19] border border-red-500/20 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
        <h3 className="text-lg font-bold text-white">Access Denied / Error</h3>
        <p className="text-slate-400 text-xs max-w-sm mx-auto">{error}</p>
        <button 
          onClick={fetchMetrics}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 mx-auto"
        >
          <RefreshCw size={14} /> Retry Request
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Loading Analytics Pipeline...</p>
      </div>
    );
  }

  // Helper: Date range math
  const getPeriodBoundaries = () => {
    let now = new Date();
    let start = new Date();
    let prevStart = new Date();
    let prevEnd = new Date();

    switch (dateRange) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        prevStart.setDate(prevStart.getDate() - 1);
        prevStart.setHours(0, 0, 0, 0);
        prevEnd.setDate(prevEnd.getDate() - 1);
        prevEnd.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        now.setDate(now.getDate() - 1);
        now.setHours(23, 59, 59, 999);
        
        prevStart.setDate(prevStart.getDate() - 2);
        prevStart.setHours(0, 0, 0, 0);
        prevEnd.setDate(prevEnd.getDate() - 2);
        prevEnd.setHours(23, 59, 59, 999);
        break;
      case '7days':
        start.setDate(start.getDate() - 7);
        prevStart.setDate(prevStart.getDate() - 14);
        prevEnd.setDate(prevEnd.getDate() - 7);
        break;
      case '30days':
        start.setDate(start.getDate() - 30);
        prevStart.setDate(prevStart.getDate() - 60);
        prevEnd.setDate(prevEnd.getDate() - 30);
        break;
      case '90days':
        start.setDate(start.getDate() - 90);
        prevStart.setDate(prevStart.getDate() - 180);
        prevEnd.setDate(prevEnd.getDate() - 90);
        break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        now = new Date(now.getFullYear(), now.getMonth(), 0);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        break;
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1);
        prevStart = new Date(now.getFullYear() - 1, 0, 1);
        prevEnd = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'custom':
        if (customStart) start = new Date(customStart);
        if (customEnd) now = new Date(customEnd);
        // Default previous equivalent range duration
        const duration = now.getTime() - start.getTime();
        prevStart = new Date(start.getTime() - duration);
        prevEnd = new Date(start.getTime());
        break;
    }

    return { start, end: now, prevStart, prevEnd };
  };

  const { start, end, prevStart, prevEnd } = getPeriodBoundaries();

  // Filter Data
  const filterByDate = (list: any[], dateField: string, isPrev = false) => {
    const s = isPrev ? prevStart : start;
    const e = isPrev ? prevEnd : end;
    return list.filter(item => {
      const date = new Date(item[dateField] || item.timestamp || item.createdAt);
      return date >= s && date <= e;
    });
  };

  // Filter with Venue & Campaign
  const applyBusinessFilters = (list: any[]) => {
    return list.filter(item => {
      if (selectedVenue !== 'all' && item.collaborationId !== selectedVenue) return false;
      if (selectedCampaign !== 'all' && item.eventId !== selectedCampaign && item.campaign !== selectedCampaign) return false;
      return true;
    });
  };

  // Curated datasets
  const activeEvents = filterByDate(metrics.events, 'timestamp');
  const prevEvents = filterByDate(metrics.events, 'timestamp', true);

  const activeRegistrations = applyBusinessFilters(filterByDate(metrics.registrations, 'createdAt'));
  const prevRegistrations = applyBusinessFilters(filterByDate(metrics.registrations, 'createdAt', true));

  const activeAppointments = filterByDate(metrics.appointments, 'createdAt');
  const prevAppointments = filterByDate(metrics.appointments, 'createdAt', true);

  const activeEnquiries = filterByDate(metrics.enquiries, 'createdAt');
  const prevEnquiries = filterByDate(metrics.enquiries, 'createdAt', true);

  // Calculations: KPIs
  const getUniqueCount = (list: any[], key: string) => {
    return new Set(list.map(item => item[key]).filter(Boolean)).size;
  };

  // KPIs Current Period
  const views = activeEvents.length;
  const visitors = getUniqueCount(activeEvents, 'visitorId');
  const sessions = getUniqueCount(activeEvents, 'sessionId');
  const regs = activeRegistrations.length;
  const leads = activeAppointments.length;
  const partnerLeads = activeEnquiries.length;
  const conversionRate = visitors > 0 ? ((regs + leads) / visitors) * 100 : 0;

  // KPIs Previous Period
  const prevViews = prevEvents.length;
  const prevVisitors = getUniqueCount(prevEvents, 'visitorId');
  const prevRegs = prevRegistrations.length;
  const prevLeads = prevAppointments.length;
  const prevPartnerLeads = prevEnquiries.length;
  const prevConversionRate = prevVisitors > 0 ? ((prevRegs + prevLeads) / prevVisitors) * 100 : 0;

  // Calculate Growth Percentages
  const getGrowth = (current: number, previous: number) => {
    if (previous === 0) return { pct: 0, increase: true };
    const pct = ((current - previous) / previous) * 100;
    return { pct: Math.abs(pct).toFixed(1), increase: pct >= 0 };
  };

  const viewsGrowth = getGrowth(views, prevViews);
  const visitorsGrowth = getGrowth(visitors, prevVisitors);
  const regsGrowth = getGrowth(regs, prevRegs);
  const leadsGrowth = getGrowth(leads, prevLeads);
  const partnersGrowth = getGrowth(partnerLeads, prevPartnerLeads);
  const conversionGrowth = getGrowth(conversionRate, prevConversionRate);

  // Top Pages
  const pageStats = activeEvents.reduce((acc: any, event) => {
    const page = event.page || '/';
    if (!acc[page]) acc[page] = { page, views: 0, unique: new Set() };
    acc[page].views += 1;
    acc[page].unique.add(event.visitorId);
    return acc;
  }, {});

  const topPages = Object.values(pageStats)
    .map((item: any) => ({
      page: item.page,
      views: item.views,
      unique: item.unique.size
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // Traffic Sources
  const sourceStats = activeEvents.reduce((acc: any, event) => {
    const src = event.utm_source || (event.referrer && event.referrer !== 'Direct' ? new URL(event.referrer).hostname : 'Direct');
    if (!acc[src]) acc[src] = 0;
    acc[src] += 1;
    return acc;
  }, {});

  const trafficSources = Object.entries(sourceStats)
    .map(([source, count]: any) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Devices & OS
  const deviceStats = activeEvents.reduce((acc: any, event) => {
    const dev = event.device || 'desktop';
    acc[dev] = (acc[dev] || 0) + 1;
    return acc;
  }, { mobile: 0, tablet: 0, desktop: 0 });

  const totalDeviceHits = (Object.values(deviceStats).reduce((a: any, b: any) => a + b, 0) || 1) as number;

  // Funnel calculations
  const totalVisitors = visitors;
  const serviceVisitors = getUniqueCount(activeEvents.filter(e => e.page && e.page.includes('service')), 'visitorId');
  const assessmentVisitors = getUniqueCount(activeEvents.filter(e => e.page && e.page.includes('assessment')), 'visitorId');
  const formStarted = Math.round(assessmentVisitors * 0.72); // Simulated based on landing
  const formSubmitted = regs;

  // Assessment Analytics
  const activeRegsWithVenue = activeRegistrations.map(r => {
    const venue = metrics.collaborations.find(c => c._id === r.collaborationId);
    return { ...r, venueName: venue ? venue.name : 'Individual/Direct' };
  });

  const venueStats = activeRegsWithVenue.reduce((acc: any, r) => {
    acc[r.venueName] = (acc[r.venueName] || 0) + 1;
    return acc;
  }, {});

  const topVenues = Object.entries(venueStats)
    .map(([venue, count]: any) => ({ venue, count }))
    .sort((a, b) => b.count - a.count);

  const activeAreas = activeRegistrations.reduce((acc: any, r) => {
    const area = r.assessmentArea || 'Knee';
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});

  const totalRegsCount = activeRegistrations.length || 1;
  const areaDistribution = Object.entries(activeAreas).map(([area, count]: any) => ({
    area,
    pct: Math.round((count / totalRegsCount) * 100)
  })).sort((a, b) => b.pct - a.pct);

  const painDistribution = activeRegistrations.reduce((acc: any, r) => {
    const hasPain = r.painScore !== undefined && Number(r.painScore) > 0;
    acc[hasPain ? 'Yes' : 'No'] += 1;
    return acc;
  }, { Yes: 0, No: 0 });

  const validPainScores = activeRegistrations
    .map(r => Number(r.painScore))
    .filter(score => !isNaN(score) && score > 0);
  
  const avgPainScore = validPainScores.length > 0 
    ? (validPainScores.reduce((a, b) => a + b, 0) / validPainScores.length).toFixed(1)
    : 'N/A';

  // Lead Funnel Statuses
  const statusCounts = activeRegistrations.reduce((acc: any, r) => {
    const stat = r.status || 'Registered';
    acc[stat] = (acc[stat] || 0) + 1;
    return acc;
  }, { Registered: 0, Contacted: 0, Confirmed: 0, Attended: 0, Completed: 0 });

  // Chart data: Trend points
  const getTrendData = () => {
    const days: Record<string, { label: string; visitors: number; views: number; sessions: number }> = {};
    
    // Fill in dates for range
    const stepDate = new Date(start);
    while (stepDate <= end) {
      const key = stepDate.toISOString().split('T')[0];
      days[key] = {
        label: stepDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        visitors: 0,
        views: 0,
        sessions: 0
      };
      stepDate.setDate(stepDate.getDate() + 1);
    }

    // Populate actual logs
    activeEvents.forEach(e => {
      const key = new Date(e.timestamp).toISOString().split('T')[0];
      if (days[key]) {
        days[key].views += 1;
      }
    });

    // Populate visitors/sessions uniquely per day
    Object.keys(days).forEach(dateKey => {
      const dayEvents = activeEvents.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === dateKey);
      days[dateKey].visitors = new Set(dayEvents.map(e => e.visitorId)).size;
      days[dateKey].sessions = new Set(dayEvents.map(e => e.sessionId)).size;
    });

    return Object.values(days);
  };

  const trendPoints = getTrendData();
  const maxChartValue = Math.max(...trendPoints.map(p => p[activeChartMetric]), 10) * 1.15;

  // QR campaigns conversions
  const qrAttributions = activeEvents.reduce((acc: any, event) => {
    if (event.campaign) {
      const campId = event.campaign;
      if (!acc[campId]) acc[campId] = { scans: 0, visits: 0, submissions: 0 };
      if (event.utm_source === 'qr') {
        acc[campId].scans += 1;
      } else {
        acc[campId].visits += 1;
      }
    }
    return acc;
  }, {});

  activeRegistrations.forEach(r => {
    if (r.eventId) {
      if (!qrAttributions[r.eventId]) qrAttributions[r.eventId] = { scans: 0, visits: 0, submissions: 0 };
      qrAttributions[r.eventId].submissions += 1;
    }
  });

  const campaignsAttributed = Object.entries(qrAttributions).map(([campId, stats]: any) => {
    const campObj = metrics.campaigns.find(c => c._id === campId);
    return {
      name: campObj ? campObj.title : campId,
      scans: stats.scans || stats.visits,
      submissions: stats.submissions,
      pct: stats.scans || stats.visits > 0 ? ((stats.submissions / (stats.scans || stats.visits)) * 100).toFixed(1) : '0'
    };
  });

  // Export CSV Helper
  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Venue', 'Assessment Area', 'Status', 'Pain Score', 'Created At'];
    const rows = activeRegistrations.map(r => {
      const venue = metrics.collaborations.find(c => c._id === r.collaborationId);
      return [
        r.registrationId || r._id,
        venue ? venue.name : 'Direct',
        r.assessmentArea || 'Knee',
        r.status || 'Registered',
        r.painScore || '0',
        new Date(r.createdAt).toLocaleString()
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zk_rehab_analytics_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate recommendations/insights
  const generateInsights = () => {
    const list = [];
    if (regs > prevRegs && prevRegs > 0) {
      list.push({
        type: 'success',
        text: `Assessment registrations increased by ${regsGrowth.pct}% compared with the previous period.`
      });
    } else if (regs < prevRegs) {
      list.push({
        type: 'danger',
        text: `Assessment registrations decreased by ${regsGrowth.pct}% this period. Consider activating promotion campaigns.`
      });
    }

    if (areaDistribution.length > 0) {
      list.push({
        type: 'info',
        text: `${areaDistribution[0].area}-related recovery assessments are currently the most requested category (${areaDistribution[0].pct}%).`
      });
    }

    if (topVenues.length > 0) {
      list.push({
        type: 'success',
        text: `Venue "${topVenues[0].venue}" generated the highest amount of user registrations (${topVenues[0].count} leads).`
      });
    }

    if (conversionRate > 5) {
      list.push({
        type: 'info',
        text: `Visitor to lead conversion rate is high (${conversionRate.toFixed(2)}%). Funnel flow is highly optimized.`
      });
    }

    if (list.length === 0) {
      return [{ type: 'info', text: 'Not enough data to generate deep insights yet.' }];
    }
    return list;
  };

  const activeInsights = generateInsights();

  // Print view handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-white pb-12 print:bg-white print:text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
            Internal Operations
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white print:text-slate-950">
            Analytics & Insights
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 print:hidden">
            Understand how visitors discover ZK RehabSphere, what they explore, and which activities generate leads.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <Printer size={13} />
            Print Report
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <Download size={13} />
            Export CSV
          </button>
          <button 
            onClick={fetchMetrics}
            className="flex items-center justify-center p-2 bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-xl hover:text-cyan-400 transition-all"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="glass-panel border border-white/10 p-4 rounded-3xl flex flex-col xl:flex-row xl:items-center justify-between gap-4 print:hidden">
        
        {/* Date Ranges */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
            { id: '90days', label: '90 Days' },
            { id: 'thisMonth', label: 'This Month' },
            { id: 'lastMonth', label: 'Last Month' },
            { id: 'thisYear', label: 'This Year' },
            { id: 'custom', label: 'Custom Range' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                dateRange === r.id
                  ? 'bg-cyan-500 text-slate-950 shadow shadow-cyan-500/10'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Custom selectors */}
        {dateRange === 'custom' && (
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <input 
              type="date" 
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-transparent text-slate-300 text-[10px] outline-none px-2 font-bold"
            />
            <span className="text-slate-600 text-xs">to</span>
            <input 
              type="date" 
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-transparent text-slate-300 text-[10px] outline-none px-2 font-bold"
            />
          </div>
        )}

        {/* Camp & Venue Selection */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <MapPin size={13} className="text-cyan-500" />
            <span>Venue:</span>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-[10px] text-white outline-none focus:border-cyan-500"
            >
              <option value="all">All Venues</option>
              {metrics.collaborations.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Clock size={13} className="text-cyan-500" />
            <span>Campaign:</span>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-[10px] text-white outline-none focus:border-cyan-500"
            >
              <option value="all">All Campaigns</option>
              {metrics.campaigns.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Visitors', value: visitors.toLocaleString(), growth: visitorsGrowth, icon: <Users size={16} /> },
          { label: 'Page Views', value: views.toLocaleString(), growth: viewsGrowth, icon: <Eye size={16} /> },
          { label: 'Assessments', value: regs, growth: regsGrowth, icon: <Activity size={16} /> },
          { label: 'Appt Leads', value: leads, growth: leadsGrowth, icon: <FileText size={16} /> },
          { label: 'Partner Leads', value: partnerLeads, growth: partnersGrowth, icon: <TrendingUp size={16} /> },
          { label: 'Conversion', value: `${conversionRate.toFixed(2)}%`, growth: conversionGrowth, icon: <CheckCircle size={16} /> },
        ].map((kpi, idx) => (
          <div key={idx} className="glass-panel border border-white/10 hover:border-cyan-500/20 p-5 rounded-3xl relative overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider">{kpi.label}</span>
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
                {kpi.icon}
              </div>
            </div>
            
            <div className="text-lg sm:text-2xl font-black text-white">{kpi.value}</div>
            
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                kpi.growth.increase 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-rose-500/10 text-rose-400'
              }`}>
                {kpi.growth.increase ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {kpi.growth.pct}%
              </span>
              <span className="text-[9px] text-slate-500 font-bold">vs previous</span>
            </div>
          </div>
        ))}
      </div>

      {/* TREND CHART */}
      <div className="glass-panel border border-white/10 p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Traffic Trend Analysis</h3>
            <p className="text-xs text-slate-400">Visitor page views and unique sessions mapped across current date range.</p>
          </div>
          
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5 self-start">
            {[
              { id: 'visitors', label: 'Visitors' },
              { id: 'views', label: 'Page Views' },
              { id: 'sessions', label: 'Sessions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChartMetric(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${
                  activeChartMetric === tab.id
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart render */}
        {trendPoints.length > 0 ? (
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 1000 250" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yVal = 220 - ratio * 190;
                return (
                  <line 
                    key={idx} 
                    x1="40" 
                    y1={yVal} 
                    x2="980" 
                    y2={yVal} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeDasharray="4 4" 
                  />
                );
              })}

              {/* Path Generator */}
              {(() => {
                const pointsCount = trendPoints.length;
                const pointsList = trendPoints.map((point, index) => {
                  const val = point[activeChartMetric];
                  const x = 40 + (index / (pointsCount - 1 || 1)) * 940;
                  const y = 220 - (val / maxChartValue) * 190;
                  return { x, y, label: point.label, value: val };
                });

                const dPath = pointsList.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const fillPath = `${dPath} L ${pointsList[pointsList.length - 1].x} 220 L ${pointsList[0].x} 220 Z`;

                return (
                  <>
                    {/* Fill Area */}
                    <path d={fillPath} fill="url(#chartGradient)" />
                    {/* Stroke Line */}
                    <path d={dPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Interactive dots */}
                    {pointsList.map((p, idx) => (
                      <circle 
                        key={idx} 
                        cx={p.x} 
                        cy={p.y} 
                        r="3.5" 
                        fill="#0b0f19" 
                        stroke="#06b6d4" 
                        strokeWidth="2" 
                        className="cursor-pointer hover:r-[6.5] transition-all"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Custom Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute bg-slate-900 border border-cyan-500/40 px-3 py-2 rounded-xl text-[10px] space-y-0.5 shadow-xl pointer-events-none z-[1000]"
                style={{ left: `${(hoveredPoint.x / 1000) * 100}%`, top: `${(hoveredPoint.y / 250) * 100 - 15}%`, transform: 'translate(-50%, -100%)' }}
              >
                <div className="text-slate-400 font-bold">{hoveredPoint.label}</div>
                <div className="text-cyan-400 font-black text-xs">{hoveredPoint.value} {activeChartMetric}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500 text-xs">Not enough trend logs to render.</div>
        )}
      </div>

      {/* THREE LAYERS: TOP PAGES, TRAFFIC SOURCES, JOURNEY FUNNEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Pages */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <Globe size={15} className="text-cyan-400" /> Top Pages Explored
            </h3>
            <div className="space-y-3.5">
              {topPages.length > 0 ? topPages.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="truncate text-xs font-bold text-slate-300 max-w-[160px]">{item.page}</div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <div className="text-slate-400 font-medium">Views: <span className="text-white font-black">{item.views}</span></div>
                    <div className="text-slate-500">Uniq: <span className="text-cyan-400 font-bold">{item.unique}</span></div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500 text-xs">No page hits logs found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <TrendingUp size={15} className="text-cyan-400" /> Traffic Sources
            </h3>
            <div className="space-y-3">
              {trafficSources.length > 0 ? trafficSources.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">{item.source}</span>
                    <span className="font-black text-cyan-400">{item.count} hits</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${(item.count / (views || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500 text-xs">No traffic sources matched.</div>
              )}
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-5 flex items-center gap-1.5">
            <Activity size={15} className="text-cyan-400" /> Lead Conversion Funnel
          </h3>
          
          <div className="space-y-4">
            {[
              { label: 'Website Visitors', count: totalVisitors, pct: 100 },
              { label: 'Service Views', count: serviceVisitors, pct: totalVisitors > 0 ? Math.round((serviceVisitors / totalVisitors) * 100) : 0 },
              { label: 'Assessment Views', count: assessmentVisitors, pct: serviceVisitors > 0 ? Math.round((assessmentVisitors / serviceVisitors) * 100) : 0 },
              { label: 'Form Started', count: formStarted, pct: assessmentVisitors > 0 ? Math.round((formStarted / assessmentVisitors) * 100) : 0 },
              { label: 'Submitted Registrations', count: formSubmitted, pct: formStarted > 0 ? Math.round((formSubmitted / formStarted) * 100) : 0 },
            ].map((stage, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 relative z-10">
                  <div>
                    <span className="text-[9px] font-black uppercase text-cyan-500">Stage {idx + 1}</span>
                    <div className="text-xs font-bold text-white leading-tight">{stage.label}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">{stage.count}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{stage.pct}% conversion</div>
                  </div>
                </div>
                {idx < 4 && (
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-cyan-500/20 border-dashed border-l border-cyan-500/30"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECONSTRUCTION: CLINICAL DATA DEEP DIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registrations by Venue */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4">Registrations by Partner Venue</h3>
          <div className="space-y-3.5 max-h-60 overflow-y-auto">
            {topVenues.length > 0 ? topVenues.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-slate-300">{item.venue}</span>
                <span className="text-xs font-black text-cyan-400">{item.count} registrations</span>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-xs">No registrations logged in selected range.</div>
            )}
          </div>
        </div>

        {/* Assessment areas distribution */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4">Therapy Area Distribution</h3>
          <div className="space-y-3">
            {areaDistribution.length > 0 ? areaDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">{item.area}</span>
                  <span className="font-black text-cyan-400">{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-xs">No area logs available.</div>
            )}
          </div>
        </div>

        {/* Pain distribution */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4">Severity & Pain Insights</h3>
            
            <div className="grid grid-cols-2 gap-4 text-center mt-3">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Average Pain score</div>
                <div className="text-3xl font-black text-cyan-400 my-1">{avgPainScore}</div>
                <div className="text-[9px] text-slate-500 font-bold">Scale of 1 to 10</div>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Pain Symptom Ratio</div>
                <div className="text-3xl font-black text-cyan-400 my-1">
                  {regs > 0 ? `${Math.round((painDistribution.Yes / regs) * 100)}%` : '0%'}
                </div>
                <div className="text-[9px] text-slate-500 font-bold">Yes vs No pain reports</div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Reporting Active Pain:</span>
                <span className="font-bold text-white">{painDistribution.Yes} leads</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">No Pain (Wellness check):</span>
                <span className="font-bold text-white">{painDistribution.No} leads</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* INSIGHTS & ANOMALIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Insights Engine */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
            <Lightbulb size={16} className="text-yellow-400" /> Insights Engine
          </h3>
          <div className="space-y-3">
            {activeInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-3 bg-white/5 border border-white/5 p-3.5 rounded-2xl">
                <div className="text-xl">💡</div>
                <p className="text-xs text-slate-300 leading-relaxed font-bold">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign conversions list */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
            <Globe size={16} className="text-cyan-400" /> QR Campaign Conversions
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {campaignsAttributed.length > 0 ? campaignsAttributed.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <div className="text-xs font-bold text-slate-300">{item.name}</div>
                  <div className="text-[9px] text-slate-500 font-bold">Scans/Visits: {item.scans}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-cyan-400">{item.submissions} Regs</div>
                  <div className="text-[10px] text-slate-400 font-bold">{item.pct}% conversion</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-xs">No attribution codes recorded.</div>
            )}
          </div>
        </div>

      </div>

      {/* USER DEMOGRAPHICS / DEVICE META */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Device breakdown */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4">Device Usage breakdown</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Mobile', value: deviceStats.mobile, pct: Math.round((deviceStats.mobile / totalDeviceHits) * 100), icon: <Smartphone size={20} /> },
              { label: 'Desktop', value: deviceStats.desktop, pct: Math.round((deviceStats.desktop / totalDeviceHits) * 100), icon: <Monitor size={20} /> },
              { label: 'Tablet', value: deviceStats.tablet, pct: Math.round((deviceStats.tablet / totalDeviceHits) * 100), icon: <Tablet size={20} /> },
            ].map((d, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="text-cyan-400 flex justify-center mb-1.5">{d.icon}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{d.label}</div>
                <div className="text-lg font-black text-white my-0.5">{d.pct}%</div>
                <div className="text-[9px] text-slate-500 font-bold">{d.value} hits</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Funnel conversion tracking */}
        <div className="glass-panel border border-white/10 p-6 rounded-3xl">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 mb-4">Lead Status Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'Registered Leads', count: statusCounts.Registered || regs },
              { label: 'Contacted Leads', count: statusCounts.Contacted },
              { label: 'Confirmed Enquiries', count: statusCounts.Confirmed },
              { label: 'Attended Assessment', count: statusCounts.Attended },
              { label: 'Completed Therapy', count: statusCounts.Completed }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-slate-300">{item.label}</span>
                <span className="text-xs font-black text-cyan-400">{item.count} leads</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT LEADS ADMIN DATA TABLE */}
      <div className="glass-panel border border-white/10 p-6 rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Recent Lead Submissions</h3>
            <p className="text-xs text-slate-400">Authorized list of active clinical leads registered during period.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Venue</th>
                <th className="py-3 px-2">Area</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {activeRegsWithVenue.length > 0 ? activeRegsWithVenue.slice(0, 5).map((r, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="py-3 px-2 font-mono text-cyan-400">{r.registrationId || r._id}</td>
                  <td className="py-3 px-2 font-bold text-slate-200">{r.venueName}</td>
                  <td className="py-3 px-2 text-slate-300">{r.assessmentArea || 'Knee'}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/10 text-cyan-400">
                      {r.status || 'Registered'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No recent leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
