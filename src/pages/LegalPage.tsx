import React, { useState } from 'react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'cancellation';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cancellation'>(initialTab);

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            Governance & Traveler Safeguards
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F7F4ED] mb-4">
            Legal & Booking Policies
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mt-8 pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-[#B69A68] text-[#20221F]'
                  : 'bg-[#2A2E28] text-[#D9D0C2] hover:bg-[#343C32]'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'terms'
                  ? 'bg-[#B69A68] text-[#20221F]'
                  : 'bg-[#2A2E28] text-[#D9D0C2] hover:bg-[#343C32]'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab('cancellation')}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'cancellation'
                  ? 'bg-[#B69A68] text-[#20221F]'
                  : 'bg-[#2A2E28] text-[#D9D0C2] hover:bg-[#343C32]'
              }`}
            >
              Cancellation & Permits
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 sm:p-12 border border-[#D9D0C2] text-xs sm:text-sm text-[#20221F]/80 leading-relaxed font-light space-y-6">
          
          {activeTab === 'privacy' && (
            <div>
              <h2 className="font-serif text-2xl text-[#20221F] font-normal mb-4">
                Privacy & Data Protection Policy
              </h2>
              <p className="mb-4">
                MOS MOS Safaris ("we", "us", or "our") respects the privacy of our expedition guests. This Privacy Policy details how we collect, store, and process personal traveler data when inquiring or booking safaris.
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                1. Data Collection & National Park Authority Requirements
              </h3>
              <p className="mb-4">
                To issue official mountain gorilla trekking permits and domestic flight tickets, statutory bodies including the Uganda Wildlife Authority (UWA), Rwanda Development Board (RDB), and civil aviation authorities mandate full traveler names, passport nationality, passport numbers, and date of birth. We collect this data exclusively for regulatory verification.
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                2. No Resale of Information
              </h3>
              <p className="mb-4">
                We never sell, rent, or lease traveler information or contact details to third-party marketing companies. Data is shared strictly with operational partners (partner safari lodges, aviation charter carriers, licensed driver-guides) essential to running your expedition.
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                3. Secure Payment Handling
              </h3>
              <p className="mb-4">
                We do not store raw credit card details on our local web servers. All payment transactions occur via encrypted bank telegraphic transfer or PCI-DSS certified international gateway processors.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h2 className="font-serif text-2xl text-[#20221F] font-normal mb-4">
                Terms of Safari Booking & Expedition Agreement
              </h2>
              <p className="mb-4">
                All travel arrangements booked through MOS MOS Safaris are subject to the following contractual terms:
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                1. Quotations and Price Validity
              </h3>
              <p className="mb-4">
                Official quotations are issued in US Dollars (USD) and remain guaranteed for 14 days from issuance. Quotations include all specified national park fees, vehicle usage, guide allowances, and lodge meal plans as delineated on the itinerary.
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                2. Booking Confirmation Deposit
              </h3>
              <p className="mb-4">
                A non-refundable deposit of 30% of total tour cost PLUS 100% of statutory gorilla and chimpanzee permit fees is required to formally block park dates and lodge rooms. The remaining 70% balance is payable 45 days prior to arrival.
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                3. Wildlife Sightings Disclaimer
              </h3>
              <p className="mb-4">
                While our senior guides possess extraordinary tracking records (with 99%+ historical gorilla encounter success in Bwindi and Volcanoes), wild animals move freely across open ecosystems without human confinement. We guarantee maximum expert search effort and adherence to ethical wildlife protocols.
              </p>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div>
              <h2 className="font-serif text-2xl text-[#20221F] font-normal mb-4">
                Cancellation, Refund & Gorilla Permit Rules
              </h2>
              <p className="mb-4">
                Safaris in East Africa involve advance reservations with governmental wildlife bodies and remote wilderness camps with strict cancellation terms:
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                1. Mountain Gorilla & Chimpanzee Permits (Non-Refundable)
              </h3>
              <p className="mb-4">
                Permits issued by the Uganda Wildlife Authority ($800) and Rwanda Development Board ($1,500) are 100% non-refundable once purchased. In the event of documented medical incapacitation verified by park physicians on trek morning, park authorities may authorize a 50% refund at their sole discretion.
              </p>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                2. Safari Land Arrangements Cancellation Schedule
              </h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>More than 60 days prior to arrival: Full refund of land deposit minus 10% administrative fee.</li>
                <li>59 to 30 days prior to arrival: 50% cancellation fee on land package.</li>
                <li>29 to 15 days prior to arrival: 75% cancellation fee on land package.</li>
                <li>Less than 14 days or no-show: 100% cancellation fee.</li>
              </ul>
              <h3 className="font-serif text-lg text-[#20221F] font-medium mt-6 mb-2">
                3. Mandatory Comprehensive Travel Insurance
              </h3>
              <p className="mb-4">
                All guests traveling on a MOS MOS safari must maintain comprehensive medical evacuation, trip interruption, and cancellation insurance covering remote air ambulance services (AMREF Flying Doctors).
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
