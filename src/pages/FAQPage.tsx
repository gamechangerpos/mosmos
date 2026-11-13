import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/guidesData';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<string[]>(['faq-1', 'faq-2']);

  const categories = ['all', 'Gorilla Permits', 'Safaris & Wildlife', 'Visas & Health', 'Booking & Payments', 'What to Pack'];

  const toggleItem = (id: string) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter(i => i !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  const filteredItems = activeCategory === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            Field Advice & Answers
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4ED] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
            Essential guidance on mountain gorilla permits, savanna seasons, packing essentials, visa regulations, and the MOS MOS booking workflow.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#B69A68] text-[#20221F]'
                    : 'bg-[#2A2E28] text-[#D9D0C2] hover:bg-[#343C32]'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isOpen = openItems.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-[#D9D0C2] overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F7F4ED] transition-colors"
                >
                  <div className="pr-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-xl font-light text-[#20221F]">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#78634B] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#D9D0C2]/50 text-xs sm:text-sm text-[#20221F]/80 leading-relaxed font-light">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-16 bg-[#20221F] text-[#F7F4ED] p-8 border border-[#343C32] text-center">
          <HelpCircle className="w-8 h-8 text-[#B69A68] mx-auto mb-3" />
          <h4 className="font-serif text-2xl font-light text-[#F7F4ED] mb-2">
            Have a Specific Question?
          </h4>
          <p className="text-xs text-[#D9D0C2] max-w-md mx-auto mb-6 font-light">
            Our safari specialists in Kampala are happy to answer individual questions regarding physical fitness for Bwindi or vehicle setups.
          </p>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-2.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Inquire With an Expert
          </button>
        </div>
      </div>
    </div>
  );
};
