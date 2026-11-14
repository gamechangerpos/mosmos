import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { TripInquiry, InquiryStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Search, Filter, Download, Plus, Check, RefreshCw, Eye, Edit3, Trash2, Cloud, UserCheck } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<TripInquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<TripInquiry | null>(null);

  // Editing state
  const [editStatus, setEditStatus] = useState<InquiryStatus>('Under review');
  const [editStatusNotes, setEditStatusNotes] = useState('');
  const [editAdminNote, setEditAdminNote] = useState('');
  const [editQuotedAmount, setEditQuotedAmount] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = () => {
    const list = StorageService.getTripInquiries();
    setInquiries(list);
  };

  useEffect(() => {
    loadData();
    // Auto-authenticate if logged in as Firebase Admin
    if (isAdmin) {
      setIsAuthenticated(true);
    }
  }, [isAdmin]);

  const handleSyncFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing with Cloud Firestore...');
    try {
      const synced = await StorageService.syncWithFirestore();
      setInquiries(synced);
      setSyncStatus('Synchronized successfully with Firestore');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setSyncStatus('Sync failed, using offline records');
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
    try {
      await loginWithGoogle();
      setIsAuthenticated(true);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
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

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `omoja_inquiries_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = searchQuery === '' || 
      i.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = inquiries.length;
  const confirmedCount = inquiries.filter(i => i.status === 'Confirmed').length;
  const quoteReadyCount = inquiries.filter(i => i.status === 'Quotation prepared').length;
  const reviewCount = inquiries.filter(i => i.status === 'Under review' || i.status === 'Inquiry received').length;

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 bg-[#F7F4ED] min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 border border-[#D9D0C2] shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#20221F] text-[#B69A68] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl font-light text-[#20221F]">
              MOS MOS Safaris Operations Portal
            </h1>
            <p className="text-xs text-[#20221F]/70 font-light mt-1">
              Authorized personnel access to customer booking ledger, inquiries, and Cloud Firestore.
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

          <div className="mt-6 pt-4 border-t border-[#D9D0C2] text-center">
            <span className="text-[11px] text-[#20221F]/60">
              For testing and instant demonstration, enter passcode: <strong className="text-[#20221F]">1234</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-8 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>MOS MOS Safaris Backoffice · Cloud Firestore Active</span>
            </div>
            <h1 className="font-serif text-3xl font-light text-[#F7F4ED]">
              Expedition & Inquiry Management
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
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                logout();
              }}
              className="px-4 py-2 bg-transparent hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 cursor-pointer"
            >
              Lock / Sign Out
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className="max-w-7xl mx-auto mt-3 text-xs text-[#B69A68] flex items-center gap-2">
            <Cloud className="w-3.5 h-3.5" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">Total Inquiries</span>
            <span className="font-serif text-3xl font-bold text-[#20221F]">{totalCount}</span>
          </div>

          <div className="bg-white p-5 border border-[#D9D0C2] shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold block">Under Review / New</span>
            <span className="font-serif text-3xl font-bold text-amber-900">{reviewCount}</span>
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
                  <option value="Inquiry received">Inquiry received</option>
                  <option value="Under review">Under review</option>
                  <option value="Quotation prepared">Quotation prepared</option>
                  <option value="Deposit pending">Deposit pending</option>
                  <option value="Confirmed">Confirmed</option>
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
                  {filteredInquiries.map((inq) => {
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
                            inq.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            inq.status === 'Quotation prepared' ? 'bg-amber-100 text-amber-800' :
                            inq.status === 'Deposit pending' ? 'bg-indigo-100 text-indigo-800' :
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
                  })}
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
                      Update Expedition Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                    >
                      <option value="Inquiry received">Inquiry received</option>
                      <option value="Under review">Under review</option>
                      <option value="Quotation prepared">Quotation prepared</option>
                      <option value="Deposit pending">Deposit pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Archived">Archived</option>
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
                      Customer-Facing Status Note (Visible in tracker)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Gorilla permits allocated with UWA. Itinerary sent to your email."
                      value={editStatusNotes}
                      onChange={(e) => setEditStatusNotes(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold block mb-1">
                      Internal Admin Audit Note (Appends timestamp)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Spoke with lodge manager; 2 rooms provisionally held."
                      value={editAdminNote}
                      onChange={(e) => setEditAdminNote(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Save to Ledger & Firestore
                    </button>
                    {saveSuccess && (
                      <span className="text-xs text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Saved!
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
    </div>
  );
};
