import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  MapPin, 
  Calendar, 
  Camera, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { GalleryService } from '../services/galleryService';
import { GalleryStory } from '../types';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [stories, setStories] = useState<GalleryStory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Full-screen Lightbox Modal state
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeImageSubIndex, setActiveImageSubIndex] = useState<number>(0);

  useEffect(() => {
    GalleryService.getStories().then((data) => {
      setStories(data);
      setLoading(false);
    });
  }, []);

  const countries = ['All', 'Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Botswana', 'Zanzibar'];
  const categories = ['All', 'Wildlife', 'Safari', 'Gorilla Trekking', 'Beach', 'Luxury Lodges'];
  const years = ['All', '2026', '2025', '2024'];

  const filteredStories = stories.filter((story) => {
    if (selectedCountry !== 'All' && story.country.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'All' && story.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedYear !== 'All' && story.year.toString() !== selectedYear) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchDest = story.destination.toLowerCase().includes(q);
      const matchStory = story.story.toLowerCase().includes(q);
      const matchCaption = story.caption?.toLowerCase().includes(q);
      if (!matchTitle && !matchDest && !matchStory && !matchCaption) {
        return false;
      }
    }
    return true;
  });

  const activeStory = activeStoryIndex !== null ? filteredStories[activeStoryIndex] : null;

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setActiveImageSubIndex(0);
    }
  };

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < filteredStories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setActiveImageSubIndex(0);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F7F4ED] min-h-screen text-[#20221F]">
      
      {/* Hero Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mb-12">
        <div className="bg-[#20221F] text-[#F7F4ED] p-8 sm:p-14 rounded-lg relative overflow-hidden shadow-2xl">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #B69A68 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-[#B69A68]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B69A68] font-semibold">
                Photographic Archive & Field Essays
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mb-4">
              The Living African Chronicle
            </h1>
            <p className="text-xs sm:text-sm text-[#F7F4ED]/80 leading-relaxed font-light">
              Glimpse genuine moments from our expeditions across the Great Rift Valley, mountain gorilla canopies, and boundless savanna plains. Each frame preserves an authentic encounter with wild nature.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mb-10">
        <div className="bg-white border border-[#D9D0C2] p-4 sm:p-6 shadow-sm rounded-sm space-y-4">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#78634B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search expeditions by wildlife, region, or park..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F7F4ED]/50 border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Calendar className="w-3.5 h-3.5 text-[#78634B]" />
              <span className="text-[11px] uppercase tracking-wider text-[#78634B] font-semibold whitespace-nowrap">
                Year:
              </span>
              <div className="flex items-center gap-1">
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-[#20221F] text-[#B69A68] font-semibold'
                        : 'bg-[#F7F4ED] text-[#20221F]/70 hover:bg-[#D9D0C2]'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Country & Category Tags Filter */}
          <div className="pt-2 border-t border-[#D9D0C2] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            {/* Countries */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold mr-1">
                Territory:
              </span>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer text-xs ${
                    selectedCountry === c
                      ? 'bg-[#78634B] text-white font-semibold'
                      : 'bg-[#F7F4ED] hover:bg-[#D9D0C2] text-[#20221F]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer text-xs ${
                    selectedCategory === cat
                      ? 'bg-[#20221F] text-[#B69A68] font-semibold'
                      : 'bg-[#F7F4ED] hover:bg-[#D9D0C2] text-[#20221F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-[#78634B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#78634B]">Loading field photo chronicle...</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="bg-white border border-[#D9D0C2] p-12 text-center my-8">
            <Camera className="w-8 h-8 text-[#78634B] mx-auto mb-3 opacity-40" />
            <h3 className="font-serif text-xl text-[#20221F] mb-1">No expedition photos found</h3>
            <p className="text-xs text-[#20221F]/60 max-w-sm mx-auto mb-4">
              Try adjusting your country or category filters to view other field archives.
            </p>
            <button
              onClick={() => {
                setSelectedCountry('All');
                setSelectedCategory('All');
                setSelectedYear('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#20221F] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story, index) => (
              <div
                key={story.id}
                className="group bg-white border border-[#D9D0C2] rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Photo with hover zoom and lightbox launcher */}
                <div 
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setActiveStoryIndex(index);
                    setActiveImageSubIndex(0);
                  }}
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-4 py-2 bg-[#20221F]/90 text-white text-[11px] uppercase tracking-wider font-semibold flex items-center gap-2 backdrop-blur-sm rounded">
                      <Maximize2 className="w-3.5 h-3.5 text-[#B69A68]" />
                      <span>View Full Lightbox</span>
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#20221F]/90 backdrop-blur-sm text-[#B69A68] text-[10px] uppercase tracking-wider font-semibold rounded">
                      {story.category}
                    </span>
                    {story.year && (
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#20221F] text-[10px] font-semibold rounded">
                        {story.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Story Details Card */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#78634B] mb-2 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{story.destination}, {story.country}</span>
                    </div>

                    <h3 className="font-serif text-xl font-light text-[#20221F] mb-2 group-hover:text-[#78634B] transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-xs text-[#20221F]/70 line-clamp-3 leading-relaxed font-light mb-4">
                      {story.story}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs">
                    {story.photographer ? (
                      <span className="text-[10px] text-[#20221F]/50 italic">
                        Photo: {story.photographer}
                      </span>
                    ) : <span />}

                    {story.relatedPackageSlug && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/travel-packages/${story.relatedPackageSlug}`);
                        }}
                        className="text-[#78634B] hover:text-[#20221F] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <span>Related Safari</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen Lightbox Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B69A68] font-semibold block">
                {activeStory.country} · {activeStory.category} · {activeStory.year}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-light text-white">
                {activeStory.title}
              </h2>
            </div>

            <button
              onClick={() => setActiveStoryIndex(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image Viewer with Nav buttons */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {activeStoryIndex !== null && activeStoryIndex > 0 && (
              <button
                onClick={handlePrevStory}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#B69A68] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="max-w-5xl max-h-[70vh] flex flex-col items-center justify-center">
              <img
                src={
                  activeStory.images && activeStory.images[activeImageSubIndex]
                    ? activeStory.images[activeImageSubIndex]
                    : activeStory.coverImage
                }
                alt={activeStory.title}
                className="max-h-[62vh] max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
              />
              <p className="text-xs text-white/80 mt-3 text-center max-w-xl font-light italic">
                "{activeStory.caption}"
              </p>
            </div>

            {activeStoryIndex !== null && activeStoryIndex < filteredStories.length - 1 && (
              <button
                onClick={handleNextStory}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#B69A68] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails and Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 z-10">
            {/* Multiple photos thumbnail switcher */}
            {activeStory.images && activeStory.images.length > 1 ? (
              <div className="flex items-center gap-2">
                {activeStory.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageSubIndex(i)}
                    className={`w-14 h-10 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageSubIndex === i ? 'border-[#B69A68] scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : <div />}

            <div className="flex items-center gap-4">
              {activeStory.relatedPackageSlug && (
                <button
                  onClick={() => {
                    const slug = activeStory.relatedPackageSlug;
                    setActiveStoryIndex(null);
                    onNavigate(`/travel-packages/${slug}`);
                  }}
                  className="px-5 py-2 bg-[#B69A68] hover:bg-white text-black font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Related Expedition
                </button>
              )}
              <span className="text-xs text-white/50">
                {activeStoryIndex !== null ? activeStoryIndex + 1 : 1} of {filteredStories.length}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
