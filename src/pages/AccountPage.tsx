import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/firestoreService';
import { TripInquiry } from '../types';
import { User, Mail, Calendar, Compass, Clock, CheckCircle2, ArrowRight, LogOut, ShieldAlert } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, customerProfile, isAdmin, logout, loading } = useAuth();
  const [inquiries, setInquiries] = useState<TripInquiry[]>([]);
  const [fetchingInquiries, setFetchingInquiries] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      onNavigate('/login');
      return;
    }

    if (user) {
      FirestoreService.getInquiriesByCustomer(user.uid, user.email || undefined)
        .then((list) => {
          setInquiries(list);
          setFetchingInquiries(false);
        })
        .catch(() => setFetchingInquiries(false));
    }
  }, [user, loading, onNavigate]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#78634B] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#78634B]">Loading your safari portal...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F7F4ED] min-h-[85vh] px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Profile Header */}
        <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#20221F] text-[#B69A68] rounded-full flex items-center justify-center font-serif text-2xl font-light">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
                  {user.displayName || 'Guest Member'}
                </h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 bg-[#78634B] text-white text-[10px] uppercase tracking-wider font-semibold">
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-[#20221F]/60 flex items-center gap-2 mt-1">
                <Mail className="w-3.5 h-3.5 text-[#78634B]" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-5 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('/plan-trip')}
              className="px-5 py-2.5 border border-[#20221F] hover:bg-[#20221F] hover:text-white text-[#20221F] text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Request Custom Itinerary
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 text-xs text-[#20221F]/70 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Inquiries and Bookings Section */}
        <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D9D0C2]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#78634B] font-semibold block mb-1">
                Active Expeditions & Inquiries
              </span>
              <h2 className="font-serif text-2xl font-light text-[#20221F]">
                Your Safari Journey Ledger
              </h2>
            </div>
            <span className="text-xs text-[#20221F]/50">
              {inquiries.length} {inquiries.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {fetchingInquiries ? (
            <div className="py-12 text-center text-xs text-[#20221F]/60">
              Querying Cloud Firestore records...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <Compass className="w-10 h-10 text-[#78634B]/40 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-light text-[#20221F] mb-2">
                No active safari inquiries yet
              </h3>
              <p className="text-xs text-[#20221F]/60 font-light mb-6 leading-relaxed">
                Start your African journey by submitting an inquiry for mountain gorillas, Serengeti migration, or private charter expeditions.
              </p>
              <button
                onClick={() => onNavigate('/plan-trip')}
                className="px-6 py-3 bg-[#20221F] text-[#F7F4ED] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#78634B] transition-colors cursor-pointer"
              >
                Plan Your Safari
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {inquiries.map((inq) => (
                <div
                  key={inq.reference}
                  className="border border-[#D9D0C2] p-6 hover:border-[#78634B] transition-colors bg-[#F7F4ED]/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#78634B] bg-white px-2 py-1 border border-[#D9D0C2] inline-block mb-1">
                        {inq.reference}
                      </span>
                      <h4 className="font-serif text-xl text-[#20221F]">
                        {inq.destinations?.join(', ') || 'Custom Safari Expedition'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#20221F] text-[#F7F4ED] text-[10px] uppercase tracking-wider font-semibold">
                        {inq.status}
                      </span>
                      <button
                        onClick={() => onNavigate(`/booking/${inq.reference}`)}
                        className="text-xs uppercase tracking-wider text-[#78634B] font-semibold hover:text-[#20221F] flex items-center gap-1"
                      >
                        <span>Tracker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#20221F]/70 py-3 border-t border-b border-[#D9D0C2]/50 my-3">
                    <div>
                      <span className="text-[10px] uppercase text-[#20221F]/40 block">Submitted</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#20221F]/40 block">Travel Dates</span>
                      <span>{inq.travelDates || 'Dates Flexible'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#20221F]/40 block">Party</span>
                      <span>{inq.adultsCount} Adults {inq.childrenCount ? `, ${inq.childrenCount} Children` : ''}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#20221F]/40 block">Quotation</span>
                      <span className="font-semibold text-[#20221F]">
                        {inq.quotedAmount ? `$${inq.quotedAmount.toLocaleString()}` : 'Preparing Estimate'}
                      </span>
                    </div>
                  </div>

                  {inq.statusNotes && (
                    <p className="text-xs text-[#20221F]/80 font-light italic mt-3 bg-white p-3 border border-[#D9D0C2]/60">
                      "{inq.statusNotes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
