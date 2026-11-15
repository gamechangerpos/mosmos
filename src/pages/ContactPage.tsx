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

  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Honeypot check (Low-friction spam protection: bots fill hidden inputs, humans don't)
    if (honeypot) {
      // Silently discard spam bot submission
      setSubmitted(true);
      return;
    }

    // 2. Syntax validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const cleanEmail = formData.email.trim();
    const cleanMessage = formData.message.trim();
    const cleanName = formData.name.trim() || 'Valued Guest';

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError('Please provide a valid email address so our team can reply to you.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      setFormError('Please enter your inquiry or question (at least 5 characters).');
      return;
    }

    // 3. Client-side rate limiting (prevents rapid-fire automated submissions)
    const lastSubKey = 'mos_last_inquiry_timestamp';
    const lastSubTime = Number(sessionStorage.getItem(lastSubKey) || '0');
    const now = Date.now();
    if (now - lastSubTime < 8000) {
      setFormError('Your inquiry is being processed. Please wait a few moments before sending another message.');
      return;
    }
    sessionStorage.setItem(lastSubKey, String(now));

    setIsSubmitting(true);

    // 4. Try Vercel Serverless Function first for secure server-side email dispatch
    fetch('/api/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        phone: formData.phone.trim() || undefined,
        category: formData.category,
        destination: formData.destination,
        message: cleanMessage,
        website_url_hp: honeypot
      })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.reference) {
            setSubmittedRef(data.reference);
          }
        }
      })
      .catch(() => {
        // Offline / local preview fallback
      })
      .finally(() => {
        // 5. Always persist to Firestore and trigger local storage record
        const record = StorageService.saveTripInquiry({
          customerName: cleanName,
          customerEmail: cleanEmail,
          customerPhone: formData.phone.trim() || undefined,
          preferredContact: 'email',
          destinations: [formData.destination],
          travelDates: 'Direct Inquiry',
          adultsCount: 2,
          childrenCount: 0,
          budgetRange: 'Inquiry',
          travelStyle: `Contact: ${formData.category}`,
          preferredExperiences: [formData.category],
          accommodationType: 'N/A',
          notes: `[Contact Form - ${formData.category}] Message: ${cleanMessage}`
        });

        // Also persist to contactMessages collection in Firestore
        FirestoreService.saveContactMessage({
          name: cleanName,
          email: cleanEmail,
          phone: formData.phone.trim() || undefined,
          subject: formData.category,
          message: cleanMessage
        }).catch(console.warn);

        setSubmittedRef((prev) => prev || record.reference);
        setSubmitted(true);
        setIsSubmitting(false);
      });
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
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 border border-[#D9D0C2] shadow-xl">
              <span className="text-[10px] uppercase tracking-wider text-[#78634B] font-semibold block mb-1">
                Direct Contact
              </span>
              <h2 className="font-serif text-3xl font-light text-[#20221F] mb-2">
                Send a Message
              </h2>
              <p className="text-xs text-[#20221F]/60 mb-6 font-light">
                No login or account required. Simply enter your email and message, and our team will reply directly to your inbox.
              </p>

              {formError && (
                <div className="p-3.5 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs">
                  {formError}
                </div>
              )}

              {submitted ? (
                <div className="p-8 bg-[#F7F4ED] border border-emerald-500/40 text-center animate-letter-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#20221F] mb-2">
                    Inquiry Received
                  </h3>
                  <p className="text-xs text-[#20221F]/70 mb-3 font-light">
                    Your inquiry reference code:
                  </p>
                  <span className="font-mono text-base px-4 py-2 bg-white text-[#20221F] border border-[#D9D0C2] uppercase tracking-wider font-bold">
                    {submittedRef}
                  </span>
                  <p className="text-xs text-[#20221F]/80 max-w-md mx-auto mt-6 leading-relaxed font-light">
                    Thank you, <strong>{formData.name || 'Valued Guest'}</strong>. Your inquiry has been received by our expedition directors. Our team will carefully review your details and respond directly to <strong>{formData.email}</strong> within <strong>two business days</strong>.
                  </p>
                  <p className="text-[11px] text-[#78634B] mt-2 font-medium">
                    No account creation, OTP, or email verification is required.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedRef(null);
                      setFormData({ ...formData, message: '' });
                    }}
                    className="mt-6 px-6 py-2.5 bg-[#20221F] hover:bg-[#78634B] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Spam Protection Honeypot */}
                  <input
                    type="text"
                    name="website_url_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, margin: 0 }}
                    aria-hidden="true"
                  />
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
