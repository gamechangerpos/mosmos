import React, { useState, useEffect } from 'react';
import { NewsletterSubscriber, MarketingCampaign } from '../../types';
import { MarketingService } from '../../services/marketingService';
import { Mail, Send, Users, Sparkles, Check, RefreshCw, FileText, Plus } from 'lucide-react';

export const AdminMarketingManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'campaigns' | 'compose'>('subscribers');
  
  // Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  // Campaigns State
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loadingCamps, setLoadingCamps] = useState(true);

  // Campaign Composer State
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignPreviewText, setCampaignPreviewText] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Wildlife Safaris']);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const loadData = async () => {
    setLoadingSubs(true);
    setLoadingCamps(true);
    const [subList, campList] = await Promise.all([
      MarketingService.getSubscribers(),
      MarketingService.getCampaigns()
    ]);
    setSubscribers(subList);
    setCampaigns(campList);
    setLoadingSubs(false);
    setLoadingCamps(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim() || !campaignSubject.trim() || !campaignBody.trim()) return;

    setIsSending(true);
    try {
      const created = await MarketingService.createCampaign({
        title: campaignTitle.trim(),
        subject: campaignSubject.trim(),
        previewText: campaignPreviewText.trim(),
        bodyHtml: campaignBody.trim(),
        targetTags: selectedTags,
        sentAt: new Date().toISOString(),
        recipientCount: subscribers.filter(s => s.status === 'active').length,
        status: 'sent'
      });

      setCampaigns(prev => [created, ...prev]);
      setSentSuccess(true);
      setCampaignTitle('');
      setCampaignSubject('');
      setCampaignPreviewText('');
      setCampaignBody('');
      setTimeout(() => {
        setSentSuccess(false);
        setActiveSubTab('campaigns');
      }, 2000);
    } finally {
      setIsSending(false);
    }
  };

  const tagOptions = ['Wildlife Safaris', 'Gorilla Trekking', 'Great Migration', 'Luxury Lodges', 'Beach Holidays', 'Conservation'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="bg-white border border-[#D9D0C2] rounded-sm p-6 shadow-sm">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9D0C2] mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#78634B] font-semibold block mb-1">
            Marketing Automation & Patron Engagement
          </span>
          <h3 className="font-serif text-2xl font-light text-[#20221F]">
            Savanna Dispatch & Subscriber Operations
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('subscribers')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer ${
              activeSubTab === 'subscribers'
                ? 'bg-[#20221F] text-white'
                : 'bg-[#F7F4ED] text-[#20221F]/70 hover:bg-[#D9D0C2]'
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('campaigns')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer ${
              activeSubTab === 'campaigns'
                ? 'bg-[#20221F] text-white'
                : 'bg-[#F7F4ED] text-[#20221F]/70 hover:bg-[#D9D0C2]'
            }`}
          >
            Past Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveSubTab('compose')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'compose'
                ? 'bg-[#78634B] text-white'
                : 'bg-[#B69A68]/20 text-[#78634B] hover:bg-[#B69A68]/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose Dispatch</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SUBSCRIBERS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] rounded-sm">
              <span className="text-[10px] uppercase text-[#78634B] font-semibold block">Active Patrons</span>
              <span className="font-serif text-2xl font-bold text-[#20221F]">
                {subscribers.filter(s => s.status === 'active').length}
              </span>
            </div>
            <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] rounded-sm">
              <span className="text-[10px] uppercase text-[#78634B] font-semibold block">Total Registered</span>
              <span className="font-serif text-2xl font-bold text-[#20221F]">
                {subscribers.length}
              </span>
            </div>
            <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] rounded-sm">
              <span className="text-[10px] uppercase text-[#78634B] font-semibold block">Automated Dispatch</span>
              <span className="text-xs font-semibold text-emerald-800 block mt-1">
                Active & Synchronized
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#D9D0C2]">
              <thead className="bg-[#20221F] text-[#F7F4ED] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Subscriber Email</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Interest Tags</th>
                  <th className="p-3">Date Subscribed</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D0C2]">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F7F4ED]/50">
                    <td className="p-3 font-medium text-[#20221F]">{sub.email}</td>
                    <td className="p-3 text-[#20221F]/70">{sub.name || '—'}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {sub.interestTags?.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#F7F4ED] border border-[#D9D0C2] text-[10px] rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-[#20221F]/50 font-mono text-[11px]">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                        sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PAST CAMPAIGNS */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#20221F]/50 italic">
              No marketing campaigns broadcast yet.
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-5 border border-[#D9D0C2] bg-[#F7F4ED]/30 rounded-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="font-serif text-lg font-light text-[#20221F]">
                      {camp.title}
                    </h4>
                    <span className="text-[11px] text-[#78634B] font-mono">
                      Sent {new Date(camp.sentAt || camp.createdAt).toLocaleDateString()} · {camp.recipientCount || 0} Patrons
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#20221F]/80 mb-1">
                    Subject: {camp.subject}
                  </p>
                  <p className="text-xs text-[#20221F]/60 line-clamp-2 font-light">
                    {camp.previewText}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {camp.targetTags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-[#D9D0C2] text-[10px] text-[#78634B]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: COMPOSE DISPATCH */}
      {activeSubTab === 'compose' && (
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Marketing campaign dispatched successfully to active subscribers!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                Internal Campaign Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2026 Great Migration Advance Access"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F4ED]/50 border border-[#D9D0C2] text-xs text-[#20221F]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
                Email Subject Line *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Private Booking Window: Serengeti River Crossing 2026"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F4ED]/50 border border-[#D9D0C2] text-xs text-[#20221F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
              Preview Snippet Text
            </label>
            <input
              type="text"
              placeholder="e.g. Exclusive lodge permits now unlocked for MOS MOS patrons."
              value={campaignPreviewText}
              onChange={(e) => setCampaignPreviewText(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F4ED]/50 border border-[#D9D0C2] text-xs text-[#20221F]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
              Target Audience Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-[#20221F] text-[#B69A68] font-semibold'
                      : 'bg-[#F7F4ED] text-[#20221F] border border-[#D9D0C2]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78634B] font-semibold mb-1">
              Campaign Content (HTML / Text) *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Enter expedition announcement details, private links, and seasonal booking windows..."
              value={campaignBody}
              onChange={(e) => setCampaignBody(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F4ED]/50 border border-[#D9D0C2] text-xs text-[#20221F] font-mono"
            />
          </div>

          <div className="pt-3 border-t border-[#D9D0C2] flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Campaign'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
