import React from 'react';
import { Users, Shield, HeartHandshake, Award, Clock } from 'lucide-react';
import { HealthcareStaff, WebsiteSettings, PageContent } from '../types';

interface TeamPageProps {
  staff: HealthcareStaff[];
  pages: PageContent[];
  settings: WebsiteSettings;
  onOpenBooking: (serviceName?: string) => void;
  onNavigate: (page: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  staff,
  pages,
  settings,
  onOpenBooking,
  onNavigate
}) => {
  const publishedStaff = staff.filter(s => s.published);
  const teamPage = pages.find(p => p.id === 'team');

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
          {teamPage?.title || 'Our Team'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B5C] tracking-tight">
          {teamPage?.heading || 'Our Healthcare Team'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {teamPage?.subheading || "Tripple-T Health Center's clinical and support staff are dedicated to delivering respectful, attentive, and patient-centered medical care."}
        </p>
      </div>

      {/* Staff Grid or Polite Notice */}
      {publishedStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedStaff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {member.image_url ? (
                  <div className="h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#073B5C] to-[#0B5278] flex items-center justify-center text-white">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#073B5C]">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#249A96]">
                      {member.professional_title} · {member.department}
                    </p>
                  </div>

                  {member.qualifications && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      Qualifications: {member.qualifications}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.biography}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onOpenBooking(member.department)}
                  className="w-full py-2 px-3 text-xs font-semibold text-[#073B5C] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Verified Notice when staff profiles have not yet been uploaded */
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#249A96] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#073B5C]">
            Our healthcare team information will be updated shortly.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our qualified medical officers, registered nurses, laboratory technicians, and healthcare professionals are on duty during clinic hours to care for you and your family.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Schedule a Visit</span>
            </button>
          </div>
        </div>
      )}

      {/* Clinical Standards & Ethics */}
      <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#249A96]">
            Clinical Standards
          </span>
          <h2 className="text-2xl font-bold text-[#073B5C]">
            Our Care Philosophy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            How our team approaches everyday clinical care for every patient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-[#249A96]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#073B5C]">Compassionate Care</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every patient is listened to with dignity and respect, ensuring peace of mind during consultations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-[#249A96]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#073B5C]">Clinical Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict hygiene, sanitized clinical spaces, and evidence-guided diagnostic investigations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-[#249A96]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#073B5C]">Prompt Attention</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Streamlined queue management so you and your family receive timely medical care without excessive waiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
