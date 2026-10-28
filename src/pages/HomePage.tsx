import React from 'react';
import {
  CalendarCheck,
  Phone,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Baby,
  FlaskConical,
  ScanLine,
  Clock,
  MapPin,
  Check,
  Sparkles,
  ExternalLink,
  Mail
} from 'lucide-react';
import { WebsiteSettings, PageContent, MedicalService, InsuranceProvider } from '../types';

interface HomePageProps {
  settings: WebsiteSettings;
  pages: PageContent[];
  services: MedicalService[];
  insurance: InsuranceProvider[];
  onNavigate: (page: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  pages,
  services,
  insurance,
  onNavigate,
  onOpenBooking
}) => {
  const homePage = pages.find(p => p.id === 'home');

  // Service icon mapping helper
  const renderServiceIcon = (name: string) => {
    switch (name) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-[#249A96]" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#249A96]" />;
      case 'Baby':
        return <Baby className="w-6 h-6 text-[#249A96]" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-[#249A96]" />;
      case 'ScanLine':
        return <ScanLine className="w-6 h-6 text-[#249A96]" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-6 h-6 text-[#249A96]" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ======================================================== */}
      {/* HERO SECTION                                             */}
      {/* ======================================================== */}
      <section className="relative bg-gradient-to-b from-[#073B5C] via-[#0B5278] to-[#073B5C] text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-md text-xs font-medium text-teal-300 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Duazon, Monrovia, Liberia · Accessible Community Healthcare</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {homePage?.heading || settings.slogan}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-light">
                {homePage?.subheading || "At Tripple-T Health Center, we are committed to providing compassionate, accessible, and professional healthcare for individuals and families in Liberia."}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-teal-900/30 transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book an Appointment</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {settings.phone_primary ? (
                  <a
                    href={`tel:${settings.phone_primary.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-2 text-slate-200 hover:text-teal-300 text-sm font-medium px-3 py-3 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#249A96]" />
                    <span>Call {settings.phone_primary}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 text-slate-200 hover:text-teal-300 text-sm font-medium px-3 py-3 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-[#249A96]" />
                    <span>Contact Front Desk</span>
                  </button>
                )}
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#249A96]" />
                  <span>Maternal & Child Care</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#249A96]" />
                  <span>Routine & Chemistry Lab</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <div className="w-2 h-2 rounded-full bg-[#249A96]" />
                  <span>Insurance Accepted</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900">
                  <img
                    src={homePage?.image_url || settings.hero_image_url || "/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png"}
                    alt="Tripple-T Health Center medical care professional and baby"
                    className="w-full h-auto object-cover max-h-[500px] object-top"
                    loading="eager"
                  />
                  {/* Subtle caption banner on bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#073B5C] via-[#073B5C]/90 to-transparent p-4 pt-10 text-xs text-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Mothers & Children Care</p>
                      <p className="text-[11px] text-teal-300">Warm, patient-centered clinical attention</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-200 bg-white/20 px-2 py-0.5 rounded">
                      Duazon, Monrovia, Liberia
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* WELCOME SECTION                                          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
               About Our Clinic
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#073B5C] tracking-tight">
              Welcome to Tripple-T Health Center
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {settings.about_intro}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B5278] hover:text-[#249A96] transition-colors cursor-pointer"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* OUR SERVICES SECTION                                     */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
              Healthcare Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#073B5C] tracking-tight mt-1">
              Available Medical Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Professional, patient-friendly medical solutions tailored to your family's needs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B5278] hover:text-[#249A96] transition-colors cursor-pointer shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.published).map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-xl p-6 border border-slate-200/80 hover:border-[#249A96]/40 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {renderServiceIcon(svc.icon_name)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#073B5C] tracking-tight">
                    {svc.service_name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {svc.short_description}
                  </p>
                </div>

                {svc.features && svc.features.length > 0 && (
                  <ul className="space-y-1.5 pt-2 text-[11px] text-slate-500">
                    {svc.features.slice(0, 2).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#249A96] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('services')}
                  className="text-xs font-medium text-slate-600 hover:text-[#073B5C] transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenBooking(svc.service_name)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#249A96] hover:text-[#1e8581] cursor-pointer"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* MATERNITY & CHILD HEALTH HIGHLIGHT                       */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#073B5C] to-[#0B5278] rounded-2xl text-white overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Specialized Maternal Care
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Care for Mothers and Children
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                Supporting the health and well-being of mothers, babies, and families through compassionate healthcare services.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking("Maternity & Child's Health")}
                  className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow transition-colors cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Make an Appointment</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative">
              <img
                src="/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png"
                alt="Mother and Child Care"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#073B5C] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* LABORATORY & ULTRASOUND SECTIONS (2 Columns)            */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Laboratory Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-[#249A96]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
                  Diagnostic Testing
                </span>
                <h3 className="text-xl font-bold text-[#073B5C] mt-1">
                  Laboratory Services
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Access laboratory services to support your healthcare needs. We offer:
              </p>
              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#249A96]" />
                  <span>Routine Laboratory Services</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#249A96]" />
                  <span>Chemistry Laboratory</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => onOpenBooking('Laboratory Services')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B5278] hover:text-[#249A96] transition-colors cursor-pointer"
              >
                <span>Laboratory Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ultrasound Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                <ScanLine className="w-6 h-6 text-[#249A96]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
                  Imaging & Ultrasound
                </span>
                <h3 className="text-xl font-bold text-[#073B5C] mt-1">
                  Ultrasound Services
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Contact Tripple-T Health Center to make inquiries about available ultrasound services and appointment arrangements.
              </p>
              <p className="text-xs text-slate-500 italic">
                Obstetric and clinical ultrasound assessments scheduled with our trained medical team.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => onOpenBooking('Ultrasound Services')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B5278] hover:text-[#249A96] transition-colors cursor-pointer"
              >
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* HEALTH INSURANCE SECTION                                 */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
          <div className="max-w-2xl space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
              Coverage & Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#073B5C] tracking-tight">
              Health Insurance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We work with selected health insurance providers. Contact Tripple-T Health Center to confirm your coverage and eligibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {insurance.filter(p => p.published).map((ins) => (
              <div
                key={ins.id}
                className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 hover:border-[#249A96]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-2xs text-[#073B5C] font-extrabold text-lg flex items-center justify-center">
                    {ins.provider_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#073B5C]">
                      {ins.provider_name}
                    </h3>
                    <p className="text-[11px] font-semibold text-teal-600">
                      Approved Insurance Scheme
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ins.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => onNavigate('insurance')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#073B5C] hover:text-[#249A96] transition-colors cursor-pointer"
                  >
                    <span>Insurance Inquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              * Note: Please present your valid insurance card upon registration to verify specific procedure coverage.
            </p>
            <button
              onClick={() => onNavigate('insurance')}
              className="inline-flex items-center gap-2 bg-[#073B5C] hover:bg-[#0B5278] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Explore All Insurance Information</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* OPENING HOURS & EMERGENCY SECTION                        */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
                Clinic Schedule
              </span>
              <h2 className="text-2xl font-bold text-[#073B5C] tracking-tight">
                Opening Hours
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We are open during the week and weekends to attend to outpatient consultations and emergency care.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="text-xs font-bold text-[#073B5C]">Monday – Friday</span>
                <p className="text-sm font-semibold text-slate-800">{settings.hours_weekday}</p>
                <p className="text-[11px] text-[#249A96] font-medium pt-1">
                  {settings.hours_weekday_emergency}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                <span className="text-xs font-bold text-[#073B5C]">Saturday</span>
                <p className="text-sm font-semibold text-slate-800">{settings.hours_saturday}</p>
                <p className="text-[11px] text-[#249A96] font-medium pt-1">
                  {settings.hours_saturday_emergency}
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-1">
                <span className="text-xs font-bold text-amber-900">Sundays & Holidays</span>
                <p className="text-sm font-semibold text-amber-950">Emergency Only</p>
                <p className="text-[11px] text-amber-800 pt-1">
                  {settings.hours_sunday_holiday}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* QUICK CONTACT SECTION                                    */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073B5C] rounded-2xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Get in Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                We are Here for You and Your Family
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>{settings.location_address}, {settings.location_landmark}, {settings.location_city}, {settings.location_country}</span>
                </p>
                {settings.phone_primary ? (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-300 shrink-0" />
                    <span>{settings.phone_primary} {settings.phone_secondary && `· ${settings.phone_secondary}`}</span>
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-teal-300 shrink-0" />
                    <span>Email inquiries: {settings.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
              {settings.phone_primary ? (
                <a
                  href={`tel:${settings.phone_primary.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-3 rounded-xl text-xs font-semibold shadow transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
              ) : (
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-3 rounded-xl text-xs font-semibold shadow transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Clinic</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Send an Inquiry</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 text-teal-300 hover:text-white px-3 py-3 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
