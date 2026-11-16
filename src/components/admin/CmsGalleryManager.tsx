import React, { useState, useEffect } from 'react';
import { CmsService } from '../../services/cmsService';
import { GalleryMediaItem, Destination, TravelPackage } from '../../types';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Filter, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink 
} from 'lucide-react';

export const CmsGalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryMediaItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  // New Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [targetType, setTargetType] = useState<'destination' | 'package' | 'tour' | 'stay' | 'general'>('destination');
  const [targetId, setTargetId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gal, dests, pkgs] = await Promise.all([
        CmsService.getGalleryItems(),
        CmsService.getDestinations(true),
        CmsService.getPackages(true)
      ]);
      setItems(gal);
      setDestinations(dests);
      setPackages(pkgs);
      if (dests.length > 0 && !targetId) {
        setTargetId(dests[0].slug);
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      if (!imageTitle) {
        setImageTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a photo file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Upload to storage or generate optimized image data
      const uploadedUrl = await CmsService.uploadImage(selectedFile, targetType);

      // Find target name for display
      let targetName = '';
      if (targetType === 'destination') {
        const dest = destinations.find(d => d.slug === targetId || d.id === targetId);
        targetName = dest ? dest.name : targetId;
      } else if (targetType === 'package') {
        const pkg = packages.find(p => p.slug === targetId || p.id === targetId);
        targetName = pkg ? pkg.title : targetId;
      }

      // 2. Save gallery record
      const newRecord: GalleryMediaItem = {
        id: `gal-${Date.now()}`,
        title: imageTitle || selectedFile.name,
        caption: imageCaption || undefined,
        url: uploadedUrl,
        thumbnailUrl: uploadedUrl,
        targetType,
        targetId: targetId || undefined,
        targetName: targetName || undefined,
        createdAt: new Date().toISOString(),
        order: items.length
      };

      await CmsService.saveGalleryItem(newRecord);

      // 3. If target is a destination or package, also append to its gallery array
      if (targetType === 'destination' && targetId) {
        const dest = destinations.find(d => d.slug === targetId || d.id === targetId);
        if (dest) {
          const updatedDest = {
            ...dest,
            gallery: [...(dest.gallery || []), uploadedUrl]
          };
          await CmsService.saveDestination(updatedDest);
        }
      } else if (targetType === 'package' && targetId) {
        const pkg = packages.find(p => p.slug === targetId || p.id === targetId);
        if (pkg) {
          const updatedPkg = {
            ...pkg,
            gallery: [...(pkg.gallery || []), uploadedUrl]
          };
          await CmsService.savePackage(updatedPkg);
        }
      }

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageTitle('');
      setImageCaption('');
      showFeedback('Photograph uploaded and associated successfully.');
      loadData();
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await CmsService.deleteGalleryItem(id);
      showFeedback('Photograph removed from gallery.');
      loadData();
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to delete photo', 'error');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Update orders
    reordered.forEach((item, i) => {
      item.order = i;
      CmsService.saveGalleryItem(item);
    });

    setItems(reordered);
  };

  const filteredItems = items.filter(item => {
    if (filterType === 'all') return true;
    return item.targetType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[#D9D0C2] shadow-sm">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-1">
          Asset & Media Management
        </span>
        <h2 className="font-serif text-2xl font-light text-[#20221F]">
          Destination Gallery & Photograph Manager ({items.length})
        </h2>
        <p className="text-xs text-[#20221F]/70 font-light mt-1">
          Upload authentic photographs, preview them, tag them by destination or package, and reorder gallery displays.
        </p>
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

      {/* Uploader Card */}
      <div className="bg-white p-6 border border-[#D9D0C2] shadow-sm">
        <h3 className="font-serif text-lg font-light text-[#20221F] mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#78634B]" />
          <span>Upload & Associate New Photograph</span>
        </h3>

        <form onSubmit={handleUploadAndSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* File drop / picker */}
            <div className="md:col-span-1">
              <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Select Photo File (JPEG, PNG, WebP) *
              </label>
              <div className="border-2 border-dashed border-[#D9D0C2] p-4 text-center hover:border-[#78634B] transition-colors bg-[#F7F4ED] flex flex-col items-center justify-center min-h-[160px]">
                {previewUrl ? (
                  <div className="relative w-full h-32 bg-[#0f0f0f] overflow-hidden">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-[#78634B]/60 mb-2" />
                    <span className="text-xs text-[#20221F]/70 font-light block mb-2">
                      Click to choose or drag photo here
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-[#20221F]/70 file:mr-2 file:py-1 file:px-2 file:border-0 file:bg-[#20221F] file:text-white file:text-xs file:cursor-pointer cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Metadata fields */}
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                    Associate With Section *
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setTargetType(t);
                      if (t === 'destination' && destinations.length > 0) setTargetId(destinations[0].slug);
                      if (t === 'package' && packages.length > 0) setTargetId(packages[0].slug);
                    }}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                  >
                    <option value="destination">Destination</option>
                    <option value="package">Travel Package</option>
                    <option value="general">General Media / Homepage</option>
                  </select>
                </div>

                {targetType === 'destination' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Choose Destination *
                    </label>
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                    >
                      {destinations.map(d => (
                        <option key={d.slug} value={d.slug}>{d.name} ({d.country})</option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === 'package' && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      Choose Package *
                    </label>
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none"
                    >
                      {packages.map(p => (
                        <option key={p.slug} value={p.slug}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Photograph Title
                </label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                  placeholder="e.g. Bwindi Gorilla Silverback Close-up"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                  Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 focus:outline-none focus:border-[#78634B]"
                  placeholder="e.g. Captured during early morning primate trek in the southern sector"
                />
              </div>

              {uploadError && (
                <div className="text-[11px] text-rose-700 bg-rose-50 p-2 border border-rose-200">
                  {uploadError}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className={`px-5 py-2 text-xs uppercase font-semibold tracking-wider text-white transition-colors flex items-center gap-2 ${
                    isUploading || !selectedFile 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#20221F] hover:bg-[#78634B] cursor-pointer'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Encoding & Saving...' : 'Save Photograph'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Gallery Filter & Grid */}
      <div className="bg-white p-4 border border-[#D9D0C2] flex items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-semibold uppercase text-[#78634B]">Filter Gallery:</span>
        <div className="flex items-center gap-2">
          {['all', 'destination', 'package', 'general'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs uppercase font-semibold tracking-wider border transition-colors cursor-pointer ${
                filterType === t 
                  ? 'bg-[#20221F] text-white border-[#20221F]' 
                  : 'bg-white text-[#20221F]/70 border-[#D9D0C2] hover:bg-[#F7F4ED]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#20221F]/60">
          Loading gallery records...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 bg-white border border-[#D9D0C2] text-center">
          <p className="text-sm font-light text-[#20221F]">No photographs found. Upload a photo above to populate the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id}
              className="bg-white border border-[#D9D0C2] overflow-hidden flex flex-col shadow-sm group hover:shadow-md transition-shadow"
            >
              <div className="relative h-44 bg-[#0f0f0f] overflow-hidden">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold">
                  {item.targetType}
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#20221F] truncate mb-0.5" title={item.title}>
                    {item.title}
                  </h4>
                  {item.targetName && (
                    <span className="text-[10px] text-[#78634B] uppercase tracking-wider block mb-1">
                      {item.targetName}
                    </span>
                  )}
                  {item.caption && (
                    <p className="text-[11px] text-[#20221F]/70 font-light line-clamp-1 mb-2">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                  {/* Reorder arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-[#F7F4ED] disabled:opacity-30 cursor-pointer"
                      title="Move up in order"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 hover:bg-[#F7F4ED] disabled:opacity-30 cursor-pointer"
                      title="Move down in order"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="p-1.5 hover:bg-[#F7F4ED] text-[#20221F]/70 hover:text-[#20221F] cursor-pointer"
                      title="Copy Image URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 hover:bg-rose-50 text-rose-700 cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
