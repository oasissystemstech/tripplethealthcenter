import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Navigation,
  Share2
} from 'lucide-react';
import { WebsiteSettings, PageContent } from '../types';
import { createContactMessage } from '../services/supabase';

interface ContactPageProps {
  settings: WebsiteSettings;
  pages: PageContent[];
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  settings,
  pages,
  onOpenBooking
}) => {
  const contactPage = pages.find(p => p.id === 'contact');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!telephone.trim()) {
      setError('Please provide your telephone number.');
      return;
    }
    if (!subject.trim()) {
      setError('Please provide a subject.');
      return;
    }
    if (!message.trim()) {
      setError('Please write your message.');
      return;
    }

    setLoading(true);

    try {
      const res = await createContactMessage({
        name: name.trim(),
        telephone: telephone.trim(),
        email: email.trim() || undefined,
        subject: subject.trim(),
        message: message.trim()
      });

      if (res.success) {
        setSubmitted(true);
        setName('');
        setTelephone('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError('Failed to send message. Please contact us via WhatsApp.');
      }
    } catch {
      setError('An error occurred. Please contact the front desk directly.');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp click handler — internally uses number without printing it as text
  const handleWhatsApp = () => {
    const rawNumber = (settings.whatsapp_number || '231770183894').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      'Hello Tripple-T Health Center. I would like to make an inquiry regarding services and appointments in Duazon, Monrovia, Liberia.'
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
          {contactPage?.title || 'Contact Us'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B5C] tracking-tight">
          {contactPage?.heading || 'Get in Touch with Tripple-T Health Center'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {contactPage?.subheading || "Reach our administrative desk, ask questions regarding appointments, or find our location on Roberts Field Highway in Duazon, Monrovia, Liberia."}
        </p>
      </div>

      {/* Main Grid: Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Verified Clinic Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-[#073B5C]">
              Clinic Information
            </h2>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#249A96] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-800">Physical Address</p>
                <p className="text-slate-600 leading-relaxed">
                  {settings.location_address},<br />
                  {settings.location_landmark},<br />
                  {settings.location_city}, {settings.location_country}.
                </p>
              </div>
            </div>

            {/* Telephone (Only if configured by management) */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#249A96] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-800">Telephone Lines</p>
                {settings.phone_primary ? (
                  <div className="flex flex-col text-slate-600 gap-0.5">
                    <a href={`tel:${settings.phone_primary.replace(/\s+/g, '')}`} className="hover:text-[#249A96] font-medium">
                      {settings.phone_primary}
                    </a>
                    {settings.phone_secondary && (
                      <a href={`tel:${settings.phone_secondary.replace(/\s+/g, '')}`} className="hover:text-[#249A96] font-medium">
                        {settings.phone_secondary}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">
                    Telephone lines are being updated by management. Please use the inquiry form or WhatsApp below.
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#249A96] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-800">Email Address</p>
                <a href={`mailto:${settings.email}`} className="text-slate-600 hover:text-[#249A96] font-medium break-all">
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#249A96] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Operating Schedule</p>
                <div className="space-y-1">
                  <p><strong className="text-slate-800">Mon–Fri:</strong> {settings.hours_weekday}</p>
                  <p className="text-[#249A96] font-medium text-[11px]">{settings.hours_weekday_emergency}</p>
                  <p><strong className="text-slate-800">Saturday:</strong> {settings.hours_saturday}</p>
                  <p className="text-[#249A96] font-medium text-[11px]">{settings.hours_saturday_emergency}</p>
                  <p className="text-amber-800 text-[11px]"><strong className="text-slate-800">Sun & Holidays:</strong> {settings.hours_sunday_holiday}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action (Zero text phone number displayed) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Front Desk on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Social Media Section: Connect With Us */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#073B5C] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#249A96]" />
                <span>Connect With Us</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Follow Tripple-T Health Center for updates and information.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              {settings.facebook_url ? (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                  aria-label="Facebook Page"
                  title="Follow us on Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              ) : (
                <div
                  className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed opacity-60"
                  title="Facebook link to be added by management"
                  aria-label="Facebook profile coming soon"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
              )}

              {/* Instagram */}
              {settings.instagram_url ? (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all shadow-2xs"
                  aria-label="Instagram Profile"
                  title="Follow us on Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              ) : (
                <div
                  className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed opacity-60"
                  title="Instagram link to be added by management"
                  aria-label="Instagram profile coming soon"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              )}

              {/* TikTok */}
              {settings.tiktok_url ? (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-slate-900 text-white hover:bg-black flex items-center justify-center transition-all shadow-2xs"
                  aria-label="TikTok Account"
                  title="Follow us on TikTok"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1.01-.01 2.62.02 5.24-.02 7.86-.08 1.58-.51 3.17-1.37 4.5-1.45 2.27-4.01 3.73-6.72 3.66-2.65-.07-5.11-1.57-6.42-3.88-1.31-2.31-1.28-5.27.08-7.55 1.37-2.3 3.86-3.72 6.53-3.64.28 0 .56.02.84.06v4.18c-.46-.15-.96-.2-1.44-.14-1.12.13-2.12.82-2.61 1.83-.49 1.01-.43 2.24.16 3.19.59.95 1.68 1.52 2.8 1.45 1.11-.07 2.11-.74 2.54-1.76.22-.53.3-1.11.29-1.68.03-4.71.01-9.42.02-14.13z" />
                  </svg>
                </a>
              ) : (
                <div
                  className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed opacity-60"
                  title="TikTok link to be added by management"
                  aria-label="TikTok profile coming soon"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1.01-.01 2.62.02 5.24-.02 7.86-.08 1.58-.51 3.17-1.37 4.5-1.45 2.27-4.01 3.73-6.72 3.66-2.65-.07-5.11-1.57-6.42-3.88-1.31-2.31-1.28-5.27.08-7.55 1.37-2.3 3.86-3.72 6.53-3.64.28 0 .56.02.84.06v4.18c-.46-.15-.96-.2-1.44-.14-1.12.13-2.12.82-2.61 1.83-.49 1.01-.43 2.24.16 3.19.59.95 1.68 1.52 2.8 1.45 1.11-.07 2.11-.74 2.54-1.76.22-.53.3-1.11.29-1.68.03-4.71.01-9.42.02-14.13z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Send an Inquiry Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Have a general question regarding clinic visits, health insurance coverage, or laboratory services? Submit your message below.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Tripple-T Health Center. Our administrative desk in Duazon, Monrovia, Liberia has received your inquiry.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Samuel Weah"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telephone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+231 XX XXX XXXX"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Laboratory service inquiry"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our clinical team assist you today?..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400 italic">
                    All inquiries are securely directed to Tripple-T administration.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#073B5C] hover:bg-[#0B5278] text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Map & Driving Direction Guidance */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#073B5C] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#249A96]" />
              <span>Location & Driving Directions</span>
            </h3>
            <p className="text-xs text-slate-500">
              Roberts Field Highway, Duazon Last Turning Point, Duazon, Monrovia, Liberia
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Roberts+Field+Highway+Duazon+Liberia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B5278] hover:text-[#249A96] transition-colors"
          >
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Map iframe embed pointing to Roberts Field Highway Duazon Liberia */}
        <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
          <iframe
            title="Tripple-T Health Center Location Liberia"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Roberts%20Field%20Highway%20Duazon%20Liberia&t=&z=14&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </div>
    </div>
  );
};
