import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { MedicalService, WebsiteSettings } from '../../types';
import { createAppointmentRequest } from '../../services/supabase';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  services: MedicalService[];
  settings: WebsiteSettings;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  services,
  settings
}) => {
  const [patientName, setPatientName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
    } else if (services.length > 0 && !selectedService) {
      setSelectedService(services[0].service_name);
    }
  }, [preselectedService, services]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!patientName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!telephone.trim()) {
      setError('Please provide a telephone number where our team can reach you.');
      return;
    }
    if (!selectedService) {
      setError('Please select a preferred medical service.');
      return;
    }
    if (!preferredDate) {
      setError('Please select your preferred appointment date.');
      return;
    }

    setLoading(true);

    try {
      const res = await createAppointmentRequest({
        patient_name: patientName.trim(),
        telephone: telephone.trim(),
        email: email.trim() || undefined,
        preferred_service: selectedService,
        preferred_date: preferredDate,
        preferred_time: preferredTime || undefined,
        message: message.trim() || undefined
      });

      if (res.success) {
        setSubmissionId(res.id);
        setSubmitted(true);
      } else {
        setError(res.error || 'Unable to submit request. Please try again or call directly.');
      }
    } catch {
      setError('An unexpected error occurred. Please call the clinic directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSubmissionId(null);
    setPatientName('');
    setTelephone('');
    setEmail('');
    setPreferredDate('');
    setPreferredTime('');
    setMessage('');
    setError(null);
    onClose();
  };

  // WhatsApp click handler with pre-formatted inquiry text
  const handleWhatsAppInquiry = () => {
    const rawNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Tripple-T Health Center. I submitted an appointment request for "${selectedService || 'General Care'}". My name is ${patientName || 'a patient'}. Please assist me with availability.`
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  // Get tomorrow's date as min date for appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-[#073B5C] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-white tracking-tight">
              Request an Appointment
            </h2>
            <p className="text-xs text-teal-300 mt-0.5">
              Tripple-T Health Center · Patient Inquiries Desk
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Appointment Request Received
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Thank you for contacting Tripple-T Health Center. Your appointment request has been received. Our team will contact you at <strong>{telephone}</strong> to confirm availability.
                </p>
              </div>

              {/* Informational callout clearly highlighting REQUEST status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#249A96]" />
                  Please note:
                </p>
                <p>
                  This is an appointment request. Scheduled times are verified by our clinical desk to ensure your medical provider is ready.
                </p>
                {submissionId && (
                  <p className="text-[11px] text-slate-400 font-mono pt-1">
                    Reference ID: {submissionId}
                  </p>
                )}
              </div>

              {/* WhatsApp direct assist */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Done
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

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Samuel Weah"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                />
              </div>

              {/* Telephone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Medical Service <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800 bg-white"
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.service_name}>
                      {svc.service_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Date</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Time</span> <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800 bg-white"
                  >
                    <option value="">Any time during clinic hours</option>
                    <option value="Morning (8:30 AM – 11:30 AM)">Morning (8:30 AM – 11:30 AM)</option>
                    <option value="Mid-day (11:30 AM – 2:00 PM)">Mid-day (11:30 AM – 2:00 PM)</option>
                    <option value="Afternoon (2:00 PM – 4:00 PM)">Afternoon (2:00 PM – 4:00 PM)</option>
                    <option value="Saturday Morning (9:00 AM – 12:00 PM)">Saturday Morning (9:00 AM – 12:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Additional Note or Inquiries <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us if you have any special requirements..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent text-slate-800 resize-none"
                />
              </div>

              {/* Clinic notice */}
              <p className="text-[11px] text-slate-500 italic">
                * Note: Submitting this form sends a request to our administrative desk. We will contact you to confirm appointment timing.
              </p>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Submit Appointment Request</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
