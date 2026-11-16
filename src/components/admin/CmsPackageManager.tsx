import React, { useState, useEffect } from 'react';
import { CmsService } from '../../services/cmsService';
import { TravelPackage, ContentPublicationStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Eye, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  X, 
  Upload, 
  Calendar, 
  Globe, 
  Tag, 
  CheckCircle2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const CmsPackageManager: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentPublicationStatus>('all');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TravelPackage> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Quick Price Edit Modal
  const [quickPricePkg, setQuickPricePkg] = useState<TravelPackage | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);
  const [quickCurrency, setQuickCurrency] = useState('USD');
  const [quickPriceType, setQuickPriceType] = useState('per guest');

  // Image Uploading State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Notifications
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await CmsService.getPackages(true);
      setPackages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = CmsService.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPackage({
      title: '',
      slug: '',
      country: 'Uganda',
      destination: 'Uganda',
      destinations: ['Uganda'],
      location: '',
      duration: '7 Days / 6 Nights',
      daysCount: 7,
      nightsCount: 6,
      category: 'Wildlife & Primates',
      indicativePrice: 3500,
      currency: 'USD',
      priceType: 'per guest',
      priceNote: 'Indicative per person based on 2 guests sharing',
      overview: '',
      fullDescription: '',
      heroImage: '/images/destinations/uganda.jpg',
      gallery: [],
      highlights: ['Mountain Gorilla Tracking', 'Chimpanzee Habituation', 'Savanna Game Drives'],
      inclusions: ['All national park fees', 'Full board lodge accommodation', 'Private 4x4 safari vehicle with guide'],
      exclusions: ['International flights', 'Entry visas', 'Travel insurance', 'Personal gratuities'],
      status: 'Published',
      featured: false
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pkg: TravelPackage) => {
    setEditingPackage({ ...pkg });
    setIsEditModalOpen(true);
  };

  // Save Package Form
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editingPackage.title) {
      showFeedback('Package title is required.', 'error');
      return;
    }

    try {
      const slug = editingPackage.slug || editingPackage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = editingPackage.id || slug;

      const finalPackage: TravelPackage = {
        id,
        slug,
        title: editingPackage.title,
        country: editingPackage.country || (editingPackage.destinations?.[0] || 'Uganda'),
        destination: editingPackage.destination || (editingPackage.destinations?.[0] || 'Uganda'),
        destinations: editingPackage.destinations && editingPackage.destinations.length > 0 ? editingPackage.destinations : [editingPackage.country || 'Uganda'],
        location: editingPackage.location || '',
        duration: editingPackage.duration || `${editingPackage.daysCount || 7} Days / ${editingPackage.nightsCount || 6} Nights`,
        daysCount: editingPackage.daysCount || 7,
        nightsCount: editingPackage.nightsCount || 6,
        category: editingPackage.category || 'Wildlife Safari',
        indicativePrice: Number(editingPackage.indicativePrice) || 0,
        currency: editingPackage.currency || 'USD',
        priceType: editingPackage.priceType || 'per guest',
        priceNote: editingPackage.priceNote || 'Indicative per person based on 2 guests sharing',
        overview: editingPackage.overview || '',
        fullDescription: editingPackage.fullDescription || editingPackage.overview || '',
        heroImage: editingPackage.heroImage || '/images/destinations/uganda.jpg',
        gallery: editingPackage.gallery || [],
        highlights: editingPackage.highlights || [],
        inclusions: editingPackage.inclusions || [],
        exclusions: editingPackage.exclusions || [],
        status: editingPackage.status || 'Published',
        featured: Boolean(editingPackage.featured),
        createdAt: editingPackage.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await CmsService.savePackage(finalPackage);
      setIsEditModalOpen(false);
      setEditingPackage(null);
      showFeedback(`Package "${finalPackage.title}" saved and published to website.`);
      loadData();
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to save package', 'error');
    }
  };

  // Quick Price Update
  const handleOpenQuickPrice = (pkg: TravelPackage) => {
    setQuickPricePkg(pkg);
    setQuickPriceVal(pkg.indicativePrice || 0);
    setQuickCurrency(pkg.currency || 'USD');
    setQuickPriceType(pkg.priceType || 'per guest');
  };

  const handleSaveQuickPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPricePkg) return;

    try {
      await CmsService.updatePackagePrice(
        quickPricePkg.id, 
        Number(quickPriceVal), 
        quickCurrency, 
        quickPriceType
      );
      setQuickPricePkg(null);
      showFeedback(`Updated price for "${quickPricePkg.title}" to ${quickCurrency} $${quickPriceVal.toLocaleString()}.`);
      loadData();
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to update price', 'error');
    }
  };

  // Delete Package
  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    try {
      await CmsService.deletePackage(isDeletingId);
      setIsDeletingId(null);
      showFeedback('Package successfully removed from website.');
      loadData();
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to delete package', 'error');
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (file: File, isHero = true) => {
    setIsUploadingImage(true);
    setUploadError(null);
    try {
      const url = await CmsService.uploadImage(file, 'packages');
      if (isHero) {
        setEditingPackage(prev => prev ? { ...prev, heroImage: url } : null);
      } else {
        setEditingPackage(prev => prev ? { 
          ...prev, 
          gallery: [...(prev.gallery || []), url] 
        } : null);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload photograph');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const filteredPackages = packages.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.destinations && p.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-[#D9D0C2] shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
            Live Website Content Management
          </span>
          <h2 className="font-serif text-2xl font-light text-[#20221F]">
            Tour & Travel Packages ({packages.length})
          </h2>
          <p className="text-xs text-[#20221F]/70 font-light mt-1">
            Create, edit descriptions, adjust prices, manage photographs, and publish directly to the public website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Travel Package</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className={`p-4 text-xs flex items-center justify-between border ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
            : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-current opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#D9D0C2] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#78634B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search packages by title, destination, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs pl-9 pr-4 py-2 focus:outline-none focus:border-[#78634B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] text-[#20221F]/60 uppercase tracking-wider shrink-0 font-medium">Status:</span>
          {(['all', 'Published', 'Draft', 'Unpublished'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border ${
                statusFilter === st 
                  ? 'bg-[#20221F] text-white border-[#20221F]' 
                  : 'bg-white text-[#20221F]/70 border-[#D9D0C2] hover:bg-[#F7F4ED]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#20221F]/60">
          Loading travel packages from database...
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="p-12 bg-white border border-[#D9D0C2] text-center">
          <p className="text-sm font-light text-[#20221F]">No travel packages match your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isDraft = pkg.status === 'Draft';
            const isUnpublished = pkg.status === 'Unpublished';

            return (
              <div 
                key={pkg.id || pkg.slug}
                className="bg-white border border-[#D9D0C2] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow relative"
              >
                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs text-white ${
                    isDraft 
                      ? 'bg-amber-600' 
                      : isUnpublished 
                        ? 'bg-gray-600' 
                        : 'bg-emerald-700'
                  }`}>
                    {pkg.status || 'Published'}
                  </span>
                  {pkg.featured && (
                    <span className="px-2 py-1 text-[9px] uppercase font-bold tracking-wider bg-[#B69A68] text-white">
                      Featured
                    </span>
                  )}
                </div>

                {/* Cover Image */}
                <div className="relative h-48 bg-[#0f0f0f] overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold">
                    {pkg.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#78634B] font-semibold uppercase tracking-wider mb-1">
                      <span>{pkg.category}</span>
                      <span>{pkg.destinations?.join(', ')}</span>
                    </div>

                    <h3 className="font-serif text-lg font-light text-[#20221F] mb-2 leading-snug line-clamp-2">
                      {pkg.title}
                    </h3>

                    <p className="text-xs text-[#20221F]/70 font-light line-clamp-2 mb-4 leading-relaxed">
                      {pkg.overview}
                    </p>
                  </div>

                  {/* Price Bar & Controls */}
                  <div className="pt-3 border-t border-[#D9D0C2] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 block">Current Public Price</span>
                        <div className="font-serif text-xl font-bold text-[#20221F] flex items-baseline gap-1">
                          <span>${pkg.indicativePrice?.toLocaleString() || 'Quote on Request'}</span>
                          <span className="text-xs font-normal text-[#20221F]/60">/{pkg.priceType || 'guest'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenQuickPrice(pkg)}
                        className="px-2.5 py-1 text-[11px] bg-[#F7F4ED] hover:bg-[#78634B] hover:text-white text-[#78634B] border border-[#D9D0C2] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="Update Price"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Edit Price</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D9D0C2]/50">
                      <button
                        onClick={() => handleOpenEdit(pkg)}
                        className="py-1.5 px-3 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Content</span>
                      </button>

                      <button
                        onClick={() => setIsDeletingId(pkg.id || pkg.slug)}
                        className="py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-900 border border-rose-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* QUICK PRICE UPDATE MODAL                                              */}
      {/* ===================================================================== */}
      {quickPricePkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-[#D9D0C2] shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9D0C2] mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B69A68] font-semibold block">Instant Price Adjustment</span>
                <h3 className="font-serif text-xl font-light text-[#20221F]">{quickPricePkg.title}</h3>
              </div>
              <button onClick={() => setQuickPricePkg(null)} className="text-[#20221F]/60 hover:text-[#20221F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Indicative Price (Numeric)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-serif text-sm text-[#20221F]/50">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={quickPriceVal}
                    onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-sm pl-7 pr-3 py-2 font-serif font-bold text-[#20221F] focus:outline-none focus:border-[#78634B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">Currency</label>
                  <select
                    value={quickCurrency}
                    onChange={(e) => setQuickCurrency(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="UGX">UGX (USh)</option>
                    <option value="KES">KES (KSh)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">Price Basis</label>
                  <select
                    value={quickPriceType}
                    onChange={(e) => setQuickPriceType(e.target.value)}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                  >
                    <option value="per guest">per guest</option>
                    <option value="per group">per group</option>
                    <option value="per couple">per couple</option>
                    <option value="per night">per night</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-[#20221F]/60 font-light leading-relaxed">
                Saving will immediately push this new price live to the public travel packages page, destination cards, and detail inquiry forms.
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D9D0C2]">
                <button
                  type="button"
                  onClick={() => setQuickPricePkg(null)}
                  className="px-4 py-2 border border-[#D9D0C2] text-xs uppercase font-semibold text-[#20221F]/70 hover:bg-[#F7F4ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase font-semibold tracking-wider transition-colors"
                >
                  Save & Publish Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                             */}
      {/* ===================================================================== */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full border border-rose-300 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#20221F] mb-2">Delete Travel Package?</h3>
            <p className="text-xs text-[#20221F]/70 font-light mb-6">
              Are you sure you want to permanently remove this package? It will no longer appear on the public website.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 border border-[#D9D0C2] text-xs font-semibold uppercase text-[#20221F]/70 hover:bg-[#F7F4ED]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* COMPLETE CREATE / EDIT MODAL                                          */}
      {/* ===================================================================== */}
      {isEditModalOpen && editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full border border-[#D9D0C2] shadow-2xl my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#D9D0C2] flex items-center justify-between bg-[#F7F4ED]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B69A68] font-semibold block">
                  {editingPackage.id ? 'Edit Travel Package' : 'Create New Travel Package'}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#20221F]">
                  {editingPackage.title || 'Untitled Safari Package'}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#20221F]/60 hover:text-[#20221F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSavePackage} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Publication Status & Visibility */}
              <div className="bg-[#F7F4ED] p-4 border border-[#D9D0C2] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase font-semibold text-[#78634B]">Publication Status:</span>
                  {(['Published', 'Draft', 'Unpublished'] as ContentPublicationStatus[]).map(st => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                      <input
                        type="radio"
                        name="status"
                        checked={editingPackage.status === st}
                        onChange={() => setEditingPackage({ ...editingPackage, status: st })}
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#20221F]">
                  <input
                    type="checkbox"
                    checked={Boolean(editingPackage.featured)}
                    onChange={(e) => setEditingPackage({ ...editingPackage, featured: e.target.checked })}
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPackage.title || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 font-medium focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Tanzania Serengeti & Zanzibar Escape"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    URL Slug (Unique path)
                  </label>
                  <input
                    type="text"
                    value={editingPackage.slug || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, slug: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 font-mono text-[11px] focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. tanzania-serengeti-zanzibar"
                  />
                </div>
              </div>

              {/* Destination, Country & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPackage.country || ''}
                    onChange={(e) => setEditingPackage({ 
                      ...editingPackage, 
                      country: e.target.value,
                      destinations: [e.target.value]
                    })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Uganda, Tanzania, Kenya"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Specific Location / Circuit
                  </label>
                  <input
                    type="text"
                    value={editingPackage.location || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, location: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Serengeti, Ngorongoro & Stone Town"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editingPackage.category || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Wildlife & Primates, Bush & Beach"
                  />
                </div>
              </div>

              {/* Duration & Days */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Duration Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPackage.duration || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. 10 Days / 9 Nights"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingPackage.daysCount || 7}
                    onChange={(e) => setEditingPackage({ ...editingPackage, daysCount: Number(e.target.value) })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Number of Nights
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingPackage.nightsCount || 6}
                    onChange={(e) => setEditingPackage({ ...editingPackage, nightsCount: Number(e.target.value) })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                  />
                </div>
              </div>

              {/* Pricing Section (Highlighted) */}
              <div className="p-4 bg-[#F7F4ED] border border-[#B69A68]/40 space-y-3">
                <span className="text-xs uppercase font-bold text-[#78634B] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#B69A68]" />
                  <span>Public Pricing Configuration (Live Editable)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Price Amount ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      required
                      value={editingPackage.indicativePrice || 0}
                      onChange={(e) => setEditingPackage({ ...editingPackage, indicativePrice: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D9D0C2] text-xs px-3 py-2 font-serif font-bold focus:outline-none focus:border-[#78634B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Currency
                    </label>
                    <select
                      value={editingPackage.currency || 'USD'}
                      onChange={(e) => setEditingPackage({ ...editingPackage, currency: e.target.value })}
                      className="w-full bg-white border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="UGX">UGX (USh)</option>
                      <option value="KES">KES (KSh)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Price Type
                    </label>
                    <input
                      type="text"
                      value={editingPackage.priceType || 'per guest'}
                      onChange={(e) => setEditingPackage({ ...editingPackage, priceType: e.target.value })}
                      className="w-full bg-white border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                      placeholder="e.g. per guest, per group"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Price Note (Displayed in small subtitle under price)
                  </label>
                  <input
                    type="text"
                    value={editingPackage.priceNote || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, priceNote: e.target.value })}
                    className="w-full bg-white border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Indicative per person based on 2 guests sharing"
                  />
                </div>
              </div>

              {/* Cover Photograph & Gallery */}
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-[#78634B] block">
                  Photographs & Media Gallery
                </span>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Main Cover Image URL / Path
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingPackage.heroImage || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, heroImage: e.target.value })}
                      className="flex-1 bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 font-mono text-[11px] focus:outline-none focus:border-[#78634B]"
                      placeholder="/images/destinations/uganda.jpg or https://..."
                    />
                    <label className="px-3 py-2 bg-[#78634B] hover:bg-[#20221F] text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Cover'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, true);
                        }}
                      />
                    </label>
                  </div>
                  {uploadError && <span className="text-[11px] text-rose-700 mt-1 block">{uploadError}</span>}

                  {/* Preview Cover */}
                  {editingPackage.heroImage && (
                    <div className="mt-2 w-48 h-28 bg-[#0f0f0f] border border-[#D9D0C2] overflow-hidden">
                      <img
                        src={editingPackage.heroImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Gallery Images */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                      Gallery Images ({editingPackage.gallery?.length || 0})
                    </label>
                    <label className="text-[11px] text-[#78634B] font-semibold hover:underline cursor-pointer flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Gallery Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, false);
                        }}
                      />
                    </label>
                  </div>

                  {editingPackage.gallery && editingPackage.gallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {editingPackage.gallery.map((imgUrl, i) => (
                        <div key={i} className="relative h-20 bg-[#0f0f0f] border border-[#D9D0C2] group">
                          <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingPackage.gallery?.filter((_, idx) => idx !== i);
                              setEditingPackage({ ...editingPackage, gallery: updated });
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-rose-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Short Overview (Appears on cards & teasers) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingPackage.overview || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, overview: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-3 font-light leading-relaxed focus:outline-none focus:border-[#78634B]"
                  placeholder="Provide a 2-3 sentence overview of this itinerary..."
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Full Detailed Description (Appears on package detail page)
                </label>
                <textarea
                  rows={5}
                  value={editingPackage.fullDescription || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, fullDescription: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-3 font-light leading-relaxed focus:outline-none focus:border-[#78634B]"
                  placeholder="Provide comprehensive editorial detailing the journey, safari activities, accommodations..."
                />
              </div>

              {/* Highlights List */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Package Highlights (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={editingPackage.highlights?.join('\n') || ''}
                  onChange={(e) => setEditingPackage({
                    ...editingPackage,
                    highlights: e.target.value.split('\n').filter(Boolean)
                  })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-3 font-light leading-relaxed focus:outline-none focus:border-[#78634B]"
                  placeholder="Guaranteed Bwindi Gorilla permit&#10;Kazinga Channel boat safari&#10;Tree-climbing lions in Ishasha"
                />
              </div>

              {/* Inclusions and Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Included Services (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editingPackage.inclusions?.join('\n') || ''}
                    onChange={(e) => setEditingPackage({
                      ...editingPackage,
                      inclusions: e.target.value.split('\n').filter(Boolean)
                    })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-3 font-light leading-relaxed focus:outline-none focus:border-[#78634B]"
                    placeholder="All park entrance fees&#10;Full board luxury accommodation&#10;Private 4x4 safari vehicle"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Excluded Services (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editingPackage.exclusions?.join('\n') || ''}
                    onChange={(e) => setEditingPackage({
                      ...editingPackage,
                      exclusions: e.target.value.split('\n').filter(Boolean)
                    })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-3 font-light leading-relaxed focus:outline-none focus:border-[#78634B]"
                    placeholder="International flights&#10;Visa fees&#10;Personal tips and gratuities"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] flex items-center justify-between">
                <span className="text-[11px] text-[#20221F]/60">
                  Status will be: <strong className="text-[#20221F]">{editingPackage.status || 'Published'}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-[#D9D0C2] text-xs uppercase font-semibold text-[#20221F]/70 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase font-semibold tracking-wider transition-colors shadow"
                  >
                    Save & Publish to Website
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
