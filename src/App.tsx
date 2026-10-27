import React, { useState, useEffect, useCallback } from 'react';
import { WebsiteSettings, PageContent, MedicalService, HealthcareStaff, InsuranceProvider } from './types';
import {
  getWebsiteSettings,
  getPagesContent,
  getMedicalServices,
  getHealthcareStaff,
  getInsuranceProviders
} from './services/supabase';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatingButton } from './components/whatsapp/WhatsAppFloatingButton';
import { AppointmentModal } from './components/booking/AppointmentModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { TeamPage } from './pages/TeamPage';
import { InsurancePage } from './pages/InsurancePage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { INITIAL_SETTINGS, INITIAL_PAGES, INITIAL_SERVICES, INITIAL_STAFF, INITIAL_INSURANCE } from './services/initialData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [pages, setPages] = useState<PageContent[]>(INITIAL_PAGES);
  const [services, setServices] = useState<MedicalService[]>(INITIAL_SERVICES);
  const [staff, setStaff] = useState<HealthcareStaff[]>(INITIAL_STAFF);
  const [insurance, setInsurance] = useState<InsuranceProvider[]>(INITIAL_INSURANCE);

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  // Load data from Supabase (Source of Truth) with LocalStorage fallback
  const loadData = useCallback(async () => {
    try {
      const [loadedSettings, loadedPages, loadedServices, loadedStaff, loadedInsurance] = await Promise.all([
        getWebsiteSettings(),
        getPagesContent(),
        getMedicalServices(),
        getHealthcareStaff(),
        getInsuranceProviders()
      ]);
      setSettings(loadedSettings);
      if (loadedPages && loadedPages.length > 0) {
        setPages(loadedPages);
      }
      setServices(loadedServices);
      setStaff(loadedStaff);
      setInsurance(loadedInsurance);
    } catch (e) {
      console.warn('Data load notice:', e);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Re-fetch on window focus to ensure multi-device & multi-tab freshness
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadData]);

  // Sync URL hash / pathname for multi-page routing
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace(/^\//, '');

      const route = hash || path;
      if (['home', 'about', 'services', 'team', 'insurance', 'contact', 'admin'].includes(route)) {
        setCurrentPage(route);
        // Refresh data when navigating to ensure latest published updates
        loadData();
      } else if (route === 'book') {
        setCurrentPage('home');
        setBookingModalOpen(true);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [loadData]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.history.pushState(null, '', page === 'home' ? '/' : `/#${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Refresh content on navigation
    loadData();
  };

  const handleOpenBooking = (serviceName?: string) => {
    setPreselectedService(serviceName);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FB] text-[#172B3A] selection:bg-[#249A96]/20 selection:text-[#073B5C] relative">
      {/* Main Navbar */}
      <Navbar
        settings={settings}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            pages={pages}
            services={services}
            insurance={insurance}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            pages={pages}
            onNavigate={handleNavigate}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            services={services}
            pages={pages}
            settings={settings}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'team' && (
          <TeamPage
            staff={staff}
            pages={pages}
            settings={settings}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'insurance' && (
          <InsurancePage
            insurance={insurance}
            pages={pages}
            settings={settings}
            onNavigate={handleNavigate}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            settings={settings}
            pages={pages}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            settings={settings}
            pages={pages}
            services={services}
            staff={staff}
            insurance={insurance}
            onUpdateSettings={setSettings}
            onUpdatePages={setPages}
            onUpdateServices={setServices}
            onUpdateStaff={setStaff}
            onUpdateInsurance={setInsurance}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Floating WhatsApp Action Button (On all public pages) */}
      {currentPage !== 'admin' && (
        <WhatsAppFloatingButton whatsappNumber={settings.whatsapp_number} />
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
      />

      {/* Appointment Request Modal */}
      <AppointmentModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={preselectedService}
        services={services}
        settings={settings}
      />
    </div>
  );
}
