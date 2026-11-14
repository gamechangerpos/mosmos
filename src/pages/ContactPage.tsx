import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { FirestoreService } from '../services/firestoreService';
import { Mail, Phone, MapPin, Send, Check, MessageSquare, Clock } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Safari Planning',
    destination: 'Uganda',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record = StorageService.saveTripInquiry({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        preferredContact: 'email',
        destinations: [formData.destination],
        travelDates: 'Inquiry Message',
        adultsCount: 2,
        childrenCount: 0,
        budgetRange: 'Inquiry',
        travelStyle: `Contact Category: ${formData.category}`,
        preferredExperiences: [formData.category],
        accommodationType: 'N/A',
        notes: `[Contact Form - ${formData.category}] Message: ${formData.message}`
      });

      // Also record into dedicated contactMessages Firestore collection
      FirestoreService.saveContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.category,
        message: formData.message
      }).catch(console.warn);

      setSubmittedRef(record.reference);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F4ED]">
      {/* Header */}
      <div className="bg-[#20221F] text-[#F7F4ED] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#343C32]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[#B69A68] font-semibold block mb-2">
            Direct Communication
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7F4ED] mb-4">
            Contact Our Expedition Desk
          </h1>
          <p className="text-sm sm:text-base text-[#D9D0C2] font-light max-w-2xl leading-relaxed">
            Our safari specialists in Kampala and Entebbe are at your service for gorilla permit inquiries, private flight charters, and custom African safari planning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Operational Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 border border-[#D9D0C2]">
              <h3 className="font-serif text-2xl font-light text-[#20221F] mb-6">
                Operations & Headquarters
              </h3>

              <div className="space-y-6 text-xs text-[#20221F]/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#78634B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#20221F] block mb-0.5">Headquarters & Flight Base</span>
                    <p className="font-light leading-relaxed">
                      Plot 14 Victoria Road, Entebbe<br />
                      P.O. Box 7218, Kampala, Uganda · East Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#78634B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#20221F] block mb-0.5">Official Inquiries & Dispatch</span>
                    <p className="font-light">inquiries@mosmossafaris.com</p>
                    <p className="font-light text-[#20221F]/60">reservations@mosmossafaris.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#78634B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#20221F] block mb-0.5">Telephone & WhatsApp Direct</span>
                    <p className="font-light">+256 414 320 000 (East Africa Operations)</p>
                    <p className="font-light text-[#20221F]/60">+256 772 100 000 (24/7 Field Emergency Desk)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#78634B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#20221F] block mb-0.5">Desk Operational Hours</span>
                    <p className="font-light">Monday – Saturday: 07:30 – 19:30 EAT (UTC+3)</p>
                    <p className="font-light text-[#20221F]/60">Emergency on-tour dispatch: 24/7 continuous</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference Tracker prompt */}
            <div className="bg-[#20221F] text-[#F7F4ED] p-8 border border-[#343C32]">
              <h4 className="font-serif text-xl font-light text-[#F7F4ED] mb-2">
                Have an Active Reference Code?
              </h4>
              <p className="text-xs text-[#D9D0C2] font-light leading-relaxed mb-4">
                If you already received an inquiry or booking code, you can track its progress immediately in our live ledger.
              </p>
              <button
                onClick={() => onNavigate('/booking/MMS-2026-7841')}
                className="w-full py-2.5 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Track Live Booking Status
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 border border-[#D9D0C2] shadow-xl">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Dispatch Form
              </span>
              <h2 className="font-serif text-3xl font-light text-[#20221F] mb-6">
                Send a Message
              </h2>

              {submitted ? (
                <div className="p-8 bg-[#F7F4ED] border border-emerald-500/40 text-center animate-letter-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#20221F] mb-2">
                    Message Successfully Sent
                  </h3>
                  <p className="text-xs text-[#20221F]/70 mb-4 font-light">
                    Your correspondence reference:
                  </p>
                  <span className="font-mono text-base px-4 py-2 bg-white text-[#20221F] border border-[#D9D0C2] uppercase tracking-wider font-bold">
                    {submittedRef}
                  </span>
                  <p className="text-xs text-[#20221F]/70 max-w-md mx-auto mt-6 leading-relaxed font-light">
                    Thank you, {formData.name}. Our expedition director will review your inquiry and reply to {formData.email} within several hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedRef(null);
                      setFormData({ ...formData, message: '' });
                    }}
                    className="mt-6 px-6 py-2 bg-[#20221F] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Richard Hawthorne"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
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

                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                      >
                        <option value="Safari Planning">Safari Planning</option>
                        <option value="Gorilla Permits">Gorilla Permits</option>
                        <option value="Flight Concierge">Flight Concierge</option>
                        <option value="Luxury Lodges">Luxury Lodges</option>
                        <option value="Media & Press">Media & Press</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                        Destination
                      </label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] px-4 py-3 focus:outline-none focus:border-[#78634B]"
                      >
                        <option value="Uganda">Uganda</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Bali">Bali</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Egypt">Egypt</option>
                        <option value="Multi-Country">Multi-Country Circuit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#20221F]/80 font-semibold block mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Share your travel dates, specific wildlife ambitions, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] p-4 focus:outline-none focus:border-[#78634B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#20221F] hover:bg-[#343C32] text-[#F7F4ED] text-xs font-semibold uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Message...' : 'Send Message to Expeditions Desk'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
