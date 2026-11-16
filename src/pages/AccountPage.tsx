import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FirestoreService } from '../services/firestoreService';
import { PortalService, JOURNEY_STAGES } from '../services/portalService';
import { InteractiveTravelMap } from '../components/common/InteractiveTravelMap';
import { 
  TripInquiry, 
  JourneyStage, 
  CustomerPreferences, 
  SupportConversation, 
  SupportMessage, 
  WishlistItem, 
  TravelMemory, 
  LoyaltyProfile, 
  GroupTrip, 
  TravelDocument 
} from '../types';
import { 
  User, 
  Mail, 
  Calendar, 
  Compass, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  ShieldAlert, 
  Heart, 
  MessageSquare, 
  Award, 
  Users, 
  Settings, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  AlertTriangle, 
  Download, 
  Plus, 
  Camera, 
  MapPin, 
  Phone,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

type AccountTab = 
  | 'overview' 
  | 'journeys' 
  | 'messages' 
  | 'preferences' 
  | 'wishlist' 
  | 'memories' 
  | 'loyalty' 
  | 'groups';

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, customerProfile, isAdmin, logout, loading } = useAuth();
  
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<AccountTab>('overview');

  // Inquiries & Journeys
  const [inquiries, setInquiries] = useState<TripInquiry[]>([]);
  const [fetchingInquiries, setFetchingInquiries] = useState(true);
  const [selectedJourneyRef, setSelectedJourneyRef] = useState<string | null>(null);

  // Customer Preferences
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    dietaryRequirements: 'None (Standard gourmet cuisine)',
    mobilityRequirements: 'Standard physical capability',
    preferredTravelStyles: ['Luxury Lodges', 'Primate Trekking'],
    preferredAccommodations: ['Luxury Tented Camps'],
    pastSafariExperience: 'First-time African expedition',
    emergencyContactName: '',
    emergencyContactPhone: '',
    passportExpiryDate: '',
    notes: ''
  });
  const [prefsSavedMessage, setPrefsSavedMessage] = useState(false);

  // Support Messaging
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Memories
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [newMemoryDestination, setNewMemoryDestination] = useState('');
  const [newMemoryCountry, setNewMemoryCountry] = useState('Uganda');
  const [newMemoryYear, setNewMemoryYear] = useState(new Date().getFullYear());
  const [newMemoryDates, setNewMemoryDates] = useState('');
  const [newMemoryNotes, setNewMemoryNotes] = useState('');
  const [addingMemory, setAddingMemory] = useState(false);

  // Loyalty
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Group Safaris
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDest, setNewGroupDest] = useState('');
  const [newGroupDates, setNewGroupDates] = useState('');
  const [newGroupNotes, setNewGroupNotes] = useState('');
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [activeGroupTripId, setActiveGroupTripId] = useState<string | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Load User Data
  useEffect(() => {
    if (!loading && !user) {
      onNavigate('/login');
      return;
    }

    if (user) {
      // 1. Fetch Inquiries / Journeys
      FirestoreService.getInquiriesByCustomer(user.uid, user.email || undefined)
        .then((list) => {
          setInquiries(list);
          setFetchingInquiries(false);
          if (list.length > 0 && !selectedJourneyRef) {
            setSelectedJourneyRef(list[0].reference);
          }
        })
        .catch(() => setFetchingInquiries(false));

      // 2. Fetch Preferences
      PortalService.getCustomerPreferences(user.uid).then((p) => {
        if (p) setPreferences(p);
      });

      // 3. Fetch Support Conversation & Messages
      PortalService.getOrCreateConversation(
        user.uid,
        user.displayName || user.email || 'Patron',
        user.email || ''
      ).then((conv) => {
        setConversation(conv);
        PortalService.getMessages(conv.id).then(setMessages);
      });

      // 4. Fetch Wishlist
      PortalService.getWishlist(user.uid).then(setWishlist);

      // 5. Fetch Memories
      PortalService.getTravelMemories(user.uid).then(setMemories);

      // 6. Fetch Loyalty Profile
      PortalService.getLoyaltyProfile(user.uid, user.email || undefined).then(setLoyalty);

      // 7. Fetch Group Trips
      PortalService.getGroupTrips(user.uid).then(setGroupTrips);
    }
  }, [user, loading, onNavigate]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#F7F4ED]">
        <div className="w-8 h-8 border-2 border-[#78634B] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#78634B]">Loading your private safari portal...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await PortalService.saveCustomerPreferences(user.uid, preferences);
    setPrefsSavedMessage(true);
    setTimeout(() => setPrefsSavedMessage(false), 3500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversation || !newMsgText.trim() || !user) return;

    setSendingMsg(true);
    try {
      const sent = await PortalService.sendMessage(conversation.id, {
        senderId: user.uid,
        senderName: user.displayName || user.email || 'Patron',
        senderRole: 'customer',
        message: newMsgText.trim()
      });
      setMessages(prev => [...prev, sent]);
      setNewMsgText('');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleRemoveWishlistItem = async (itemId: string) => {
    if (!user) return;
    await PortalService.toggleWishlistItem(user.uid, {
      customerId: user.uid,
      itemType: 'package',
      itemId,
      slug: '',
      title: '',
      heroImage: ''
    });
    setWishlist(prev => prev.filter(i => i.itemId !== itemId));
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMemoryDestination.trim()) return;

    const memory = await PortalService.addTravelMemory(user.uid, {
      customerId: user.uid,
      destination: newMemoryDestination.trim(),
      country: newMemoryCountry,
      year: Number(newMemoryYear),
      travelDates: newMemoryDates.trim() || `${newMemoryYear}`,
      notes: newMemoryNotes.trim(),
      photos: []
    });

    setMemories(prev => [memory, ...prev]);
    setNewMemoryDestination('');
    setNewMemoryDates('');
    setNewMemoryNotes('');
    setAddingMemory(false);
  };

  const handleCreateGroupTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newGroupTitle.trim() || !newGroupDest.trim()) return;

    const created = await PortalService.createGroupTrip(
      user.uid,
      user.displayName || user.email || 'Patron',
      {
        tripTitle: newGroupTitle.trim(),
        destination: newGroupDest.trim(),
        travelDates: newGroupDates.trim(),
        groupNotes: newGroupNotes.trim()
      }
    );

    setGroupTrips(prev => [created, ...prev]);
    setNewGroupTitle('');
    setNewGroupDest('');
    setNewGroupDates('');
    setNewGroupNotes('');
    setCreatingGroup(false);
  };

  const handleInviteToGroup = async (tripId: string) => {
    if (!newInviteEmail.trim()) return;
    await PortalService.inviteToGroupTrip(tripId, newInviteEmail.trim());
    setGroupTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          invitations: [...t.invitations, { email: newInviteEmail.trim().toLowerCase(), invitedAt: new Date().toISOString(), status: 'invited' }]
        };
      }
      return t;
    }));
    setNewInviteEmail('');
  };

  const copyReferralCode = () => {
    if (loyalty?.referralCode) {
      navigator.clipboard.writeText(loyalty.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  // Helper for journey timeline calculation
  const getStageIndex = (stage?: JourneyStage) => {
    if (!stage) return 0;
    const found = JOURNEY_STAGES.findIndex(s => s.stage === stage);
    return found !== -1 ? found : 0;
  };

  const selectedJourney = inquiries.find(i => i.reference === selectedJourneyRef) || inquiries[0];

  return (
    <div className="pt-28 pb-24 bg-[#F7F4ED] min-h-screen px-4 sm:px-8 lg:px-12 text-[#20221F]">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Top Profile Banner */}
        <div className="bg-[#20221F] text-[#F7F4ED] p-6 sm:p-10 mb-8 rounded-lg shadow-xl border border-[#B69A68]/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #B69A68 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-[#B69A68] text-[#20221F] rounded-full flex items-center justify-center font-serif text-2xl font-semibold shadow-md">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-light text-white">
                  {user.displayName || 'Distinguished Patron'}
                </h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 bg-[#78634B] text-white text-[10px] uppercase tracking-wider font-semibold rounded">
                    Admin Console
                  </span>
                )}
                {loyalty && (
                  <span className="px-2.5 py-0.5 bg-[#B69A68]/20 border border-[#B69A68] text-[#B69A68] text-[10px] uppercase tracking-wider font-semibold rounded flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{loyalty.tier} Member</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#F7F4ED]/60 flex items-center gap-2 mt-1">
                <Mail className="w-3.5 h-3.5 text-[#B69A68]" />
                <span>{user.email}</span>
                <span className="text-[#F7F4ED]/30">·</span>
                <span className="text-[#B69A68]">{loyalty?.points || 500} Safari Loyalty Points</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            {isAdmin && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-4 py-2.5 bg-[#78634B] hover:bg-[#8F7449] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 rounded-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('/plan-trip')}
              className="px-5 py-2.5 bg-[#B69A68] hover:bg-[#8F7449] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
            >
              Request Custom Itinerary
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 text-xs text-[#F7F4ED]/70 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Portal Tabs Navigation */}
        <div className="bg-white border border-[#D9D0C2] mb-8 shadow-sm rounded-sm overflow-x-auto">
          <div className="flex items-center min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: Compass },
              { id: 'journeys', label: 'My Journeys & Tracking', icon: Calendar, badge: inquiries.length },
              { id: 'messages', label: 'Concierge Messages', icon: MessageSquare, badge: conversation?.unreadForCustomerCount || undefined },
              { id: 'preferences', label: 'Travel Preferences', icon: Settings },
              { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length },
              { id: 'memories', label: 'Travel Memories', icon: Camera, badge: memories.length },
              { id: 'loyalty', label: 'Loyalty & Perks', icon: Award },
              { id: 'groups', label: 'Group Safaris', icon: Users, badge: groupTrips.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AccountTab)}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#78634B] text-[#78634B] bg-[#F7F4ED]/50'
                      : 'border-transparent text-[#20221F]/70 hover:text-[#20221F] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#78634B]' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#78634B] text-white text-[10px] rounded-full font-bold ml-0.5">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-[#D9D0C2] p-6 shadow-sm rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Active Expeditions
                </span>
                <span className="font-serif text-3xl font-light text-[#20221F]">
                  {inquiries.length}
                </span>
                <span className="text-xs text-[#20221F]/50 block mt-1">Under custom curation</span>
              </div>

              <div className="bg-white border border-[#D9D0C2] p-6 shadow-sm rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Patron Tier
                </span>
                <span className="font-serif text-3xl font-light text-[#B69A68]">
                  {loyalty?.tier || 'Bronze'}
                </span>
                <span className="text-xs text-[#20221F]/50 block mt-1">Tier benefits unlocked</span>
              </div>

              <div className="bg-white border border-[#D9D0C2] p-6 shadow-sm rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Loyalty Points
                </span>
                <span className="font-serif text-3xl font-light text-[#20221F]">
                  {loyalty?.points || 500}
                </span>
                <span className="text-xs text-[#20221F]/50 block mt-1">500 pts welcome grant</span>
              </div>

              <div className="bg-white border border-[#D9D0C2] p-6 shadow-sm rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Saved Experiences
                </span>
                <span className="font-serif text-3xl font-light text-[#20221F]">
                  {wishlist.length}
                </span>
                <span className="text-xs text-[#20221F]/50 block mt-1">In personal wishlist</span>
              </div>
            </div>

            {/* Active Journeys Summary */}
            <div className="bg-white border border-[#D9D0C2] p-6 sm:p-8 shadow-sm rounded-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9D0C2] mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
                    Live Safari Tracking
                  </span>
                  <h2 className="font-serif text-2xl font-light text-[#20221F]">
                    Your Upcoming & Active Expeditions
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('journeys')}
                  className="text-xs uppercase tracking-wider text-[#78634B] font-semibold hover:text-[#20221F] flex items-center gap-1 cursor-pointer"
                >
                  <span>Detailed Journey View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {fetchingInquiries ? (
                <div className="py-12 text-center text-xs text-[#78634B]">Loading live safari tracking records...</div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center max-w-md mx-auto">
                  <Compass className="w-10 h-10 text-[#78634B]/40 mx-auto mb-3" />
                  <h3 className="font-serif text-xl font-light text-[#20221F] mb-2">
                    No active safari inquiries yet
                  </h3>
                  <p className="text-xs text-[#20221F]/60 font-light mb-6 leading-relaxed">
                    Start your African journey by submitting an inquiry for mountain gorillas, Serengeti migration, or private charter expeditions.
                  </p>
                  <button
                    onClick={() => onNavigate('/plan-trip')}
                    className="px-6 py-2.5 bg-[#20221F] text-[#F7F4ED] text-xs uppercase tracking-wider font-semibold hover:bg-[#78634B] transition-colors cursor-pointer"
                  >
                    Plan Your Safari
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {inquiries.slice(0, 2).map((inq) => {
                    const stageIdx = getStageIndex(inq.journeyStage);
                    return (
                      <div key={inq.reference} className="border border-[#D9D0C2] p-6 bg-[#F7F4ED]/40 rounded-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#78634B] bg-white px-2.5 py-1 border border-[#D9D0C2] inline-block mb-1">
                              {inq.reference}
                            </span>
                            <h3 className="font-serif text-xl text-[#20221F]">
                              {inq.packageName || inq.destinations?.join(', ') || 'Bespoke African Safari'}
                            </h3>
                          </div>
                          <span className="px-3 py-1 bg-[#20221F] text-[#B69A68] text-[10px] uppercase tracking-wider font-semibold self-start sm:self-auto rounded">
                            {inq.journeyStage || inq.status}
                          </span>
                        </div>

                        {/* Progress Bar (10 Stages) */}
                        <div className="my-4">
                          <div className="flex justify-between text-[10px] text-[#20221F]/60 uppercase tracking-wider mb-1.5 font-medium">
                            <span>Stage {stageIdx + 1} of 10: {inq.journeyStage || 'Inquiry received'}</span>
                            <span>{Math.round(((stageIdx + 1) / 10) * 100)}% Complete</span>
                          </div>
                          <div className="w-full bg-[#D9D0C2] h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#B69A68] h-full transition-all duration-500 rounded-full"
                              style={{ width: `${Math.max(10, ((stageIdx + 1) / 10) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#20221F]/70 py-3 border-t border-[#D9D0C2]/60 mt-3">
                          <div>
                            <span className="text-[10px] uppercase text-[#20221F]/40 block">Travel Dates</span>
                            <span className="font-medium text-[#20221F]">{inq.travelDates || 'Dates Flexible'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#20221F]/40 block">Travelers</span>
                            <span className="font-medium text-[#20221F]">{inq.adultsCount} Adults</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#20221F]/40 block">Assigned Consultant</span>
                            <span className="font-medium text-[#78634B]">
                              {inq.assignedConsultant?.name || 'Senior Safari Director'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-[#20221F]/40 block">Quotation</span>
                            <span className="font-medium text-[#20221F]">
                              {inq.quotedAmount ? `$${inq.quotedAmount.toLocaleString()}` : 'Under Review'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => onNavigate('/plan-trip')}
                className="bg-white border border-[#D9D0C2] p-6 hover:border-[#78634B] transition-colors cursor-pointer rounded-sm flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F7F4ED] text-[#78634B] flex items-center justify-center group-hover:bg-[#78634B] group-hover:text-white transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#20221F] mb-0.5">Custom Expedition</h4>
                  <p className="text-xs text-[#20221F]/60">Request private route or charter</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('messages')}
                className="bg-white border border-[#D9D0C2] p-6 hover:border-[#78634B] transition-colors cursor-pointer rounded-sm flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F7F4ED] text-[#78634B] flex items-center justify-center group-hover:bg-[#78634B] group-hover:text-white transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#20221F] mb-0.5">Private Concierge</h4>
                  <p className="text-xs text-[#20221F]/60">Direct messaging with team</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('/gallery')}
                className="bg-white border border-[#D9D0C2] p-6 hover:border-[#78634B] transition-colors cursor-pointer rounded-sm flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F7F4ED] text-[#78634B] flex items-center justify-center group-hover:bg-[#78634B] group-hover:text-white transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#20221F] mb-0.5">Expedition Gallery</h4>
                  <p className="text-xs text-[#20221F]/60">Browse authentic safari photos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOURNEYS & 10-STAGE TRACKING */}
        {activeTab === 'journeys' && (
          <div className="space-y-8 animate-fadeIn">
            {inquiries.length === 0 ? (
              <div className="bg-white border border-[#D9D0C2] p-12 text-center rounded-sm">
                <Calendar className="w-10 h-10 text-[#78634B]/40 mx-auto mb-3" />
                <h3 className="font-serif text-xl text-[#20221F] mb-2">No active safari bookings</h3>
                <p className="text-xs text-[#20221F]/60 max-w-sm mx-auto mb-4">
                  When you request an itinerary or confirm a journey, your live timeline and permits will display here.
                </p>
                <button
                  onClick={() => onNavigate('/plan-trip')}
                  className="px-6 py-2.5 bg-[#20221F] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#78634B] transition-colors cursor-pointer"
                >
                  Request Itinerary
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: List of Expeditions */}
                <div className="lg:col-span-4 space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Select Expedition to Inspect
                  </span>
                  {inquiries.map((inq) => {
                    const isSelected = inq.reference === selectedJourney?.reference;
                    return (
                      <div
                        key={inq.reference}
                        onClick={() => setSelectedJourneyRef(inq.reference)}
                        className={`p-4 border transition-all cursor-pointer rounded-sm ${
                          isSelected
                            ? 'bg-[#20221F] text-[#F7F4ED] border-[#B69A68]'
                            : 'bg-white hover:bg-[#F7F4ED] text-[#20221F] border-[#D9D0C2]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-mono text-[11px] font-bold ${isSelected ? 'text-[#B69A68]' : 'text-[#78634B]'}`}>
                            {inq.reference}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                            isSelected ? 'bg-white/10 text-[#B69A68]' : 'bg-[#20221F] text-white'
                          }`}>
                            {inq.journeyStage || inq.status}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-light truncate mb-1">
                          {inq.packageName || inq.destinations?.join(', ') || 'Safari Expedition'}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] opacity-70">
                          <span>{inq.travelDates || 'Flexible'}</span>
                          <span>{inq.adultsCount} Travelers</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: 10-Stage Journey Details */}
                {selectedJourney && (
                  <div className="lg:col-span-8 bg-white border border-[#D9D0C2] p-6 sm:p-8 rounded-sm shadow-sm space-y-8">
                    
                    {/* Top Journey Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9D0C2]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#78634B] bg-[#F7F4ED] px-2.5 py-0.5 border border-[#D9D0C2]">
                            {selectedJourney.reference}
                          </span>
                          {selectedJourney.paymentStatus && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase font-semibold">
                              {selectedJourney.paymentStatus}
                            </span>
                          )}
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#20221F]">
                          {selectedJourney.packageName || selectedJourney.destinations?.join(', ') || 'Custom Safari'}
                        </h2>
                      </div>

                      <button
                        onClick={() => onNavigate(`/booking/${selectedJourney.reference}`)}
                        className="px-4 py-2 border border-[#20221F] hover:bg-[#20221F] hover:text-white text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <span>Public Tracking Link</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Assigned Safari Consultant Card */}
                    <div className="bg-[#F7F4ED]/80 border border-[#D9D0C2] p-5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-[#20221F] text-[#B69A68] flex items-center justify-center font-serif text-lg">
                          {selectedJourney.assignedConsultant?.name ? selectedJourney.assignedConsultant.name.charAt(0) : 'M'}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block">
                            Assigned Travel Director
                          </span>
                          <h4 className="font-serif text-base text-[#20221F]">
                            {selectedJourney.assignedConsultant?.name || 'MOS MOS Expedition Concierge'}
                          </h4>
                          <p className="text-xs text-[#20221F]/60">
                            {selectedJourney.assignedConsultant?.email || 'concierge@mosmossafaris.com'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('messages')}
                        className="px-4 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Consultant</span>
                      </button>
                    </div>

                    {/* 10-Stage Visual Timeline */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold">
                          10-Stage Expedition Progress Timeline
                        </span>
                        <span className="text-xs text-[#20221F]/60 font-medium">
                          Current Stage: {selectedJourney.journeyStage || 'Inquiry received'}
                        </span>
                      </div>

                      <div className="relative pl-6 border-l-2 border-[#D9D0C2] space-y-6 my-6 ml-3">
                        {JOURNEY_STAGES.map((item, idx) => {
                          const currentStageIdx = getStageIndex(selectedJourney.journeyStage);
                          const isDone = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          const isPending = idx > currentStageIdx;

                          return (
                            <div key={item.stage} className="relative group">
                              {/* Step marker node */}
                              <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isDone 
                                  ? 'bg-[#78634B] text-white' 
                                  : isCurrent 
                                  ? 'bg-[#B69A68] text-[#20221F] ring-4 ring-[#B69A68]/20 animate-pulse' 
                                  : 'bg-white border-2 border-[#D9D0C2] text-gray-400'
                              }`}>
                                {isDone ? '✓' : idx + 1}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-serif text-base ${isCurrent ? 'text-[#78634B] font-semibold' : isDone ? 'text-[#20221F]' : 'text-gray-400'}`}>
                                    {item.label}
                                  </h4>
                                  {isCurrent && (
                                    <span className="px-2 py-0.5 bg-[#B69A68]/15 text-[#78634B] text-[9px] uppercase font-bold tracking-wider rounded">
                                      Active Phase
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs mt-0.5 leading-relaxed font-light ${isPending ? 'text-gray-400' : 'text-[#20221F]/70'}`}>
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Travel Documents & Itinerary Repository */}
                    <div className="pt-6 border-t border-[#D9D0C2]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold">
                          Travel Documents & Expedition Vouchers
                        </span>
                        <span className="text-xs text-[#20221F]/50">
                          {selectedJourney.documents?.length || 0} Files
                        </span>
                      </div>

                      {selectedJourney.documents && selectedJourney.documents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedJourney.documents.map((docItem) => (
                            <a
                              key={docItem.id}
                              href={docItem.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 bg-[#F7F4ED] border border-[#D9D0C2] hover:border-[#78634B] flex items-center justify-between text-xs transition-colors rounded-sm"
                            >
                              <div className="flex items-center gap-2.5">
                                <FileText className="w-4 h-4 text-[#78634B]" />
                                <div>
                                  <span className="font-medium text-[#20221F] block">{docItem.name}</span>
                                  <span className="text-[10px] text-[#20221F]/50">{docItem.type}</span>
                                </div>
                              </div>
                              <Download className="w-3.5 h-3.5 text-[#78634B]" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-[#F7F4ED]/60 border border-dashed border-[#D9D0C2] text-center text-xs text-[#20221F]/60">
                          Your final itinerary PDF, park gorilla permits, and lodge confirmation vouchers will appear here once booking is confirmed.
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONCIERGE SUPPORT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white border border-[#D9D0C2] rounded-sm shadow-sm overflow-hidden animate-fadeIn flex flex-col h-[650px]">
            {/* Chat Header */}
            <div className="p-5 bg-[#20221F] text-[#F7F4ED] flex items-center justify-between border-b border-[#B69A68]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B69A68] text-[#20221F] flex items-center justify-center font-serif text-lg font-bold">
                  M
                </div>
                <div>
                  <h3 className="font-serif text-lg font-light text-white">
                    MOS MOS Private Concierge Support
                  </h3>
                  <span className="text-[10px] text-[#B69A68] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                    <span>Regional Expedition Directors Online</span>
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#F7F4ED]/60 font-mono">
                Thread #{conversation?.id.slice(-6)}
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F7F4ED]/30">
              {messages.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto">
                  <MessageSquare className="w-8 h-8 text-[#78634B]/40 mx-auto mb-2" />
                  <p className="text-xs text-[#20221F]/60 leading-relaxed font-light">
                    Start a private conversation with our senior travel directors regarding permits, flight connections, dietary preferences, or private guides.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCustomer = msg.senderRole === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-[#20221F]/50">
                        <span className="font-medium text-[#20221F]">
                          {isCustomer ? 'You' : msg.senderName}
                        </span>
                        <span>·</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-sm text-xs leading-relaxed ${
                          isCustomer
                            ? 'bg-[#20221F] text-[#F7F4ED] rounded-br-none'
                            : 'bg-white border border-[#D9D0C2] text-[#20221F] shadow-sm rounded-bl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#D9D0C2] flex gap-3">
              <input
                type="text"
                placeholder="Type your message to the safari concierge..."
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
              />
              <button
                type="submit"
                disabled={sendingMsg || !newMsgText.trim()}
                className="px-6 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: TRAVEL PREFERENCES & PROFILE */}
        {activeTab === 'preferences' && (
          <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 rounded-sm shadow-sm animate-fadeIn">
            <div className="pb-6 border-b border-[#D9D0C2] mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
                Expedition Personalization Profile
              </span>
              <h2 className="font-serif text-2xl font-light text-[#20221F]">
                Patron Travel Preferences & Safety Records
              </h2>
              <p className="text-xs text-[#20221F]/60 mt-1">
                Our lodge kitchens, bush guides, and bush planes calibrate every detail around these specifications.
              </p>
            </div>

            {prefsSavedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 mb-6">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Your travel profile has been saved and synchronized across our expedition network.</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1.5">
                    Dietary Requirements & Allergies
                  </label>
                  <input
                    type="text"
                    value={preferences.dietaryRequirements}
                    onChange={(e) => setPreferences({ ...preferences, dietaryRequirements: e.target.value })}
                    placeholder="e.g. Vegetarian, Halal, Gluten-free, Peanut allergy"
                    className="w-full px-3 py-2.5 bg-[#F7F4ED]/60 border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                  />
                  <span className="text-[10px] text-[#20221F]/50 mt-1 block">Shared with private lodge chefs prior to arrival.</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1.5">
                    Mobility & Trekking Capability
                  </label>
                  <select
                    value={preferences.mobilityRequirements}
                    onChange={(e) => setPreferences({ ...preferences, mobilityRequirements: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F7F4ED]/60 border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                  >
                    <option value="Full mobility — keen for strenuous gorilla hiking">Full mobility — keen for strenuous gorilla hiking</option>
                    <option value="Moderate capability — comfortable with 3-4 hours walking">Moderate capability — comfortable with 3-4 hours walking</option>
                    <option value="Gentle pace preferred — porter assistance requested">Gentle pace preferred — porter assistance requested</option>
                    <option value="Sedan-chair / stretcher porter service for gorilla trek">Sedan-chair / stretcher porter service for gorilla trek</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1.5">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={preferences.emergencyContactName}
                    onChange={(e) => setPreferences({ ...preferences, emergencyContactName: e.target.value })}
                    placeholder="e.g. Katherine Reynolds (Spouse / Partner)"
                    className="w-full px-3 py-2.5 bg-[#F7F4ED]/60 border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1.5">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={preferences.emergencyContactPhone}
                    onChange={(e) => setPreferences({ ...preferences, emergencyContactPhone: e.target.value })}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full px-3 py-2.5 bg-[#F7F4ED]/60 border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                  />
                </div>
              </div>

              {/* Passport Expiration Tracking */}
              <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] rounded-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#78634B] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                      Passport Expiration Date Tracker
                    </label>
                    <p className="text-xs text-[#20221F]/70 mb-3 font-light leading-relaxed">
                      Most African wildlife destinations (Uganda, Kenya, Tanzania, Rwanda) strictly require at least <strong>6 months of remaining passport validity</strong> from your date of entry.
                    </p>
                    <input
                      type="date"
                      value={preferences.passportExpiryDate || ''}
                      onChange={(e) => setPreferences({ ...preferences, passportExpiryDate: e.target.value })}
                      className="px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1.5">
                  Special Safari Notes / Preferences
                </label>
                <textarea
                  rows={3}
                  value={preferences.notes || ''}
                  onChange={(e) => setPreferences({ ...preferences, notes: e.target.value })}
                  placeholder="e.g. Interested in birdwatching, professional photography lens bean-bags in cruiser, preferred wine styles..."
                  className="w-full px-3 py-2.5 bg-[#F7F4ED]/60 border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
                />
              </div>

              <div className="pt-4 border-t border-[#D9D0C2] flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: WISHLIST / SAVED EXPERIENCES */}
        {activeTab === 'wishlist' && (
          <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 rounded-sm shadow-sm animate-fadeIn">
            <div className="pb-6 border-b border-[#D9D0C2] mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
                  Curated Safari Wishlist
                </span>
                <h2 className="font-serif text-2xl font-light text-[#20221F]">
                  Saved Experiences & Destinations
                </h2>
              </div>
              <span className="text-xs text-[#20221F]/50">
                {wishlist.length} Saved {wishlist.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-16 text-center max-w-sm mx-auto">
                <Heart className="w-10 h-10 text-[#78634B]/40 mx-auto mb-3" />
                <h3 className="font-serif text-xl text-[#20221F] mb-1">Your wishlist is currently empty</h3>
                <p className="text-xs text-[#20221F]/60 mb-6">
                  Save your favorite safari packages and destinations while exploring our portfolio.
                </p>
                <button
                  onClick={() => onNavigate('/travel-packages')}
                  className="px-6 py-2.5 bg-[#20221F] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#78634B] transition-colors cursor-pointer"
                >
                  Explore Packages
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="border border-[#D9D0C2] bg-[#F7F4ED]/30 rounded-sm overflow-hidden flex flex-col justify-between">
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveWishlistItem(item.itemId)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white hover:text-red-400 flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4 className="font-serif text-lg text-[#20221F] mb-2">{item.title}</h4>
                      <div className="flex items-center justify-between pt-3 border-t border-[#D9D0C2] text-xs">
                        <button
                          onClick={() => onNavigate(`/travel-packages/${item.slug}`)}
                          className="text-[#78634B] hover:text-[#20221F] font-semibold uppercase tracking-wider"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => onNavigate(`/plan-trip?destination=${item.slug}`)}
                          className="px-3 py-1 bg-[#20221F] text-white uppercase tracking-wider font-semibold text-[10px]"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: TRAVEL MEMORIES & PERSONAL MAP */}
        {activeTab === 'memories' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Personal Map */}
            <div className="bg-[#20221F] text-white p-6 sm:p-10 rounded-sm shadow-xl border border-[#B69A68]/30">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
                  Patron Territory Footprint
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-white">
                  Your Personal African Travel Map
                </h2>
                <p className="text-xs text-[#F7F4ED]/70 mt-1">
                  Highlighting completed safari territories and memorable milestones across the continent.
                </p>
              </div>

              <InteractiveTravelMap
                onNavigate={onNavigate}
                highlightedDestinations={memories.map(m => m.country.toLowerCase())}
              />
            </div>

            {/* Travel Memories Feed */}
            <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 rounded-sm shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-[#D9D0C2] mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
                    Personal Field Journal
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#20221F]">
                    Recorded Safari Memories
                  </h3>
                </div>
                <button
                  onClick={() => setAddingMemory(!addingMemory)}
                  className="px-4 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Memory</span>
                </button>
              </div>

              {addingMemory && (
                <form onSubmit={handleAddMemory} className="p-6 bg-[#F7F4ED] border border-[#D9D0C2] rounded-sm mb-6 space-y-4">
                  <h4 className="font-serif text-lg text-[#20221F]">Log Completed Safari Memory</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Destination / Park *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bwindi Gorilla Sanctuary"
                        value={newMemoryDestination}
                        onChange={(e) => setNewMemoryDestination(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Country</label>
                      <select
                        value={newMemoryCountry}
                        onChange={(e) => setNewMemoryCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F]"
                      >
                        <option value="Uganda">Uganda</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Zanzibar">Zanzibar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Year</label>
                      <input
                        type="number"
                        value={newMemoryYear}
                        onChange={(e) => setNewMemoryYear(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Field Notes & Encounters</label>
                    <textarea
                      rows={3}
                      value={newMemoryNotes}
                      onChange={(e) => setNewMemoryNotes(e.target.value)}
                      placeholder="e.g. Encountered the Rushegura gorilla family with 19 individuals. Guides were extraordinary..."
                      className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingMemory(false)}
                      className="px-4 py-2 border border-gray-300 text-xs text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#20221F] text-white text-xs uppercase font-semibold"
                    >
                      Save Memory
                    </button>
                  </div>
                </form>
              )}

              {memories.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#20221F]/60 italic">
                  No memories logged yet. Add your past African trips above to populate your personal travel map.
                </div>
              ) : (
                <div className="space-y-4">
                  {memories.map((m) => (
                    <div key={m.id} className="p-5 border border-[#D9D0C2] bg-[#F7F4ED]/40 rounded-sm flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78634B] block">
                          {m.country} · {m.year}
                        </span>
                        <h4 className="font-serif text-xl text-[#20221F] mb-1">{m.destination}</h4>
                        <p className="text-xs text-[#20221F]/80 leading-relaxed font-light">{m.notes}</p>
                      </div>
                      <span className="text-[11px] text-[#20221F]/50 font-mono shrink-0">
                        {m.travelDates}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: LOYALTY & RETURNING CUSTOMER SYSTEM */}
        {activeTab === 'loyalty' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Loyalty Status Hero Card */}
            <div className="bg-[#20221F] text-white p-8 sm:p-12 rounded-sm shadow-xl border border-[#B69A68]/40 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#B69A68] font-semibold block mb-2">
                    MOS MOS Patron Privilege Program
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-white">
                      {loyalty?.tier || 'Bronze'} Tier
                    </h2>
                    <span className="px-3 py-1 bg-[#B69A68] text-[#20221F] text-xs font-bold uppercase tracking-wider rounded">
                      Verified Member
                    </span>
                  </div>
                  <p className="text-xs text-[#F7F4ED]/70 mt-2 max-w-md font-light">
                    Returning patrons enjoy preferred private vehicle upgrades, complimentary airstrip lounge access, and guaranteed permit priority.
                  </p>
                </div>

                <div className="bg-white/10 p-6 rounded-sm border border-white/15 text-center min-w-[200px]">
                  <span className="text-[10px] uppercase tracking-wider text-[#B69A68] block mb-1">
                    Loyalty Balance
                  </span>
                  <span className="font-serif text-4xl text-white font-light">
                    {loyalty?.points || 500}
                  </span>
                  <span className="text-[11px] text-[#F7F4ED]/60 block mt-1">Expedition Points</span>
                </div>
              </div>

              {/* Referral Code Box */}
              <div className="mt-8 pt-8 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B69A68] font-semibold block">
                    Your Personal Referral Code
                  </span>
                  <p className="text-xs text-[#F7F4ED]/70 font-light">
                    Share with companions. When they complete their first safari, you receive 2,500 bonus points.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm px-4 py-2 bg-black/60 border border-[#B69A68]/50 text-[#B69A68] font-bold tracking-widest rounded-sm">
                    {loyalty?.referralCode || `MOS-${user.uid.slice(0, 5).toUpperCase()}`}
                  </span>
                  <button
                    onClick={copyReferralCode}
                    className="px-4 py-2 bg-[#B69A68] hover:bg-white text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 rounded-sm"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tier Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  tier: 'Bronze',
                  trips: 'Welcome Tier (1st Trip)',
                  points: '500+ pts',
                  perks: ['Personal Safari Concierge', 'Digital Itinerary App', 'Welcome Amenity Kit']
                },
                {
                  tier: 'Silver',
                  trips: '1 Completed Safari',
                  points: '2,500+ pts',
                  perks: ['Complimentary Bush Dinner', 'Entebbe Airstrip Lounge Access', '5% Off Additional Tours']
                },
                {
                  tier: 'Gold',
                  trips: '3 Completed Safaris',
                  points: '8,000+ pts',
                  perks: ['Dedicated Senior Guide Guaranteed', 'Gorilla Permit Advance Priority', 'Complimentary Scenic Flight Upgrade']
                },
                {
                  tier: 'Elite',
                  trips: '5+ Completed Safaris',
                  points: '15,000+ pts',
                  perks: ['Direct Access to Managing Director', 'Private 4x4 Cruiser Sole Use', 'Bespoke Vintage Wine Allocation']
                }
              ].map((t) => {
                const isCurrent = (loyalty?.tier || 'Bronze').toLowerCase() === t.tier.toLowerCase();
                return (
                  <div
                    key={t.tier}
                    className={`p-6 border rounded-sm flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#20221F] text-[#F7F4ED] border-[#B69A68] shadow-lg ring-2 ring-[#B69A68]/30'
                        : 'bg-white text-[#20221F] border-[#D9D0C2]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-serif text-2xl font-light">{t.tier}</h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-[#B69A68] text-[#20221F] text-[9px] uppercase font-bold tracking-wider rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] uppercase font-semibold block mb-1 ${isCurrent ? 'text-[#B69A68]' : 'text-[#78634B]'}`}>
                        {t.trips}
                      </span>
                      <span className="text-xs opacity-60 block mb-4">{t.points}</span>

                      <ul className="space-y-2 text-xs font-light">
                        {t.perks.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={isCurrent ? 'text-[#B69A68]' : 'text-[#78634B]'}>✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: GROUP TRAVEL & SHARED SAFARIS */}
        {activeTab === 'groups' && (
          <div className="bg-white border border-[#D9D0C2] p-6 sm:p-10 rounded-sm shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between pb-6 border-b border-[#D9D0C2] mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
                  Private Group Expeditions
                </span>
                <h2 className="font-serif text-2xl font-light text-[#20221F]">
                  Group Safaris & Companion Invitations
                </h2>
                <p className="text-xs text-[#20221F]/60 mt-1">
                  Organize shared travel with family, friends, or photography clubs while preserving individual privacy.
                </p>
              </div>
              <button
                onClick={() => setCreatingGroup(!creatingGroup)}
                className="px-4 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Group Trip</span>
              </button>
            </div>

            {creatingGroup && (
              <form onSubmit={handleCreateGroupTrip} className="p-6 bg-[#F7F4ED] border border-[#D9D0C2] rounded-sm mb-8 space-y-4">
                <h4 className="font-serif text-lg text-[#20221F]">Create Shared Expedition</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Group Trip Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Reynolds Family Gorilla Safari 2026"
                      value={newGroupTitle}
                      onChange={(e) => setNewGroupTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Destination *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Uganda & Rwanda Primates"
                      value={newGroupDest}
                      onChange={(e) => setNewGroupDest(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Target Dates</label>
                    <input
                      type="text"
                      placeholder="e.g. August 10 - 22, 2026"
                      value={newGroupDates}
                      onChange={(e) => setNewGroupDates(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-[#78634B] mb-1">Shared Group Itinerary Notes</label>
                  <textarea
                    rows={2}
                    value={newGroupNotes}
                    onChange={(e) => setNewGroupNotes(e.target.value)}
                    placeholder="e.g. Private charter flights from Entebbe to Kihihi airstrip, 2 days gorilla habituation..."
                    className="w-full px-3 py-2 bg-white border border-[#D9D0C2] text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatingGroup(false)}
                    className="px-4 py-2 border border-gray-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#20221F] text-white text-xs uppercase font-semibold"
                  >
                    Save Group Expedition
                  </button>
                </div>
              </form>
            )}

            {groupTrips.length === 0 ? (
              <div className="py-16 text-center max-w-sm mx-auto">
                <Users className="w-10 h-10 text-[#78634B]/40 mx-auto mb-3" />
                <h3 className="font-serif text-xl text-[#20221F] mb-1">No group expeditions yet</h3>
                <p className="text-xs text-[#20221F]/60 mb-6 leading-relaxed">
                  Plan a safari with family or companions and invite them by email to access your shared itinerary.
                </p>
                <button
                  onClick={() => setCreatingGroup(true)}
                  className="px-6 py-2.5 bg-[#20221F] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#78634B] transition-colors cursor-pointer"
                >
                  Create Group Trip
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {groupTrips.map((grp) => (
                  <div key={grp.id} className="p-6 border border-[#D9D0C2] bg-[#F7F4ED]/40 rounded-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#78634B] block">
                          Group Lead: {grp.creatorName}
                        </span>
                        <h4 className="font-serif text-xl text-[#20221F]">{grp.tripTitle}</h4>
                        <span className="text-xs text-[#20221F]/70">{grp.destination} · {grp.travelDates}</span>
                      </div>
                      <span className="text-xs text-[#78634B] font-semibold">
                        {grp.invitations.length} Companions Invited
                      </span>
                    </div>

                    {grp.groupNotes && (
                      <p className="text-xs text-[#20221F]/80 italic my-3 bg-white p-3 border border-[#D9D0C2]">
                        "{grp.groupNotes}"
                      </p>
                    )}

                    {/* Invite Friend Form */}
                    <div className="pt-4 border-t border-[#D9D0C2] mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="email"
                        placeholder="Invite companion by email (e.g. friend@example.com)..."
                        value={activeGroupTripId === grp.id ? newInviteEmail : ''}
                        onChange={(e) => {
                          setActiveGroupTripId(grp.id);
                          setNewInviteEmail(e.target.value);
                        }}
                        className="w-full sm:w-80 px-3 py-2 bg-white border border-[#D9D0C2] text-xs text-[#20221F]"
                      />
                      <button
                        type="button"
                        onClick={() => handleInviteToGroup(grp.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase font-semibold cursor-pointer"
                      >
                        Send Group Invite
                      </button>
                    </div>

                    {grp.invitations.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {grp.invitations.map((inv, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-white border border-[#D9D0C2] text-[10px] text-[#20221F] rounded">
                            {inv.email} ({inv.status})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
