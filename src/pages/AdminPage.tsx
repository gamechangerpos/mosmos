import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { EmailService } from '../services/emailService';
import { AnalyticsService, AnalyticsSummary } from '../services/analyticsService';
import { TripInquiry, InquiryStatus, BusinessSettings, NotificationLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Check, 
  RefreshCw, 
  Eye, 
  Edit3, 
  Trash2, 
  Cloud, 
  UserCheck, 
  Mail, 
  BarChart3, 
  Compass, 
  Send, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Settings 
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);
  
  // Primary Tabs
  const [activeTab, setActiveTab] = useState<'inquiries' | 'notifications' | 'analytics'>('inquiries');

  // Inquiries State
  const [inquiries, setInquiries] = useState<TripInquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<TripInquiry | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Editing state for inquiry
  const [editStatus, setEditStatus] = useState<InquiryStatus>('PENDING_REVIEW');
  const [editStatusNotes, setEditStatusNotes] = useState('');
  const [editAdminNote, setEditAdminNote] = useState('');
  const [editQuotedAmount, setEditQuotedAmount] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Email & Notification Settings State
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: 'MOS MOS Safaris',
    supportEmail: 'gamechangerpos@gmail.com',
    adminEmail: 'gamechangerpos@gmail.com',
    phone: '+256 700 123 456',
    address: 'Kampala & Entebbe, Uganda · Nairobi, Kenya',
    websiteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://mosmossafaris.com',
    inquiryNotificationsEnabled: true,
    bookingNotificationsEnabled: true,
    statusNotificationsEnabled: true,
    customerConfirmationsEnabled: true,
    providerType: 'firestore_queue'
  });
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState('gamechangerpos@gmail.com');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    status: NotificationLog['status'];
    message: string;
  } | null>(null);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);

  // Analytics State
  const [analyticsFilter, setAnalyticsFilter] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);

  const loadData = () => {
    const list = StorageService.getTripInquiries();
    setInquiries(list);
  };

  const loadSettingsAndLogs = async () => {
    const s = await EmailService.getSettings();
    setSettings(s);
    setTestEmailRecipient(s.adminEmail || s.supportEmail || 'gamechangerpos@gmail.com');
    const logs = await EmailService.getNotificationLogs();
    setNotificationLogs(logs);
  };

  const loadAnalytics = () => {
    const summary = AnalyticsService.getSummary(analyticsFilter);
    setAnalyticsData(summary);
  };

  useEffect(() => {
    loadData();
    loadSettingsAndLogs();
    loadAnalytics();

    // Auto-authenticate if user logged in as authorized admin
    if (isAdmin) {
      setIsAuthenticated(true);
    }
  }, [isAdmin, analyticsFilter]);

  const handleSyncFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus('Synchronizing with Cloud Firestore...');
    try {
      const synced = await StorageService.syncWithFirestore();
      setInquiries(synced);
      await loadSettingsAndLogs();
      loadAnalytics();
      setSyncStatus('Synchronized successfully with Firestore');
      setTimeout(() => setSyncStatus(null), 3500);
    } catch (err) {
      setSyncStatus('Sync complete (offline cache active)');
      setTimeout(() => setSyncStatus(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setGoogleLoginError(null);
    try {
      await loginWithGoogle();
      setIsAuthenticated(true);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err?.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'mosmos-ochre.vercel.app';
        setGoogleLoginError(`Domain Authorization Required: Please add "${domain}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setGoogleLoginError('Google sign-in window was closed before completing login.');
      } else {
        setGoogleLoginError(err?.message || 'Google sign-in encountered an unexpected issue.');
      }
    }
  };

  const handleSelectInquiry = (inq: TripInquiry) => {
    setSelectedInquiry(inq);
    setEditStatus(inq.status);
    setEditStatusNotes(inq.statusNotes || '');
    setEditQuotedAmount(inq.quotedAmount || 0);
    setEditAdminNote('');
    setSaveSuccess(false);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    StorageService.updateTripInquiryStatus(
      selectedInquiry.reference,
      editStatus,
      editStatusNotes,
      editAdminNote || undefined,
      editQuotedAmount || undefined
    );

    loadData();
    const updated = StorageService.findInquiryByReference(selectedInquiry.reference);
    setSelectedInquiry(updated);
    setEditAdminNote('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSaveSuccess(false);

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.supportEmail)) {
      setSettingsError('Please provide a valid support email address.');
      return;
    }
    if (!emailRegex.test(settings.adminEmail)) {
      setSettingsError('Please provide a valid administrator email address.');
      return;
    }

    const success = await EmailService.updateSettings(settings);
    if (success) {
      setSettingsSaveSuccess(true);
      setTimeout(() => setSettingsSaveSuccess(false), 3000);
    } else {
      setSettingsError('Failed to save settings to Firestore.');
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailSending(true);
    setTestEmailResult(null);
    try {
      const res = await EmailService.sendTestEmail(testEmailRecipient);
      setTestEmailResult(res);
      const logs = await EmailService.getNotificationLogs();
      setNotificationLogs(logs);
      setTimeout(() => setTestEmailResult(null), 9000);
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        status: 'FAILED',
        message: err?.message || 'Unexpected test dispatch failure'
      });
    } finally {
      setTestEmailSending(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mosmos_inquiries_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = searchQuery === '' || 
      i.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || 
      i.status.toUpperCase() === statusFilter.toUpperCase() ||
      (statusFilter === 'PENDING_REVIEW' && i.status === 'Inquiry received') ||
      (statusFilter === 'UNDER_REVIEW' && i.status === 'Under review') ||
      (statusFilter === 'CONFIRMED' && i.status === 'Confirmed');

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = inquiries.length;
  const confirmedCount = inquiries.filter(i => i.status === 'Confirmed' || i.status === 'CONFIRMED').length;
  const quoteReadyCount = inquiries.filter(i => i.status === 'Quotation prepared' || i.status === 'APPROVED').length;
  const pendingCount = inquiries.filter(i => i.status === 'PENDING_REVIEW' || i.status === 'Inquiry received' || i.status === 'Under review').length;

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 bg-[#F7F4ED] min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 border border-[#D9D0C2] shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#20221F] text-[#B69A68] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl font-light text-[#20221F]">
              MOS MOS Safaris Backoffice
            </h1>
            <p className="text-xs text-[#20221F]/70 font-light mt-1">
              Authorized personnel access to customer booking ledger, email notification settings, and visitor analytics.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Admin Passcode / PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (Demo PIN: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2.5 focus:outline-none focus:border-[#78634B]"
              />
              {pinError && (
                <span className="text-[11px] text-rose-700 mt-1 block">
                  Incorrect passcode. Use PIN: 1234.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors shadow cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D9D0C2]" />
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-[#20221F]/40 font-semibold">
              Or sign in with Google
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            className="w-full py-2.5 px-4 border border-[#D9D0C2] bg-white hover:bg-[#F7F4ED] text-[#20221F] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#78634B]" />
            <span>Sign In with Admin Google Account</span>
          </button>

          {googleLoginError && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-sm leading-relaxed">
              <div className="font-semibold text-[11px] mb-1 flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Authentication Notice</span>
              </div>
              <p>{googleLoginError}</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#D9D0C2] text-center">
            <span className="text-[11px] text-[#20221F]/60">
              For testing and demonstration, enter passcode: <strong className="text-[#20221F]">1234</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Backoffice Top Navigation Bar */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-6 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>MOS MOS Safaris Directorate</span>
            </div>
            <h1 className="font-serif text-3xl font-light text-[#F7F4ED]">
              Operations & Intelligence Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncFirestore}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#78634B] hover:bg-[#B69A68] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-[#2A2E28] hover:bg-[#343C32] text-[#D9D0C2] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                logout();
              }}
              className="px-4 py-2 bg-transparent hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 cursor-pointer"
            >
              Lock
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className="max-w-7xl mx-auto mt-3 text-xs text-[#B69A68] flex items-center gap-2">
            <Cloud className="w-3.5 h-3.5" />
            <span>{syncStatus}</span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-white text-[#20221F]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Expeditions & Bookings ({totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-white text-[#20221F]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email & Notification Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-[#20221F]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Website Analytics</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ========================================================================= */}
        {/* TAB 1: EXPEDITIONS & BOOKINGS                                             */}
        {/* ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">Total Inquiries</span>
                <span className="font-serif text-3xl font-bold text-[#20221F]">{totalCount}</span>
              </div>

              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold block">Pending / Under Review</span>
                <span className="font-serif text-3xl font-bold text-amber-900">{pendingCount}</span>
              </div>

              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">Quotations Prepared</span>
                <span className="font-serif text-3xl font-bold text-[#78634B]">{quoteReadyCount}</span>
              </div>

              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold block">Confirmed Safaris</span>
                <span className="font-serif text-3xl font-bold text-emerald-900">{confirmedCount}</span>
              </div>
            </div>

            {/* Inquiries Table & Detail Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Table List */}
              <div className="lg:col-span-7 bg-white border border-[#D9D0C2] shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-[#D9D0C2]">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by client, ref, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 pl-8 focus:outline-none focus:border-[#78634B]"
                    />
                    <Search className="w-3.5 h-3.5 text-[#20221F]/40 absolute left-2.5 top-2.5" />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-3.5 h-3.5 text-[#78634B]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#D9D0C2] text-[10px] uppercase tracking-wider text-[#20221F]/50">
                        <th className="pb-3 font-semibold">Reference</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Destinations</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9D0C2]/50">
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-[#20221F]/50">
                            <Compass className="w-8 h-8 text-[#78634B]/30 mx-auto mb-2" />
                            <p className="font-serif text-sm text-[#20221F] font-medium">No Safari Inquiries Found</p>
                            <p className="text-[11px] text-[#20221F]/60 mt-1">
                              Real safari requests submitted by guests on the website will appear here in real time.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => {
                          const isSelected = selectedInquiry?.reference === inq.reference;
                          return (
                            <tr 
                              key={inq.reference} 
                              onClick={() => handleSelectInquiry(inq)}
                              className={`hover:bg-[#F7F4ED] cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#F7F4ED] font-medium' : ''
                              }`}
                            >
                              <td className="py-3 font-mono font-bold text-[#78634B]">{inq.reference}</td>
                              <td className="py-3">
                                <div className="font-medium text-[#20221F]">{inq.customerName}</div>
                                <div className="text-[10px] text-[#20221F]/50">{inq.customerEmail}</div>
                              </td>
                              <td className="py-3 text-[#20221F]/70">{inq.destinations?.join(', ') || 'Custom'}</td>
                              <td className="py-3">
                                <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-sm ${
                                  inq.status === 'Confirmed' || inq.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                                  inq.status === 'Quotation prepared' || inq.status === 'APPROVED' ? 'bg-amber-100 text-amber-800' :
                                  inq.status === 'AWAITING_PAYMENT' || inq.status === 'Deposit pending' ? 'bg-indigo-100 text-indigo-800' :
                                  inq.status === 'REJECTED' || inq.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                  'bg-stone-200 text-stone-800'
                                }`}>
                                  {inq.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectInquiry(inq);
                                  }}
                                  className="p-1 hover:text-[#78634B] transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inquiry Detail Drawer & Status Editor */}
              <div className="lg:col-span-5 bg-white border border-[#D9D0C2] shadow-sm p-6">
                {selectedInquiry ? (
                  <div>
                    <div className="flex items-start justify-between pb-4 border-b border-[#D9D0C2] mb-6">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#78634B] bg-[#F7F4ED] px-2 py-0.5 border border-[#D9D0C2]">
                          {selectedInquiry.reference}
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#20221F] mt-2">
                          {selectedInquiry.customerName}
                        </h3>
                        <p className="text-xs text-[#20221F]/60">
                          {selectedInquiry.customerEmail} · {selectedInquiry.customerPhone}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#20221F]/40">
                        {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Itinerary details */}
                    <div className="grid grid-cols-2 gap-3 text-xs mb-6 bg-[#F7F4ED]/50 p-4 border border-[#D9D0C2]/50">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">Destinations</span>
                        <p className="font-medium text-[#20221F]">{selectedInquiry.destinations?.join(', ') || 'Custom'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">Travel Dates</span>
                        <p className="font-medium text-[#20221F]">{selectedInquiry.travelDates || 'Flexible'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">Guests</span>
                        <p className="font-medium text-[#20221F]">
                          {selectedInquiry.adultsCount} Adults {selectedInquiry.childrenCount ? `, ${selectedInquiry.childrenCount} Children` : ''}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">Budget Range</span>
                        <p className="font-medium text-[#20221F]">{selectedInquiry.budgetRange}</p>
                      </div>
                    </div>

                    {/* Customer Notes */}
                    {selectedInquiry.notes && (
                      <div className="mb-6">
                        <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                          Guest Preferences & Requirements:
                        </span>
                        <p className="text-xs text-[#20221F]/80 font-light bg-[#F7F4ED] p-3 border border-[#D9D0C2]">
                          "{selectedInquiry.notes}"
                        </p>
                      </div>
                    )}

                    {/* Status Update Form */}
                    <form onSubmit={handleSaveStatus} className="space-y-4 pt-4 border-t border-[#D9D0C2]">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold block mb-1">
                          Update Expedition Status (Triggers automated customer email)
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                          className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                        >
                          <option value="PENDING_REVIEW">PENDING_REVIEW (Awaiting initial check)</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW (Permits & availability checking)</option>
                          <option value="APPROVED">APPROVED (Proposal ready for customer)</option>
                          <option value="AWAITING_PAYMENT">AWAITING_PAYMENT (Deposit requested)</option>
                          <option value="CONFIRMED">CONFIRMED (Deposit received & permits locked)</option>
                          <option value="REJECTED">REJECTED (Unavailable dates/quotas)</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold block mb-1">
                          Quoted Total Amount ($ USD)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 14500"
                          value={editQuotedAmount || ''}
                          onChange={(e) => setEditQuotedAmount(Number(e.target.value))}
                          className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold block mb-1">
                          Customer-Facing Status Note (Sent in email & displayed on tracker)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Gorilla permits successfully allocated with UWA. Itinerary sent to your email."
                          value={editStatusNotes}
                          onChange={(e) => setEditStatusNotes(e.target.value)}
                          className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-2.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold block mb-1">
                          Internal Admin Audit Note (Appends timestamp for staff)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Called lodge manager; 2 rooms provisionally held."
                          value={editAdminNote}
                          onChange={(e) => setEditAdminNote(e.target.value)}
                          className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Save & Dispatch Email</span>
                        </button>
                        {saveSuccess && (
                          <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                            <Check className="w-4 h-4" /> Updated!
                          </span>
                        )}
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-20 text-xs text-[#20221F]/50">
                    Select an inquiry from the table to view details and update quotation status.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EMAIL & NOTIFICATION SETTINGS                                      */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Configuration Form */}
            <div className="lg:col-span-7 bg-white border border-[#D9D0C2] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#D9D0C2]">
                <Settings className="w-5 h-5 text-[#78634B]" />
                <div>
                  <h2 className="font-serif text-2xl font-light text-[#20221F]">
                    Email & Notification Settings
                  </h2>
                  <p className="text-xs text-[#20221F]/60">
                    Configure business display parameters, notification recipients, and automated triggers.
                  </p>
                </div>
              </div>

              {settingsError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsSaveSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Settings successfully saved to Cloud Firestore!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                
                {/* General Business Info */}
                <div>
                  <h3 className="font-serif text-lg font-light text-[#20221F] mb-3">
                    Business Identity & Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Business Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-2.5 text-xs focus:outline-none focus:border-[#78634B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Public Website URL
                      </label>
                      <input
                        type="url"
                        required
                        value={settings.websiteUrl}
                        onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-2.5 text-xs focus:outline-none focus:border-[#78634B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Recipients */}
                <div className="pt-4 border-t border-[#D9D0C2]">
                  <h3 className="font-serif text-lg font-light text-[#20221F] mb-1">
                    Notification Recipients
                  </h3>
                  <p className="text-[11px] text-[#20221F]/60 mb-3">
                    Support email receives customer inquiries. Administrator email is used for management and security.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                        Support Email (Inquiry & Booking Alerts) *
                      </label>
                      <input
                        type="email"
                        required
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-2.5 text-xs focus:outline-none focus:border-[#78634B]"
                      />
                      <span className="text-[10px] text-[#20221F]/50 mt-0.5 block">
                        Changing this does not alter administrator permissions.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                        Primary Administrator Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={settings.adminEmail}
                        onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-2.5 text-xs focus:outline-none focus:border-[#78634B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Automated Notification Toggles */}
                <div className="pt-4 border-t border-[#D9D0C2]">
                  <h3 className="font-serif text-lg font-light text-[#20221F] mb-3">
                    Automated Email Triggers
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-[#F7F4ED] border border-[#D9D0C2] cursor-pointer">
                      <div>
                        <span className="font-semibold text-[#20221F] block">Customer Inquiry Confirmation</span>
                        <span className="text-[11px] text-[#20221F]/60">Sends branded confirmation to guest when inquiry is received</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.customerConfirmationsEnabled}
                        onChange={(e) => setSettings({ ...settings, customerConfirmationsEnabled: e.target.checked })}
                        className="w-4 h-4 text-[#78634B]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-[#F7F4ED] border border-[#D9D0C2] cursor-pointer">
                      <div>
                        <span className="font-semibold text-[#20221F] block">Internal Support Inquiry Alerts</span>
                        <span className="text-[11px] text-[#20221F]/60">Dispatches full inquiry details to support email</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.inquiryNotificationsEnabled}
                        onChange={(e) => setSettings({ ...settings, inquiryNotificationsEnabled: e.target.checked })}
                        className="w-4 h-4 text-[#78634B]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-[#F7F4ED] border border-[#D9D0C2] cursor-pointer">
                      <div>
                        <span className="font-semibold text-[#20221F] block">New Booking Notifications</span>
                        <span className="text-[11px] text-[#20221F]/60">Dispatches booking alerts with PENDING_REVIEW status to team</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.bookingNotificationsEnabled}
                        onChange={(e) => setSettings({ ...settings, bookingNotificationsEnabled: e.target.checked })}
                        className="w-4 h-4 text-[#78634B]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-[#F7F4ED] border border-[#D9D0C2] cursor-pointer">
                      <div>
                        <span className="font-semibold text-[#20221F] block">Booking Status Change Emails</span>
                        <span className="text-[11px] text-[#20221F]/60">Notifies customer when an admin approves or updates their booking</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.statusNotificationsEnabled}
                        onChange={(e) => setSettings({ ...settings, statusNotificationsEnabled: e.target.checked })}
                        className="w-4 h-4 text-[#78634B]"
                      />
                    </label>
                  </div>
                </div>

                {/* Email Delivery Gateway Configuration */}
                <div className="pt-4 border-t border-[#D9D0C2]">
                  <h3 className="font-serif text-lg font-light text-[#20221F] mb-1">
                    Email Delivery Gateway
                  </h3>
                  <p className="text-[11px] text-[#20221F]/60 mb-3">
                    Choose how transactional emails and booking alerts are dispatched to customer and staff mailboxes.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                        Active Delivery Gateway Provider
                      </label>
                      <select
                        value={settings.providerType || 'formsubmit'}
                        onChange={(e) => setSettings({ ...settings, providerType: e.target.value as any })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-2.5 text-xs focus:outline-none focus:border-[#78634B]"
                      >
                        <option value="formsubmit">FormSubmit Gateway (Recommended & 100% Free - Zero Server Required)</option>
                        <option value="emailjs">EmailJS Service (Client-Side Direct Delivery to Customer + Admin)</option>
                        <option value="firestore_queue">Cloud Firestore Mail Queue (Firebase Blaze Extension)</option>
                      </select>
                    </div>

                    {settings.providerType === 'emailjs' && (
                      <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] space-y-3">
                        <div className="text-[11px] text-[#78634B] font-medium">
                          Configure your free EmailJS account credentials (from emailjs.com):
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                            EmailJS Service ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. service_xxxxxxx"
                            value={settings.emailJsServiceId || ''}
                            onChange={(e) => setSettings({ ...settings, emailJsServiceId: e.target.value })}
                            className="w-full bg-white border border-[#D9D0C2] p-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                            EmailJS Template ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. template_xxxxxxx"
                            value={settings.emailJsTemplateId || ''}
                            onChange={(e) => setSettings({ ...settings, emailJsTemplateId: e.target.value })}
                            className="w-full bg-white border border-[#D9D0C2] p-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                            EmailJS Public Key
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. user_xxxxxxx / xxxxxxx"
                            value={settings.emailJsPublicKey || ''}
                            onChange={(e) => setSettings({ ...settings, emailJsPublicKey: e.target.value })}
                            className="w-full bg-white border border-[#D9D0C2] p-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {(settings.providerType === 'formsubmit' || !settings.providerType) && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                        <strong>FormSubmit Zero-Backend Relay:</strong> Delivers all customer safari inquiries and test notifications directly to <strong>{settings.supportEmail || 'gamechangerpos@gmail.com'}</strong> over HTTPS.
                        The first time a new email address receives a submission, FormSubmit sends a 1-click confirmation email. Simply click <em>"Activate Form"</em> in Gmail to authorize incoming submissions.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Test Email Sender & Delivery Audit Logs */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Test Email Box */}
              <div className="bg-white border border-[#D9D0C2] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Send className="w-4 h-4 text-[#78634B]" />
                  <h3 className="font-serif text-xl font-light text-[#20221F]">
                    Test Email Delivery
                  </h3>
                </div>
                <p className="text-xs text-[#20221F]/60 mb-4 leading-relaxed">
                  Send a real live email to verify that your configured recipient and delivery gateway are operating correctly.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                      Recipient Email Address
                    </label>
                    <input
                      type="email"
                      value={testEmailRecipient}
                      onChange={(e) => setTestEmailRecipient(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-2 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={testEmailSending}
                    className="w-full py-2.5 bg-[#78634B] hover:bg-[#20221F] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{testEmailSending ? 'Dispatching Live Request...' : 'Send Test Notification'}</span>
                  </button>

                  {testEmailResult && (
                    <div className={`p-3 border text-xs flex items-start gap-2 ${
                      testEmailResult.status === 'DELIVERED'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : testEmailResult.status === 'SENT_TO_PROVIDER'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      {testEmailResult.status === 'DELIVERED' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold uppercase text-[10px] tracking-wider mb-0.5">
                          Status: {testEmailResult.status}
                        </div>
                        <div className="leading-relaxed">{testEmailResult.message}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification Audit Logs */}
              <div className="bg-white border border-[#D9D0C2] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D9D0C2]">
                  <h3 className="font-serif text-lg font-light text-[#20221F]">
                    Notification Audit Trail
                  </h3>
                  <span className="text-[10px] text-[#20221F]/50 font-mono">
                    Firestore & Local Audit
                  </span>
                </div>

                {notificationLogs.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">
                    No notifications logged yet. Dispatches will be recorded here automatically with live provider statuses.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {notificationLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-[#F7F4ED] border border-[#D9D0C2]/70 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold text-[#78634B]">
                            {log.reference}
                          </span>
                          <span className={`px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                            log.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                            log.status === 'SENT_TO_PROVIDER' ? 'bg-amber-100 text-amber-800' :
                            log.status === 'QUEUED' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="font-medium text-[#20221F] truncate">{log.subject}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#20221F]/60 mt-1">
                          <span>To: {log.recipient}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {log.errorMessage && (
                          <div className="text-[10px] text-amber-800/80 bg-amber-50/60 p-1.5 mt-1.5 rounded-sm">
                            {log.errorMessage}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WEBSITE VISITOR ANALYTICS                                          */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && analyticsData && (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#D9D0C2] mb-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <BarChart3 className="w-4 h-4 text-[#78634B]" />
                <span className="font-serif text-lg font-light text-[#20221F]">
                  Traffic & Engagement Overview
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 font-semibold">
                  Date Window:
                </span>
                {(['today', '7d', '30d', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAnalyticsFilter(filter)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                      analyticsFilter === filter
                        ? 'bg-[#20221F] text-white'
                        : 'bg-[#F7F4ED] text-[#20221F]/70 hover:text-[#20221F]'
                    }`}
                  >
                    {filter === 'today' ? 'Today' : filter === '7d' ? '7 Days' : filter === '30d' ? '30 Days' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                    Total Site Visits
                  </span>
                  <span className="text-[9px] bg-[#F7F4ED] text-[#78634B] px-1.5 py-0.5 border border-[#D9D0C2] font-mono">
                    Source: GA4 Sessions
                  </span>
                </div>
                <span className="font-serif text-3xl font-bold text-[#20221F]">
                  {analyticsData.totalVisits.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#20221F]/50 block mt-1">
                  {analyticsData.visitorsToday} visits recorded today
                </span>
              </div>

              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                    Unique Visitors (Est.)
                  </span>
                  <span className="text-[9px] bg-[#F7F4ED] text-[#78634B] px-1.5 py-0.5 border border-[#D9D0C2] font-mono">
                    Source: Active Sessions
                  </span>
                </div>
                <span className="font-serif text-3xl font-bold text-[#20221F]">
                  {analyticsData.uniqueVisitors.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#20221F]/50 block mt-1">
                  Distinct browser sessions
                </span>
              </div>

              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                    Total Page Views
                  </span>
                  <span className="text-[9px] bg-[#F7F4ED] text-[#78634B] px-1.5 py-0.5 border border-[#D9D0C2] font-mono">
                    Source: Telemetry Events
                  </span>
                </div>
                <span className="font-serif text-3xl font-bold text-[#20221F]">
                  {analyticsData.pageViews.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#20221F]/50 block mt-1">
                  ~{(analyticsData.pageViews / (analyticsData.totalVisits || 1)).toFixed(1)} pages per session
                </span>
              </div>

              <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                    Conversion Rate
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 border border-emerald-200 font-mono">
                    Source: Cloud Firestore Records
                  </span>
                </div>
                <span className="font-serif text-3xl font-bold text-emerald-900">
                  {analyticsData.conversionRate}%
                </span>
                <span className="text-[10px] text-[#20221F]/50 block mt-1">
                  {analyticsData.inquiryCount + analyticsData.bookingCount} Inquiries & Bookings
                </span>
              </div>
            </div>

            {/* Visual Trends Chart (SVG responsive) */}
            <div className="bg-white border border-[#D9D0C2] p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D9D0C2]">
                <div>
                  <h3 className="font-serif text-xl font-light text-[#20221F]">
                    Daily Traffic & Engagement Trend
                  </h3>
                  <p className="text-xs text-[#20221F]/50">
                    Visitors (bars) and Page Views (trendline) over time
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#78634B] inline-block" />
                    <span>Visitors</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-[#B69A68] inline-block" />
                    <span>Page Views</span>
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart or Clean Zero State */}
              {analyticsData.dailyTrends.length === 0 || analyticsData.dailyTrends.every(d => d.visitors === 0 && d.pageViews === 0) ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-[#F7F4ED]/50 border border-dashed border-[#D9D0C2]">
                  <BarChart3 className="w-8 h-8 text-[#78634B]/40 mb-2" />
                  <p className="font-serif text-[#20221F] text-sm font-medium">No Traffic Events Recorded Yet</p>
                  <p className="text-[11px] text-[#20221F]/60 max-w-sm mt-1">
                    Live sessions and page views will dynamically plot on this timeline chart as guests visit MOS MOS Safaris.
                  </p>
                </div>
              ) : (
                <div className="h-56 w-full">
                  <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="700" y2="50" stroke="#EBE5DA" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="700" y2="100" stroke="#EBE5DA" strokeDasharray="3 3" />
                    <line x1="0" y1="150" x2="700" y2="150" stroke="#EBE5DA" strokeDasharray="3 3" />
                    
                    {/* Bars for visitors */}
                    {analyticsData.dailyTrends.map((d, idx) => {
                      const barWidth = 700 / (analyticsData.dailyTrends.length * 2);
                      const x = idx * (700 / analyticsData.dailyTrends.length) + 10;
                      const maxVis = Math.max(...analyticsData.dailyTrends.map(t => t.visitors), 10);
                      const barHeight = (d.visitors / maxVis) * 140;
                      const y = 180 - barHeight;

                      return (
                        <g key={d.date}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="#78634B"
                            opacity="0.8"
                            rx="2"
                          />
                          <text
                            x={x + barWidth / 2}
                            y="196"
                            textAnchor="middle"
                            fontSize="9"
                            fill="#8A857A"
                          >
                            {d.date.slice(5)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Trendline for page views */}
                    {analyticsData.dailyTrends.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#B69A68"
                        strokeWidth="2.5"
                        points={analyticsData.dailyTrends.map((d, idx) => {
                          const maxViews = Math.max(...analyticsData.dailyTrends.map(t => t.pageViews), 20);
                          const x = idx * (700 / analyticsData.dailyTrends.length) + 20;
                          const y = 180 - (d.pageViews / maxViews) * 150;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    )}
                  </svg>
                </div>
              )}
            </div>

            {/* Popular Content & Destination Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Most Visited Pages */}
              <div className="bg-white border border-[#D9D0C2] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-light text-[#20221F] mb-3 pb-2 border-b border-[#D9D0C2]">
                  Most Visited Pages
                </h4>
                {analyticsData.topPages.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">No page views recorded yet</p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {analyticsData.topPages.map((p) => (
                      <div key={p.path} className="flex items-center justify-between">
                        <span className="font-mono text-[#78634B] truncate max-w-[180px]">{p.label}</span>
                        <span className="font-bold text-[#20221F]">{p.views} views</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Destinations */}
              <div className="bg-white border border-[#D9D0C2] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-light text-[#20221F] mb-3 pb-2 border-b border-[#D9D0C2]">
                  Popular Destinations
                </h4>
                {analyticsData.topDestinations.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">No destination views recorded yet</p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {analyticsData.topDestinations.map((d) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <span className="text-[#20221F]">{d.name}</span>
                        <span className="font-bold text-[#78634B]">{d.views} views</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Most Viewed Packages */}
              <div className="bg-white border border-[#D9D0C2] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-light text-[#20221F] mb-3 pb-2 border-b border-[#D9D0C2]">
                  Top Safari Expeditions
                </h4>
                {analyticsData.topTours.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">No safari package views recorded yet</p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {analyticsData.topTours.map((t) => (
                      <div key={t.name} className="flex items-center justify-between">
                        <span className="text-[#20221F] truncate max-w-[170px]">{t.name}</span>
                        <span className="font-bold text-[#20221F]">{t.views} views</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Technology & Referring Traffic Sources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Devices */}
              <div className="bg-white border border-[#D9D0C2] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-light text-[#20221F] mb-3 pb-2 border-b border-[#D9D0C2] flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#78634B]" />
                  <span>Device Category</span>
                </h4>
                {analyticsData.deviceBreakdown.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">No device telemetry logged yet</p>
                ) : (
                  <div className="space-y-3 text-xs">
                    {analyticsData.deviceBreakdown.map((dev) => (
                      <div key={dev.device}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="capitalize">{dev.device}</span>
                          <span className="font-semibold">{dev.percentage}% ({dev.count})</span>
                        </div>
                        <div className="w-full bg-[#F7F4ED] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#78634B] h-full"
                            style={{ width: `${dev.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Browsers */}
              <div className="bg-white border border-[#D9D0C2] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-light text-[#20221F] mb-3 pb-2 border-b border-[#D9D0C2] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#78634B]" />
                  <span>Top Browsers</span>
                </h4>
                {analyticsData.browserBreakdown.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">No browser sessions logged yet</p>
                ) : (
                  <div className="space-y-3 text-xs">
                    {analyticsData.browserBreakdown.map((b) => (
                      <div key={b.browser}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span>{b.browser}</span>
                          <span className="font-semibold">{b.percentage}% ({b.count})</span>
                        </div>
                        <div className="w-full bg-[#F7F4ED] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#B69A68] h-full"
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Referral Sources */}
              <div className="bg-white border border-[#D9D0C2] p-5 shadow-sm">
                <h4 className="font-serif text-lg font-light text-[#20221F] mb-3 pb-2 border-b border-[#D9D0C2] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#78634B]" />
                  <span>Referring Channels</span>
                </h4>
                {analyticsData.referralSources.length === 0 ? (
                  <p className="text-xs text-[#20221F]/50 py-6 text-center">No referral channels logged yet</p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {analyticsData.referralSources.map((s) => (
                      <div key={s.source} className="flex items-center justify-between">
                        <span className="text-[#20221F]">{s.source}</span>
                        <span className="font-bold text-[#78634B]">{s.count} visits</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
