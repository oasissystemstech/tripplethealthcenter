import React from 'react';
import {
  Stethoscope,
  Activity,
  Baby,
  FlaskConical,
  ScanLine,
  ShieldCheck,
  Check,
  CalendarCheck,
  Phone,
  HelpCircle
} from 'lucide-react';
import { MedicalService, WebsiteSettings, PageContent } from '../types';

interface ServicesPageProps {
  services: MedicalService[];
  pages: PageContent[];
  settings: WebsiteSettings;
  onOpenBooking: (serviceName?: string) => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  pages,
  settings,
  onOpenBooking,
  onNavigate
}) => {
  const servicesPage = pages.find(p => p.id === 'services');

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Stethoscope':
        return <Stethoscope className="w-7 h-7 text-[#249A96]" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-[#249A96]" />;
      case 'Baby':
        return <Baby className="w-7 h-7 text-[#249A96]" />;
      case 'FlaskConical':
        return <FlaskConical className="w-7 h-7 text-[#249A96]" />;
      case 'ScanLine':
        return <ScanLine className="w-7 h-7 text-[#249A96]" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-7 h-7 text-[#249A96]" />;
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
          {servicesPage?.title || 'Our Services'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B5C] tracking-tight">
          {servicesPage?.heading || 'Available Medical Services'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {servicesPage?.subheading || "Comprehensive outpatient care, diagnostic testing, maternal health, and preventive immunization."}
        </p>
      </div>

      {/* Services Detailed List */}
      <div className="space-y-8">
        {services.filter(s => s.published).map((svc, index) => (
          <div
            key={svc.id}
            id={svc.id}
            className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs hover:border-[#249A96]/30 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left col: Icon and Title */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    {renderIcon(svc.icon_name)}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#249A96] uppercase tracking-wider">
                      Service {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#073B5C] tracking-tight">
                      {svc.service_name}
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {svc.short_description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenBooking(svc.service_name)}
                    className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Book an Appointment</span>
                  </button>
                </div>
              </div>

              {/* Right col: In-depth Description & Features */}
              <div className="lg:col-span-8 bg-slate-50/70 rounded-xl p-6 border border-slate-100 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Service Overview & Care Standards
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {svc.full_description}
                </p>

                {svc.features && svc.features.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Key Capabilities Included:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {svc.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#249A96] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific notice for Ultrasound and Laboratory */}
                {svc.category === 'laboratory' && (
                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 bg-white/60 p-3 rounded-lg">
                    <strong className="text-[#073B5C]">Laboratory Units:</strong> Our facility is equipped with both a <em>Routine Laboratory</em> for basic tests and a <em>Chemistry Laboratory</em> for clinical chemistry inquiries.
                  </div>
                )}

                {svc.category === 'ultrasound' && (
                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 bg-white/60 p-3 rounded-lg">
                    <strong className="text-[#073B5C]">Scheduling Ultrasound:</strong> Ultrasound appointments can be arranged ahead of time through our booking form or by direct telephone inquiry.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Notice Strip */}
      <div className="bg-[#073B5C] text-white rounded-2xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Unsure which service you need?</span>
          </div>
          <h3 className="text-xl font-bold">
            Speak Directly with our Front Desk
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            Our staff will guide you to the right department or schedule a consultation with our medical officer.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {settings.phone_primary ? (
            <a
              href={`tel:${settings.phone_primary.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-3 rounded-xl text-xs font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call {settings.phone_primary}</span>
            </a>
          ) : (
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Front Desk</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Contact Information</span>
          </button>
        </div>
      </div>
    </div>
  );
};
