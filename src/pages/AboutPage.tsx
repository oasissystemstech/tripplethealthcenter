import React from 'react';
import { Shield, Heart, Eye, Target, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { WebsiteSettings, PageContent } from '../types';

interface AboutPageProps {
  settings: WebsiteSettings;
  pages: PageContent[];
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  pages,
  onNavigate,
  onOpenBooking
}) => {
  const aboutPage = pages.find(p => p.id === 'about');

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
          {aboutPage?.title || 'About Us'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B5C] tracking-tight">
          {aboutPage?.heading || 'About Tripple-T Health Center'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {aboutPage?.subheading || settings.slogan}
        </p>
      </div>

      {/* Main Introduction Section */}
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl font-bold text-[#073B5C]">
              Compassionate, Patient-Centered Healthcare
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings.about_intro}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Located on Roberts Field Highway at the Duazon Last Turning Point, Duazon, Monrovia, Liberia, Tripple-T Health Center is situated to serve community residents with responsive outpatient consultations, routine and chemistry laboratory investigations, maternal care, ultrasound, and emergency services.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>Book an Appointment</span>
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#073B5C] hover:text-[#249A96] transition-colors cursor-pointer px-3 py-2"
              >
                <span>View All Medical Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={aboutPage?.image_url || settings.hero_image_url || "/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png"}
                alt="Tripple-T Health Center medical care"
                className="w-full h-auto object-cover max-h-[360px]"
              />
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Tripple-T Health Center · Monrovia, Liberia</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Committed to dignity, hygiene, and patient safety.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#073B5C] text-white rounded-2xl p-8 sm:p-10 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Our Purpose
          </span>
          <h3 className="text-xl font-bold text-white">
            Our Mission
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-light">
            "{settings.mission}"
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 space-y-4 border border-slate-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#249A96]">
            <Eye className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
            Our Aspiration
          </span>
          <h3 className="text-xl font-bold text-[#073B5C]">
            Our Vision
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            "{settings.vision}"
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
            Guiding Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#073B5C]">
            Our Core Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            These fundamental principles guide every consultation, patient interaction, and clinical procedure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.core_values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#249A96] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-[#073B5C]">
                  {val}
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-11">
                {val === 'Compassion' && 'Treating every patient and family member with genuine empathy and warm clinical care.'}
                {val === 'Professionalism' && 'Delivering evidence-based care upholding the highest ethical and clinical standards.'}
                {val === 'Integrity' && 'Transparent communication, honest medical advice, and strict patient confidentiality.'}
                {val === 'Respect' && 'Honoring every individual’s background, dignity, and personal healthcare choices.'}
                {val === 'Excellence' && 'Continuous improvement in medical practices, diagnostics, and patient safety protocols.'}
                {val === 'Patient Safety' && 'A clean, sterile environment designed to prevent harm and safeguard well-being.'}
                {!['Compassion', 'Professionalism', 'Integrity', 'Respect', 'Excellence', 'Patient Safety'].includes(val) &&
                  'Committed to upholding quality standards in all patient care operations.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment to Future Health Systems */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#073B5C]">
            Committed to Ongoing Healthcare Quality
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Tripple-T Health Center continues to upgrade clinical infrastructure, records management, and laboratory capabilities to provide the Duazon community with modern, reliable healthcare.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 bg-[#073B5C] hover:bg-[#0B5278] text-white px-5 py-3 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer"
        >
          <span>Contact Our Front Desk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
