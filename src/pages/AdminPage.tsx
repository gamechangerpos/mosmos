import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { TripInquiry, InquiryStatus } from '../types';
import { ShieldCheck, Lock, Search, Filter, Download, Plus, Check, RefreshCw, Eye, Edit3, Trash2 } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

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
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo passcode for review
    if (pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
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
    // Update local selected
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
              Authorized personnel access to customer booking ledger and inquiries.
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
                  Incorrect passcode. Use demo PIN 1234.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors shadow"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#D9D0C2] text-center">
            <span className="text-[11px] text-[#20221F]/60">
              For testing and demonstration, use passcode: <strong className="text-[#20221F]">1234</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>MOS MOS Safaris Backoffice</span>
            </div>
            <h1 className="font-serif text-3xl font-light text-[#F7F4ED]">
              Expedition & Inquiry Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-[#2A2E28] hover:bg-[#343C32] text-[#D9D0C2] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-transparent hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/20"
            >
              Lock / Sign Out
            </button>
          </div>
        </div>
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
                <Search className="w-3.5 h-3.5 text-[#20221F]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search name, ref, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs pl-8 pr-3 py-2 text-[#20221F] focus:outline-none focus:border-[#78634B]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 text-[#20221F] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Inquiry received">Inquiry received</option>
                <option value="Under review">Under review</option>
                <option value="Quotation prepared">Quotation prepared</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D9D0C2] text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                    <th className="py-2.5">Reference</th>
                    <th className="py-2.5">Client</th>
                    <th className="py-2.5">Destination</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D0C2]/50">
                  {filteredInquiries.map((inq) => {
                    const isSelected = selectedInquiry?.reference === inq.reference;
                    return (
                      <tr
                        key={inq.id}
                        onClick={() => handleSelectInquiry(inq)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#EFECE3]' : 'hover:bg-[#F7F4ED]'
                        }`}
                      >
                        <td className="py-3 font-mono font-bold text-[#20221F]">
                          {inq.reference}
                        </td>
                        <td className="py-3">
                          <span className="font-semibold block">{inq.customerName}</span>
                          <span className="text-[10px] text-[#20221F]/60">{inq.customerEmail}</span>
                        </td>
                        <td className="py-3">
                          {inq.destinations.join(', ')}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold ${
                            inq.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : inq.status === 'Quotation prepared'
                              ? 'bg-[#B69A68]/20 text-[#78634B]'
                              : 'bg-gray-100 text-gray-800'
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
                            className="text-[11px] font-semibold text-[#78634B] hover:underline"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manage Inquiries Editor */}
          <div className="lg:col-span-5">
            {selectedInquiry ? (
              <div className="bg-white border border-[#D9D0C2] shadow-sm p-6 sticky top-28">
                <div className="flex items-center justify-between border-b border-[#D9D0C2] pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                      Active File
                    </span>
                    <h3 className="font-mono text-xl font-bold text-[#20221F]">
                      {selectedInquiry.reference}
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate(`/booking/${selectedInquiry.reference}`)}
                    className="text-xs text-[#78634B] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public View</span>
                  </button>
                </div>

                <div className="text-xs space-y-2 mb-6 text-[#20221F]/80 pb-4 border-b border-[#D9D0C2]">
                  <div>
                    <span className="font-semibold text-[#20221F]">Client: </span>
                    <span>{selectedInquiry.customerName} ({selectedInquiry.customerEmail} | {selectedInquiry.customerPhone || 'No phone'})</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#20221F]">Destinations: </span>
                    <span>{selectedInquiry.destinations.join(' & ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#20221F]">Dates & Group: </span>
                    <span>{selectedInquiry.travelDates} ({selectedInquiry.adultsCount} Adults, {selectedInquiry.childrenCount} Children)</span>
                  </div>
                  {selectedInquiry.notes && (
                    <div className="p-2.5 bg-[#F7F4ED] border border-[#D9D0C2] italic text-[11px]">
                      "{selectedInquiry.notes}"
                    </div>
                  )}
                </div>

                {/* Status Update Form */}
                <form onSubmit={handleSaveStatus} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Update Workflow Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 text-[#20221F] font-medium"
                    >
                      <option value="Inquiry received">Inquiry received</option>
                      <option value="Under review">Under review</option>
                      <option value="Awaiting supplier confirmation">Awaiting supplier confirmation</option>
                      <option value="Quotation prepared">Quotation prepared</option>
                      <option value="Awaiting customer approval">Awaiting customer approval</option>
                      <option value="Awaiting payment">Awaiting payment</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Quoted Total Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      value={editQuotedAmount}
                      onChange={(e) => setEditQuotedAmount(Number(e.target.value))}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 text-[#20221F]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Status Message to Client (Visible on Tracking Page)
                    </label>
                    <textarea
                      rows={2}
                      value={editStatusNotes}
                      onChange={(e) => setEditStatusNotes(e.target.value)}
                      placeholder="e.g. Gorilla permits locked with UWA. Draft proposal sent."
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-2.5 text-[#20221F]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Append Private Internal Admin Note
                    </label>
                    <input
                      type="text"
                      value={editAdminNote}
                      onChange={(e) => setEditAdminNote(e.target.value)}
                      placeholder="e.g. Assigned to senior guide Joseph; dietary preferences confirmed"
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 text-[#20221F]"
                    />
                  </div>

                  {saveSuccess && (
                    <div className="p-2 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs text-center flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Status updated in persistent ledger!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors shadow"
                  >
                    Save Status & Notify Ledger
                  </button>
                </form>

                {/* Audit notes history */}
                {selectedInquiry.adminNotes && selectedInquiry.adminNotes.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#D9D0C2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-2">
                      Internal Notes Log
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#20221F]/70 font-mono">
                      {selectedInquiry.adminNotes.map((note, idx) => (
                        <li key={idx} className="bg-[#F7F4ED] p-1.5 border border-[#D9D0C2]">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#D9D0C2] p-8 text-center text-xs text-[#20221F]/60">
                Select an inquiry from the left table to inspect details, set quotations, and update operational status.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
