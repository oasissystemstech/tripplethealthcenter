import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Phone, MessageCircle, HelpCircle } from 'lucide-react';
import { InsuranceProvider, WebsiteSettings, PageContent } from '../types';

interface InsurancePageProps {
  insurance: InsuranceProvider[];
  pages: PageContent[];
  settings: WebsiteSettings;
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const InsurancePage: React.FC<InsurancePageProps> = ({
  insurance,
  pages,
  settings,
  onNavigate,
  onOpenBooking
}) => {
  const publishedInsurance = insurance.filter(p => p.published);
  const insurancePage = pages.find(p => p.id === 'insurance');

  const handleWhatsAppInsurance = (providerName: string) => {
    const rawNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Tripple-T Health Center. I would like to make an inquiry regarding my "${providerName}" health insurance coverage. Please assist me.`
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
          {insurancePage?.title || 'Health Insurance'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B5C] tracking-tight">
          {insurancePage?.heading || 'Accepted Health Insurance'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {insurancePage?.subheading || "Tripple-T Health Center partners with recognized insurance schemes to provide accessible healthcare for covered patients."}
        </p>
      </div>

      {/* Verified Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {publishedInsurance.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:border-[#249A96]/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#073B5C] font-extrabold text-xl">
                {provider.provider_name.charAt(0)}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#073B5C]">
                  {provider.provider_name}
                </h2>
                <p className="text-xs text-teal-600 font-medium mt-0.5">
                  Partner Insurance Provider
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {provider.description}
              </p>

              {provider.contact_note && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500">
                  {provider.contact_note}
                </div>
              )}
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => handleWhatsAppInsurance(provider.provider_name)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Verify on WhatsApp</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-slate-600 hover:text-[#073B5C] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Submit Written Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines & Verification Advice */}
      <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200">
        <div className="max-w-2xl space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
            Important Notice
          </span>
          <h3 className="text-xl font-bold text-[#073B5C]">
            Insurance Verification Guidelines
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Please review the following recommendations before arriving for your appointment:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#073B5C]">
              <CheckCircle2 className="w-4 h-4 text-[#249A96]" />
              <span>Valid Identification & Card</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              Always bring your physical insurance membership card along with a valid photo ID (such as National ID or Passport) to the registration desk.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#073B5C]">
              <AlertCircle className="w-4 h-4 text-[#249A96]" />
              <span>Coverage & Policy Limits</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-6">
              Coverage for laboratory tests, medications, or ultrasound scans depends strictly on your individual insurance policy terms and co-pay agreements.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#073B5C] text-white rounded-2xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            Questions Regarding Your Coverage?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            Our front desk officers can confirm your coverage status before you arrive.
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
            onClick={() => onOpenBooking()}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Book an Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
