import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Plane, Calendar, Users, ShieldAlert, CheckCircle2, ArrowRight, Send, Check, Info } from 'lucide-react';

interface FlightsPageProps {
  onNavigate: (path: string) => void;
}

export const FlightsPage: React.FC<FlightsPageProps> = ({ onNavigate }) => {
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departureCity: 'London Heathrow (LHR)',
    arrivalCity: 'Entebbe International (EBB), Uganda',
    departureDate: '',
    returnDate: '',
    passengers: 2,
    cabinClass: 'Business' as 'Economy' | 'Premium Economy' | 'Business' | 'First',
    preferredAirline: 'Qatar Airways / Emirates / KLM',
    flexibleDates: true,
    notes: ''
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.departureCity || !formData.arrivalCity) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record = StorageService.saveFlightInquiry({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        departureCity: formData.departureCity,
        arrivalCity: formData.arrivalCity,
        departureDate: formData.departureDate || 'Flexible 2027',
        returnDate: tripType === 'round-trip' ? formData.returnDate : undefined,
        tripType,
        passengersCount: Number(formData.passengers),
        cabinClass: formData.cabinClass,
        preferredAirline: formData.preferredAirline,
        flexibleDates: formData.flexibleDates,
        notes: formData.notes
      });

      // Also create a trip inquiry record for the master admin ledger
      StorageService.saveTripInquiry({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        preferredContact: 'email',
        destinations: [formData.arrivalCity],
        travelDates: `${formData.departureDate || 'Flexible'} to ${formData.returnDate || 'Open'}`,
        adultsCount: Number(formData.passengers),
        childrenCount: 0,
        budgetRange: 'Flight Concierge Quote',
        travelStyle: `Flight Inquiry (${formData.cabinClass})`,
        preferredExperiences: ['International Air Concierge'],
        accommodationType: 'N/A',
        notes: `Route: ${formData.departureCity} -> ${formData.arrivalCity} (${tripType}). Cabin: ${formData.cabinClass}. Preferred Airline: ${formData.preferredAirline}. Notes: ${formData.notes}`
      });

      setSubmittedRef(record.reference);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            International & Domestic Bush Flights
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4ED] mb-4">
            Flight Concierge & Charter Inquiries
          </h1>
          <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
            Coordinating international long-haul connections into East Africa, South Africa, and global hubs, paired seamlessly with private bush airstrip charters into the Serengeti, Bwindi, Maasai Mara, and Kruger.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Industry Transparency Notice */}
        <div className="mb-10 p-5 bg-[#EFECE3] border border-[#D9D0C2] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#78634B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#20221F]/80 leading-relaxed font-light">
            <span className="font-semibold text-[#20221F] block mb-0.5">
              Honest Flight Quotation Workflow:
            </span>
            To guarantee genuine airline rates and avoid simulated tickets, MOS MOS Safaris operates a dedicated flight desk. We verify seat availability directly with IATA international carrier systems (Emirates, Qatar Airways, KLM, Ethiopian Airlines, Kenya Airways) and East African bush charter operators (Aerolink Uganda, Coastal Aviation, SafariLink) before issuing an authorized fare quote.
          </div>
        </div>

        {submittedRef ? (
          <div className="bg-white p-8 sm:p-12 border border-[#D9D0C2] text-center shadow-xl max-w-2xl mx-auto animate-letter-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#78634B] font-semibold block mb-1">
              Flight Inquiry Successfully Recorded
            </span>
            <h2 className="font-serif text-3xl font-light text-[#20221F] mb-3">
              Your Request Is In Motion
            </h2>
            <p className="text-xs text-[#20221F]/70 mb-4 font-light">
              Your tracking reference code:
            </p>
            <span className="font-mono text-base px-4 py-2 bg-[#F7F4ED] text-[#20221F] border border-[#D9D0C2] uppercase tracking-wider font-bold">
              {submittedRef}
            </span>
            <p className="text-xs text-[#20221F]/70 max-w-md mx-auto mt-6 leading-relaxed font-light">
              Our flight specialists are reviewing scheduled route pairings for your chosen route ({formData.departureCity} → {formData.arrivalCity}) and will contact you via {formData.email} with verified schedule options.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => onNavigate(`/booking/${submittedRef}`)}
                className="px-6 py-2.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Track Request Status
              </button>
              <button
                onClick={() => setSubmittedRef(null)}
                className="px-6 py-2.5 bg-transparent border border-[#D9D0C2] hover:border-[#20221F] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                New Flight Search
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 border border-[#D9D0C2] shadow-xl">
            {/* Trip Type Tabs */}
            <div className="flex gap-4 border-b border-[#D9D0C2] pb-4 mb-8">
              {(['round-trip', 'one-way', 'multi-city'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTripType(t)}
                  className={`text-xs uppercase tracking-wider font-semibold pb-2 border-b-2 transition-colors ${
                    tripType === t
                      ? 'border-[#78634B] text-[#78634B]'
                      : 'border-transparent text-[#20221F]/60 hover:text-[#20221F]'
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Departure and Arrival */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#78634B]" />
                    Departure City / Airport *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. London Heathrow (LHR) or New York (JFK)"
                    value={formData.departureCity}
                    onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#78634B] rotate-90" />
                    Arrival City / Destination Airport *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Entebbe (EBB), Kilimanjaro (JRO), Nairobi (NBO)"
                    value={formData.arrivalCity}
                    onChange={(e) => setFormData({ ...formData, arrivalCity: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>
              </div>

              {/* Row 2: Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#78634B]" />
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                {tripType === 'round-trip' && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#78634B]" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                    />
                  </div>
                )}
              </div>

              {/* Row 3: Class & Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Cabin Class
                  </label>
                  <select
                    value={formData.cabinClass}
                    onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value as any })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First">First Class</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Passengers Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                    Preferred Airline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Qatar, Emirates, KLM"
                    value={formData.preferredAirline}
                    onChange={(e) => setFormData({ ...formData, preferredAirline: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                  />
                </div>
              </div>

              {/* Passenger Contact Info */}
              <div className="pt-6 border-t border-[#D9D0C2]">
                <h3 className="font-serif text-xl font-light text-[#20221F] mb-4">
                  Passenger Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                      Lead Passenger Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1">
                  Additional Notes or Bush Charter Connections
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need scenic light aircraft charter directly to Bwindi Kihihi airstrip or Serengeti Seronera after landing..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] p-4 focus:outline-none focus:border-[#78634B]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Flight Request...' : 'Submit Flight Concierge Request'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
