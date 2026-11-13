import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { TripInquiry, InquiryStatus } from '../types';
import { Search, CheckCircle2, Clock, AlertCircle, FileText, Calendar, Users, DollarSign, MapPin, Printer } from 'lucide-react';

interface BookingStatusPageProps {
  initialReference?: string;
  onNavigate: (path: string) => void;
}

export const BookingStatusPage: React.FC<BookingStatusPageProps> = ({ initialReference, onNavigate }) => {
  const [searchRef, setSearchRef] = useState(initialReference || '');
  const [inquiry, setInquiry] = useState<TripInquiry | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialReference) {
      const found = StorageService.findInquiryByReference(initialReference);
      setInquiry(found);
      setSearched(true);
    }
  }, [initialReference]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      const found = StorageService.findInquiryByReference(searchRef.trim());
      setInquiry(found);
      setSearched(true);
    }
  };

  const getStatusStep = (status: InquiryStatus): number => {
    switch (status) {
      case 'Inquiry received': return 1;
      case 'Under review': return 2;
      case 'Awaiting supplier confirmation': return 3;
      case 'Quotation prepared': return 4;
      case 'Awaiting customer approval': return 5;
      case 'Awaiting payment': return 6;
      case 'Confirmed': return 7;
      case 'Completed': return 8;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const currentStep = inquiry ? getStatusStep(inquiry.status) : 1;

  const steps = [
    { num: 1, label: 'Inquiry Received' },
    { num: 2, label: 'Under Review' },
    { num: 3, label: 'Supplier Check' },
    { num: 4, label: 'Quote Ready' },
    { num: 5, label: 'Client Approval' },
    { num: 6, label: 'Payment' },
    { num: 7, label: 'Confirmed' }
  ];

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            Expedition Ledger & Status Verification
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F7F4ED] mb-4">
            Booking & Inquiry Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#D9D0C2] font-light max-w-xl mx-auto leading-relaxed mb-6">
            Verify the progress of your customized itinerary, gorilla permit allocations, and lodge confirmations.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              placeholder="e.g. MMS-2026-7841"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="bg-[#2A2E28] border border-white/20 text-xs text-[#F7F4ED] px-4 py-3 flex-1 focus:outline-none focus:border-[#B69A68] uppercase font-mono tracking-wider"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Demo Reference Pill Buttons for convenience */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#D9D0C2]/80">
            <span>Try sample references:</span>
            <button
              type="button"
              onClick={() => {
                setSearchRef('MMS-2026-7841');
                setInquiry(StorageService.findInquiryByReference('MMS-2026-7841'));
                setSearched(true);
              }}
              className="underline hover:text-[#B69A68] font-mono"
            >
              MMS-2026-7841 (Quote Ready)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setSearchRef('MMS-2026-8912');
                setInquiry(StorageService.findInquiryByReference('MMS-2026-8912'));
                setSearched(true);
              }}
              className="underline hover:text-[#B69A68] font-mono"
            >
              MMS-2026-8912 (Confirmed)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {searched && !inquiry && (
          <div className="bg-white p-8 border border-[#D9D0C2] text-center shadow">
            <AlertCircle className="w-10 h-10 text-amber-700 mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-light text-[#20221F] mb-2">
              No Record Found for "{searchRef}"
            </h3>
            <p className="text-xs text-[#20221F]/70 max-w-md mx-auto mb-6">
              Please double check the reference format (e.g. MMS-2026-XXXX) or contact our reservations desk at inquiries@mosmossafaris.com.
            </p>
            <button
              onClick={() => onNavigate('/plan-trip')}
              className="px-6 py-2.5 bg-[#20221F] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Create New Trip Inquiry
            </button>
          </div>
        )}

        {inquiry && (
          <div className="space-y-8 animate-letter-in">
            {/* Record Header Card */}
            <div className="bg-white p-6 sm:p-8 border border-[#D9D0C2] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9D0C2] pb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                    Confidential Reservation Record
                  </span>
                  <h2 className="font-mono text-2xl sm:text-3xl font-bold text-[#20221F] mt-1">
                    {inquiry.reference}
                  </h2>
                  <span className="text-xs text-[#20221F]/60">
                    Created: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                    inquiry.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : inquiry.status === 'Quotation prepared'
                      ? 'bg-[#B69A68]/20 text-[#78634B] border border-[#B69A68]'
                      : 'bg-[#F7F4ED] text-[#20221F] border border-[#D9D0C2]'
                  }`}>
                    {inquiry.status}
                  </div>
                  <button
                    onClick={() => window.print()}
                    title="Print Summary"
                    className="p-2 border border-[#D9D0C2] hover:bg-[#F7F4ED] text-[#20221F]"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-8 border-b border-[#D9D0C2]">
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                  {steps.map((st) => {
                    const isCompleted = currentStep >= st.num;
                    const isCurrent = currentStep === st.num;
                    return (
                      <div key={st.num} className="flex flex-col items-center">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold mb-1.5 transition-colors ${
                          isCompleted
                            ? 'bg-[#78634B] text-white'
                            : 'bg-[#F7F4ED] text-[#20221F]/40 border border-[#D9D0C2]'
                        }`}>
                          {isCompleted ? '✓' : st.num}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider leading-tight ${
                          isCurrent
                            ? 'font-bold text-[#78634B]'
                            : isCompleted
                            ? 'text-[#20221F]'
                            : 'text-[#20221F]/40'
                        }`}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Note from Director */}
              {inquiry.statusNotes && (
                <div className="pt-6 pb-2">
                  <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F]/80 leading-relaxed font-light">
                    <span className="font-semibold text-[#78634B] block mb-1">
                      Message from MOS MOS Safaris Operations:
                    </span>
                    {inquiry.statusNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Travel Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Traveler & Destination Info */}
              <div className="bg-white p-6 sm:p-8 border border-[#D9D0C2] shadow">
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-4 pb-2 border-b border-[#D9D0C2]">
                  Expedition Details
                </h3>

                <dl className="space-y-3 text-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">Primary Traveler</dt>
                    <dd className="font-medium text-[#20221F] mt-0.5">{inquiry.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">Destinations</dt>
                    <dd className="font-medium text-[#20221F] mt-0.5">{inquiry.destinations.join(' & ')}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">Travel Dates</dt>
                    <dd className="font-medium text-[#20221F] mt-0.5">{inquiry.travelDates}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">Party Size</dt>
                    <dd className="font-medium text-[#20221F] mt-0.5">{inquiry.adultsCount} Adults, {inquiry.childrenCount} Children</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">Lodging Category</dt>
                    <dd className="font-medium text-[#20221F] mt-0.5">{inquiry.accommodationType}</dd>
                  </div>
                </dl>
              </div>

              {/* Quotation & Experiences */}
              <div className="bg-white p-6 sm:p-8 border border-[#D9D0C2] shadow">
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-4 pb-2 border-b border-[#D9D0C2]">
                  Quotation & Inclusions
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                      Quotation Status
                    </span>
                    {inquiry.quotedAmount ? (
                      <div className="mt-1">
                        <span className="font-serif text-2xl font-bold text-[#20221F]">
                          ${inquiry.quotedAmount.toLocaleString()} USD
                        </span>
                        <span className="text-[10px] text-[#20221F]/60 block mt-0.5">
                          {inquiry.status === 'Confirmed' ? 'Deposit secured · Fully locked' : 'Official proposal under client review'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-[#20221F]/70 mt-1">
                        Pricing is being calculated based on current official permit rates and lodge allocations.
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Included Focus Experiences
                    </span>
                    <ul className="space-y-1">
                      {inquiry.preferredExperiences.map((exp, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[#20221F]/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#78634B]" />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {inquiry.notes && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-0.5">
                        Client Notes
                      </span>
                      <p className="text-xs text-[#20221F]/70 italic font-light">
                        "{inquiry.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Assistance banner */}
            <div className="p-5 bg-[#20221F] text-[#F7F4ED] border border-[#343C32] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-light text-[#F7F4ED]">
                  Need to amend your arrangements?
                </h4>
                <p className="text-xs text-[#D9D0C2] font-light">
                  Our reservations team is available for modifications, permit swaps, or flight changes.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-2.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
              >
                Contact Expeditions Desk
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
