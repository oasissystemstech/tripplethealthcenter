import React, { useState } from 'react';
import { Phone, Clock, Mail, MapPin, Menu, X, CalendarCheck } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface NavbarProps {
  settings: WebsiteSettings;
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentPage,
  onNavigate,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Our Services' },
    { id: 'team', label: 'Our Team' },
    { id: 'insurance', label: 'Health Insurance' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 w-full shadow-sm">
      {/* Top Bar with verified clinic contacts & hours */}
      <div className="bg-[#073B5C] text-slate-100 text-xs py-2 px-4 border-b border-[#0B5278]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {settings.phone_primary ? (
              <a
                href={`tel:${settings.phone_primary.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 hover:text-teal-300 transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#249A96]" />
                <span>{settings.phone_primary}</span>
              </a>
            ) : (
              <button
                onClick={() => handleNavClick('contact')}
                className="flex items-center gap-1.5 hover:text-teal-300 transition-colors font-medium cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#249A96]" />
                <span>Front Desk Inquiries</span>
              </button>
            )}

            <span className="hidden sm:inline text-slate-400">·</span>

            <a
              href={`mailto:${settings.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-teal-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#249A96]" />
              <span>{settings.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#249A96]" />
              <span>Mon–Fri: {settings.hours_weekday}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 text-teal-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Duazon, Monrovia, Liberia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo and Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            aria-label="Tripple-T Health Center Home"
          >
            <img
              src="/assets/aistudio/TRIPPLE_T_HOSPITAL_LOGO_6b8f17dd.jpeg"
              alt="Tripple-T Health Center Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="hidden min-[440px]:block">
              <span className="block text-base sm:text-lg font-bold tracking-tight text-[#073B5C] uppercase leading-none font-sans">
                {settings.hospital_name}
              </span>
              <span className="block text-[11px] text-[#249A96] font-medium tracking-wide mt-1">
                {settings.slogan}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 text-sm font-medium transition-colors relative cursor-pointer ${
                    isActive
                      ? 'text-[#073B5C] font-semibold'
                      : 'text-slate-600 hover:text-[#073B5C]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#249A96] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Call to Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book an Appointment</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-slate-700 hover:text-[#073B5C] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-[#073B5C] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Clinic Information:</p>
            <p>Location: Duazon, Monrovia, Liberia</p>
            <p>Email: {settings.email}</p>
            <p>Hours: Mon–Fri: {settings.hours_weekday}</p>
          </div>
        </div>
      )}
    </header>
  );
};
