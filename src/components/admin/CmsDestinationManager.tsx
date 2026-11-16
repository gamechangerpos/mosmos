import React, { useState, useEffect } from 'react';
import { CmsService } from '../../services/cmsService';
import { Destination, ContentPublicationStatus, DestinationRegion } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Globe, 
  MapPin, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  X, 
  Upload, 
  CheckCircle2, 
  Sun, 
  Compass,
  Layers
} from 'lucide-react';

const REGIONS: DestinationRegion[] = [
  'East Africa', 
  'Southern Africa', 
  'North Africa', 
  'Middle East', 
  'Asia'
];

export const CmsDestinationManager: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentPublicationStatus>('all');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Partial<Destination> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Image Uploading
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Feedback Toast
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await CmsService.getDestinations(true);
      setDestinations(data);
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
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingDestination({
      name: '',
      slug: '',
      country: 'Uganda',
      region: 'East Africa',
      location: 'Albertine Rift',
      tagline: 'Ancient montane rainforests and majestic savanna wildlife.',
      description: '',
      fullDescription: '',
      heroImage: '/images/destinations/uganda.jpg',
      gallery: [],
      keyAttractions: [],
      recommendedExperiences: ['Mountain Gorilla Tracking in Bwindi', 'Kazinga Channel Boat Safari'],
      highlights: ['Mountain Gorillas', 'Tree-Climbing Lions', 'Murchison Falls'],
      bestTimeToVisit: 'June to September & December to February',
      climate: 'Tropical with two dry seasons',
      currency: 'UGX / USD',
      visaInfo: 'Online East Africa Tourist Visa or eVisa required prior to arrival.',
      wildlifeHighlights: ['Mountain Gorillas', 'Chimpanzees', 'Lions', 'Elephants'],
      featured: false,
      status: 'Published'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (dest: Destination) => {
    setEditingDestination({ ...dest });
    setIsEditModalOpen(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination || !editingDestination.name) {
      showFeedback('Destination name is required.', 'error');
      return;
    }

    try {
      const slug = editingDestination.slug || editingDestination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = editingDestination.id || slug;

      const finalDestination: Destination = {
        id,
        slug,
        name: editingDestination.name,
        country: editingDestination.country || editingDestination.name,
        region: (editingDestination.region as DestinationRegion) || 'East Africa',
        location: editingDestination.location || '',
        tagline: editingDestination.tagline || '',
        description: editingDestination.description || '',
        fullDescription: editingDestination.fullDescription || editingDestination.description || '',
        heroImage: editingDestination.heroImage || '/images/destinations/uganda.jpg',
        gallery: editingDestination.gallery || [],
        keyAttractions: editingDestination.keyAttractions || [],
        recommendedExperiences: editingDestination.recommendedExperiences || [],
        highlights: editingDestination.highlights || [],
        bestTimeToVisit: editingDestination.bestTimeToVisit || 'Year-round',
        climate: editingDestination.climate || 'Tropical',
        currency: editingDestination.currency || 'USD',
        visaInfo: editingDestination.visaInfo || 'Valid passport required.',
        wildlifeHighlights: editingDestination.wildlifeHighlights || [],
        featured: Boolean(editingDestination.featured),
        status: editingDestination.status || 'Published',
        createdAt: editingDestination.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await CmsService.saveDestination(finalDestination);
      setIsEditModalOpen(false);
      setEditingDestination(null);
      showFeedback(`Destination "${finalDestination.name}" saved and live on website.`);
      loadData();
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to save destination', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    try {
      await CmsService.deleteDestination(isDeletingId);
      setIsDeletingId(null);
      showFeedback('Destination removed from website.');
      loadData();
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to delete destination', 'error');
    }
  };

  const handleFileUpload = async (file: File, isHero = true) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await CmsService.uploadImage(file, 'destinations');
      if (isHero) {
        setEditingDestination(prev => prev ? { ...prev, heroImage: url } : null);
      } else {
        setEditingDestination(prev => prev ? { 
          ...prev, 
          gallery: [...(prev.gallery || []), url] 
        } : null);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload photograph');
    } finally {
      setIsUploading(false);
    }
  };

  const filtered = destinations.filter(d => {
    const matchesSearch = searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'all' || d.region === selectedRegion;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-[#D9D0C2] shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
            Global Portfolio Content Management
          </span>
          <h2 className="font-serif text-2xl font-light text-[#20221F]">
            Destinations & Countries ({destinations.length})
          </h2>
          <p className="text-xs text-[#20221F]/70 font-light mt-1">
            Add countries, configure destination circuits, upload high-resolution photographs, and publish directly to the live portfolio.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 text-xs flex items-center justify-between border ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
            : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 border border-[#D9D0C2] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#78634B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by country, name, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs pl-9 pr-4 py-2 focus:outline-none focus:border-[#78634B]"
          />
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-[#20221F]/60 uppercase tracking-wider shrink-0 font-medium">Region:</span>
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border ${
              selectedRegion === 'all' 
                ? 'bg-[#20221F] text-white border-[#20221F]' 
                : 'bg-white text-[#20221F]/70 border-[#D9D0C2] hover:bg-[#F7F4ED]'
            }`}
          >
            All
          </button>
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                selectedRegion === r 
                  ? 'bg-[#20221F] text-white border-[#20221F]' 
                  : 'bg-white text-[#20221F]/70 border-[#D9D0C2] hover:bg-[#F7F4ED]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#20221F]/60">
          Loading destinations portfolio...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 bg-white border border-[#D9D0C2] text-center">
          <p className="text-sm font-light text-[#20221F]">No destinations match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => {
            const isDraft = dest.status === 'Draft';
            const isUnpublished = dest.status === 'Unpublished';

            return (
              <div 
                key={dest.id || dest.slug}
                className="bg-white border border-[#D9D0C2] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow relative"
              >
                {/* Status Badges */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs text-white ${
                    isDraft 
                      ? 'bg-amber-600' 
                      : isUnpublished 
                        ? 'bg-gray-600' 
                        : 'bg-emerald-700'
                  }`}>
                    {dest.status || 'Published'}
                  </span>
                  {dest.featured && (
                    <span className="px-2 py-1 text-[9px] uppercase font-bold tracking-wider bg-[#B69A68] text-white">
                      Featured
                    </span>
                  )}
                </div>

                {/* Hero Cover */}
                <div className="relative h-44 bg-[#0f0f0f] overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold">
                    {dest.region}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      {dest.country}
                    </span>
                    <h3 className="font-serif text-xl font-light text-[#20221F] mb-1">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[#20221F]/70 font-light line-clamp-2 mb-3 leading-relaxed">
                      {dest.tagline || dest.description}
                    </p>

                    <div className="text-[11px] text-[#20221F]/60 flex items-center gap-3 mb-4">
                      <span>{dest.gallery?.length || 0} Photographs</span>
                      <span>•</span>
                      <span>{dest.keyAttractions?.length || 0} Key Attractions</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#D9D0C2]">
                    <button
                      onClick={() => handleOpenEdit(dest)}
                      className="py-1.5 px-3 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setIsDeletingId(dest.id || dest.slug)}
                      className="py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-900 border border-rose-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full border border-rose-300 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#20221F] mb-2">Delete Destination?</h3>
            <p className="text-xs text-[#20221F]/70 font-light mb-6">
              Removing this destination will immediately remove it from the public portfolio and navigation listings.
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

      {/* Edit / Create Destination Modal */}
      {isEditModalOpen && editingDestination && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full border border-[#D9D0C2] shadow-2xl my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-[#D9D0C2] flex items-center justify-between bg-[#F7F4ED]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B69A68] font-semibold block">
                  {editingDestination.id ? 'Edit Destination' : 'Add New Destination'}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#20221F]">
                  {editingDestination.name || 'Untitled Destination'}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#20221F]/60 hover:text-[#20221F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Publication Status */}
              <div className="bg-[#F7F4ED] p-4 border border-[#D9D0C2] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase font-semibold text-[#78634B]">Publication Status:</span>
                  {(['Published', 'Draft', 'Unpublished'] as ContentPublicationStatus[]).map(st => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                      <input
                        type="radio"
                        name="dest_status"
                        checked={editingDestination.status === st}
                        onChange={() => setEditingDestination({ ...editingDestination, status: st })}
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#20221F]">
                  <input
                    type="checkbox"
                    checked={Boolean(editingDestination.featured)}
                    onChange={(e) => setEditingDestination({ ...editingDestination, featured: e.target.checked })}
                  />
                  <span>Feature in Homepage Highlights</span>
                </label>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDestination.name || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 font-medium focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Uganda, Masai Mara, Serengeti"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDestination.country || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, country: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Uganda, Kenya, Tanzania"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    URL Slug (Path)
                  </label>
                  <input
                    type="text"
                    value={editingDestination.slug || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, slug: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 font-mono text-[11px] focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. uganda"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Geographic Region
                  </label>
                  <select
                    value={editingDestination.region || 'East Africa'}
                    onChange={(e) => setEditingDestination({ ...editingDestination, region: e.target.value as DestinationRegion })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                  >
                    {REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Location / Key Circuit
                  </label>
                  <input
                    type="text"
                    value={editingDestination.location || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, location: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. Albertine Rift Valley"
                  />
                </div>
              </div>

              {/* Tagline & Descriptions */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Tagline (Subtitle on hero and cards) *
                </label>
                <input
                  type="text"
                  required
                  value={editingDestination.tagline || ''}
                  onChange={(e) => setEditingDestination({ ...editingDestination, tagline: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                  placeholder="e.g. The Pearl of Africa — mist-covered rainforests & mountain gorillas."
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Editorial Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingDestination.description || ''}
                  onChange={(e) => setEditingDestination({ ...editingDestination, description: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs p-3 font-light leading-relaxed focus:outline-none focus:border-[#78634B]"
                  placeholder="Describe the wildlife, scenery, private safari lodges..."
                />
              </div>

              {/* Cover & Gallery Photographs */}
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-[#78634B] block">
                  Cover Image & Gallery Photographs
                </span>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Main Hero Cover Image URL / Path
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingDestination.heroImage || ''}
                      onChange={(e) => setEditingDestination({ ...editingDestination, heroImage: e.target.value })}
                      className="flex-1 bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 font-mono text-[11px] focus:outline-none focus:border-[#78634B]"
                      placeholder="/images/destinations/uganda.jpg or https://..."
                    />
                    <label className="px-3 py-2 bg-[#78634B] hover:bg-[#20221F] text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Cover'}</span>
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

                  {editingDestination.heroImage && (
                    <div className="mt-2 w-48 h-28 bg-[#0f0f0f] border border-[#D9D0C2] overflow-hidden">
                      <img src={editingDestination.heroImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold">
                      Gallery Photographs ({editingDestination.gallery?.length || 0})
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

                  {editingDestination.gallery && editingDestination.gallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {editingDestination.gallery.map((imgUrl, i) => (
                        <div key={i} className="relative h-20 bg-[#0f0f0f] border border-[#D9D0C2] group">
                          <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingDestination.gallery?.filter((_, idx) => idx !== i);
                              setEditingDestination({ ...editingDestination, gallery: updated });
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

              {/* Highlights & Best Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={editingDestination.bestTimeToVisit || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, bestTimeToVisit: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. June to October & December to March"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Visa Information
                  </label>
                  <input
                    type="text"
                    value={editingDestination.visaInfo || ''}
                    onChange={(e) => setEditingDestination({ ...editingDestination, visaInfo: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                    placeholder="e.g. East Africa Tourist Visa or eVisa required"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="p-4 bg-[#F7F4ED] border border-[#D9D0C2] flex items-center justify-end gap-3">
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
                  Save & Publish Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
