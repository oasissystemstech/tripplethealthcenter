import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (page: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenBooking
}) => {
  const currentYear = new Date().getFullYear();

  const handleLink = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#073B5C] text-slate-200 pt-16 pb-10 border-t border-[#0B5278]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Bar */}
        <div className="pb-10 mb-10 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="bg-white p-2 rounded-xl shadow-xs shrink-0">
              <img
                src="/assets/aistudio/TRIPPLE_T_HOSPITAL_LOGO_6b8f17dd.jpeg"
                alt="Tripple-T Health Center Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <div>
              <span className="block font-bold text-white text-base sm:text-lg tracking-wide uppercase leading-tight">
                {settings.hospital_name}
              </span>
              <p className="text-xs text-teal-400 font-medium tracking-wide mt-1">
                {settings.slogan}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Book an Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3-Column Structured Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* ========================================================= */}
          {/* COLUMN 1: CLINIC CONTACT                                  */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
              Clinic Contact
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-semibold text-white">Location & Address</p>
                  <p className="text-slate-300">
                    {settings.location_address}, {settings.location_landmark}, {settings.location_city}, {settings.location_country}.
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-semibold text-white">Telephone Lines</p>
                  {settings.phone_primary ? (
                    <div className="space-y-0.5">
                      <a
                        href={`tel:${settings.phone_primary.replace(/\s+/g, '')}`}
                        className="hover:text-teal-300 transition-colors block font-medium"
                      >
                        {settings.phone_primary}
                      </a>
                      {settings.phone_secondary && (
                        <a
                          href={`tel:${settings.phone_secondary.replace(/\s+/g, '')}`}
                          className="hover:text-teal-300 transition-colors block font-medium"
                        >
                          {settings.phone_secondary}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">
                      Front Desk inquiries available via contact form or WhatsApp button.
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                <div className="leading-relaxed min-w-0">
                  <p className="font-semibold text-white">Email Address</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-teal-300 transition-colors break-all block"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2: OPENING HOURS                                   */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
              Opening Hours
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Mon - Fri */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Monday – Friday</span>
                  <span className="text-slate-200">{settings.hours_weekday}</span>
                </div>
                <p className="text-[11px] text-[#249A96] font-medium">
                  {settings.hours_weekday_emergency}
                </p>
              </div>

              {/* Saturday */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>Saturday</span>
                  <span className="text-slate-200">{settings.hours_saturday}</span>
                </div>
                <p className="text-[11px] text-[#249A96] font-medium">
                  {settings.hours_saturday_emergency}
                </p>
              </div>

              {/* Sundays & Holidays */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-amber-200 font-semibold">
                  <span>Sundays & Public Holidays</span>
                  <span>Emergency Only</span>
                </div>
                <p className="text-[11px] text-amber-300/90 font-medium">
                  {settings.hours_sunday_holiday}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3: QUICK LINKS                                     */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
              Quick Links
            </h3>

            <nav aria-label="Footer navigation">
              <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-slate-300">
                <li>
                  <button
                    onClick={() => handleLink('home')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('about')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('services')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Our Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('team')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Our Team
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('insurance')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Health Insurance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLink('contact')}
                    className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li className="col-span-2 pt-1.5 border-t border-white/5">
                  <button
                    onClick={() => onOpenBooking()}
                    className="text-teal-300 hover:text-white font-semibold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Book an Appointment</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Icon */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {currentYear} {settings.hospital_name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-teal-400" />
              <span>Compassion in Service</span>
            </span>

            {/* Discreet Admin Dashboard Icon */}
            <button
              onClick={() => handleLink('admin')}
              className="p-1.5 rounded-md text-slate-400 hover:text-teal-300 hover:bg-white/5 transition-all focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
              title="Staff Administration Portal"
              aria-label="Staff Administration Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
