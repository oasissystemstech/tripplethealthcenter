import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Settings,
  CalendarCheck,
  Mail,
  Stethoscope,
  Users,
  Shield,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Edit2,
  Database,
  RefreshCw,
  Phone,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FileText,
  Upload,
  Globe,
  Share2,
  Info
} from 'lucide-react';
import {
  WebsiteSettings,
  PageContent,
  MedicalService,
  HealthcareStaff,
  InsuranceProvider,
  AppointmentRequest,
  ContactMessage
} from '../types';
import {
  isSupabaseConfigured,
  getAppointmentRequests,
  updateAppointmentStatus,
  deleteAppointmentRequest,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage,
  updateWebsiteSettings,
  getPagesContent,
  savePagesContent,
  savePage,
  createPage,
  deletePage,
  saveMedicalServices,
  deleteMedicalService,
  saveHealthcareStaff,
  deleteHealthcareStaff,
  saveInsuranceProviders,
  deleteInsuranceProvider,
  uploadWebsiteImage,
  adminSignIn,
  adminSignOut,
  checkAdminSession,
  getSupabaseAuthUser,
  ensureAdminSupabaseSession,
  syncAdminUserToSupabase,
  FIX_RLS_SQL_SCRIPT,
  SUPABASE_SQL_SCHEMA
} from '../services/supabase';

interface AdminPageProps {
  settings: WebsiteSettings;
  pages: PageContent[];
  services: MedicalService[];
  staff: HealthcareStaff[];
  insurance: InsuranceProvider[];
  onUpdateSettings: (newSettings: WebsiteSettings) => void;
  onUpdatePages: (newPages: PageContent[]) => void;
  onUpdateServices: (newServices: MedicalService[]) => void;
  onUpdateStaff: (newStaff: HealthcareStaff[]) => void;
  onUpdateInsurance: (newInsurance: InsuranceProvider[]) => void;
  onNavigate: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  settings,
  pages,
  services,
  staff,
  insurance,
  onUpdateSettings,
  onUpdatePages,
  onUpdateServices,
  onUpdateStaff,
  onUpdateInsurance,
  onNavigate
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAdminSession());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'messages' | 'pages' | 'services' | 'images' | 'team' | 'insurance' | 'settings' | 'setup'
  >('overview');

  // Appointments & Messages
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Pages management
  const [pagesList, setPagesList] = useState<PageContent[]>([]);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Services editable state
  const [servicesList, setServicesList] = useState<MedicalService[]>(services);
  const [editingService, setEditingService] = useState<MedicalService | null>(null);

  // Team editable state
  const [staffList, setStaffList] = useState<HealthcareStaff[]>(staff);
  const [newStaffModal, setNewStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<HealthcareStaff>>({
    name: '',
    professional_title: '',
    department: 'General Medicine',
    qualifications: '',
    biography: '',
    published: true,
    display_order: staff.length + 1
  });

  // Insurance editable state
  const [insuranceList, setInsuranceList] = useState<InsuranceProvider[]>(insurance);
  const [newInsuranceModal, setNewInsuranceModal] = useState(false);
  const [newInsurance, setNewInsurance] = useState<Partial<InsuranceProvider>>({
    provider_name: '',
    description: '',
    contact_note: '',
    published: true,
    display_order: insurance.length + 1
  });

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedRlsSql, setCopiedRlsSql] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [copiedVercelUrl, setCopiedVercelUrl] = useState(false);
  const [copiedVercelKey, setCopiedVercelKey] = useState(false);

  // Live Supabase Auth session state
  const [supabaseAuthStatus, setSupabaseAuthStatus] = useState<{ authenticated: boolean; email?: string }>({ authenticated: false });
  const [connectingAuth, setConnectingAuth] = useState(false);

  // New page modal state
  const [newPageModal, setNewPageModal] = useState(false);
  const [newPage, setNewPage] = useState<Partial<PageContent>>({
    id: '',
    title: '',
    heading: '',
    subheading: '',
    seo_title: '',
    meta_description: '',
    image_url: '',
    published: true
  });

  // Save notification banner state
  const [saveStatus, setSaveStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (pages && pages.length > 0) {
      setPagesList(pages);
    }
  }, [pages]);

  useEffect(() => {
    setServicesList(services);
  }, [services]);

  useEffect(() => {
    setStaffList(staff);
  }, [staff]);

  useEffect(() => {
    setInsuranceList(insurance);
  }, [insurance]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
      getSupabaseAuthUser().then(setSupabaseAuthStatus);
    }
  }, [isAuthenticated]);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [apts, msgs, pgs] = await Promise.all([
        getAppointmentRequests(),
        getContactMessages(),
        getPagesContent()
      ]);
      setAppointments(apts);
      setMessages(msgs);
      if (pgs && pgs.length > 0) {
        setPagesList(pgs);
        onUpdatePages(pgs);
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Secure admin authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await adminSignIn(emailInput.trim(), passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        loadAdminData();
        getSupabaseAuthUser().then(setSupabaseAuthStatus);
      } else {
        setAuthError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setAuthError('Connection error during authentication.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminSignOut();
    setIsAuthenticated(false);
    setSupabaseAuthStatus({ authenticated: false });
  };

  const handleConnectAuth = async () => {
    setConnectingAuth(true);
    setSaveStatus(null);
    try {
      const res = await ensureAdminSupabaseSession();
      if (res.success) {
        const user = await getSupabaseAuthUser();
        setSupabaseAuthStatus(user);
        setSaveStatus({ message: 'Supabase Auth session connected successfully!' });
      } else {
        setSaveStatus({ message: `Supabase Auth connection notice: ${res.error}`, isError: true });
      }
    } finally {
      setConnectingAuth(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    await ensureAdminSupabaseSession();
    const res = await updateWebsiteSettings(settingsForm);
    if (res.success) {
      onUpdateSettings(settingsForm);
      setSettingsSaved(true);
      setSaveStatus({ message: 'Website settings saved and synchronized to Supabase successfully!' });
      setTimeout(() => {
        setSettingsSaved(false);
        setSaveStatus(null);
      }, 4000);
    } else {
      setSaveStatus({ message: `Failed to save settings: ${res.error}`, isError: true });
    }
  };

  // Page Editing Handlers - Targeted Single Page Save
  const handleSaveEditedPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setSaveStatus(null);

    // Verify and establish Supabase Auth session so RLS policy passes
    await ensureAdminSupabaseSession();

    // Use targeted savePage operation
    const res = await savePage(editingPage);
    if (res.success) {
      const updated = pagesList.map(p => p.id === editingPage.id ? editingPage : p);
      setPagesList(updated);
      onUpdatePages(updated);
      setEditingPage(null);
      setSaveStatus({ message: `Page content for "${editingPage.title}" saved and published to Supabase!` });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({
        message: `Failed to save page to Supabase: ${res.error}. If your database RLS policies have not been updated, execute the RLS Fix SQL in the Setup tab.`,
        isError: true
      });
    }
  };

  // Create New Page Handler
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.id || !newPage.title || !newPage.heading) return;
    setSaveStatus(null);

    const pageObj: PageContent = {
      id: newPage.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-').trim(),
      title: newPage.title.trim(),
      heading: newPage.heading.trim(),
      subheading: newPage.subheading?.trim() || '',
      seo_title: newPage.seo_title?.trim() || `${newPage.title.trim()} – Tripple-T Health Center`,
      meta_description: newPage.meta_description?.trim() || newPage.subheading?.trim() || '',
      image_url: newPage.image_url?.trim() || undefined,
      published: Boolean(newPage.published),
      updated_at: new Date().toISOString()
    };

    await ensureAdminSupabaseSession();
    const res = await createPage(pageObj);
    if (res.success) {
      const updated = [...pagesList, pageObj];
      setPagesList(updated);
      onUpdatePages(updated);
      setNewPageModal(false);
      setNewPage({
        id: '',
        title: '',
        heading: '',
        subheading: '',
        seo_title: '',
        meta_description: '',
        image_url: '',
        published: true
      });
      setSaveStatus({ message: `New page "${pageObj.title}" created and published in Supabase!` });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({ message: `Failed to create page in Supabase: ${res.error}`, isError: true });
    }
  };

  // Delete Page Handler (protects core pages)
  const handleDeletePage = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete page "/${id}"?`)) {
      setSaveStatus(null);
      await ensureAdminSupabaseSession();
      const res = await deletePage(id);
      if (res.success) {
        const updated = pagesList.filter(p => p.id !== id);
        setPagesList(updated);
        onUpdatePages(updated);
        setSaveStatus({ message: `Page "/${id}" removed from database.` });
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({ message: `Failed to delete page: ${res.error}`, isError: true });
      }
    }
  };

  // Status changes for appointments
  const handleStatusChange = async (id: string, status: AppointmentRequest['status']) => {
    await updateAppointmentStatus(id, status);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment request?')) {
      await deleteAppointmentRequest(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  // Message handlers
  const handleMessageStatus = async (id: string, status: ContactMessage['status']) => {
    await updateMessageStatus(id, status);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  // Service toggle & save
  const handleToggleService = async (id: string) => {
    const updated = servicesList.map(s => s.id === id ? { ...s, published: !s.published } : s);
    const res = await saveMedicalServices(updated);
    if (res.success) {
      setServicesList(updated);
      onUpdateServices(updated);
      setSaveStatus({ message: 'Service visibility updated and synchronized in Supabase.' });
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus({ message: `Failed to update service in Supabase: ${res.error}`, isError: true });
    }
  };

  const handleSaveEditedService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = servicesList.map(s => s.id === editingService.id ? editingService : s);
    const res = await saveMedicalServices(updated);
    if (res.success) {
      setServicesList(updated);
      onUpdateServices(updated);
      setEditingService(null);
      setSaveStatus({ message: `Service "${editingService.service_name}" saved to Supabase successfully!` });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({ message: `Failed to save service: ${res.error}`, isError: true });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const res = await deleteMedicalService(id);
      if (res.success) {
        const updated = servicesList.filter(s => s.id !== id);
        setServicesList(updated);
        onUpdateServices(updated);
        setSaveStatus({ message: 'Service removed from Supabase successfully.' });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert(`Failed to delete service: ${res.error}`);
      }
    }
  };

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'service') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadMessage(null);

    try {
      const res = await uploadWebsiteImage(file);
      if (res.url) {
        if (target === 'hero') {
          const updatedSettings = { ...settingsForm, hero_image_url: res.url };
          setSettingsForm(updatedSettings);
          const saveRes = await updateWebsiteSettings(updatedSettings);
          if (saveRes.success) {
            onUpdateSettings(updatedSettings);
            setUploadMessage('Hero image uploaded and saved to Supabase successfully.');
          } else {
            setUploadMessage(`Image uploaded, but settings save failed: ${saveRes.error}`);
          }
        } else if (target === 'service' && editingService) {
          const updatedService = { ...editingService, image_url: res.url };
          setEditingService(updatedService);
          const updated = servicesList.map(s => s.id === updatedService.id ? updatedService : s);
          setServicesList(updated);
          await saveMedicalServices(updated);
          onUpdateServices(updated);
          setUploadMessage('Service image uploaded and linked in Supabase successfully.');
        }
      } else {
        setUploadMessage(res.error || 'Failed to upload image.');
      }
    } catch {
      setUploadMessage('An error occurred during image upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.professional_title) return;

    const member: HealthcareStaff = {
      id: `staff_${Date.now()}`,
      name: newStaff.name,
      professional_title: newStaff.professional_title,
      department: newStaff.department || 'General Medicine',
      qualifications: newStaff.qualifications || '',
      biography: newStaff.biography || '',
      image_url: newStaff.image_url,
      display_order: Number(newStaff.display_order) || staffList.length + 1,
      published: Boolean(newStaff.published),
      created_at: new Date().toISOString()
    };

    const updated = [...staffList, member];
    const res = await saveHealthcareStaff(updated);
    if (res.success) {
      setStaffList(updated);
      onUpdateStaff(updated);
      setNewStaffModal(false);
      setNewStaff({
        name: '',
        professional_title: '',
        department: 'General Medicine',
        qualifications: '',
        biography: '',
        published: true,
        display_order: updated.length + 1
      });
      setSaveStatus({ message: 'Healthcare staff profile added and saved to Supabase!' });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({ message: `Error adding staff to Supabase: ${res.error}`, isError: true });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm('Delete this staff profile?')) {
      const res = await deleteHealthcareStaff(id);
      if (res.success) {
        const updated = staffList.filter(s => s.id !== id);
        setStaffList(updated);
        onUpdateStaff(updated);
        setSaveStatus({ message: 'Staff profile removed from Supabase.' });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert(`Failed to delete staff: ${res.error}`);
      }
    }
  };

  // Add insurance
  const handleAddInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsurance.provider_name) return;

    const prov: InsuranceProvider = {
      id: `ins_${Date.now()}`,
      provider_name: newInsurance.provider_name,
      description: newInsurance.description || '',
      contact_note: newInsurance.contact_note || '',
      published: Boolean(newInsurance.published),
      display_order: Number(newInsurance.display_order) || insuranceList.length + 1
    };

    const updated = [...insuranceList, prov];
    const res = await saveInsuranceProviders(updated);
    if (res.success) {
      setInsuranceList(updated);
      onUpdateInsurance(updated);
      setNewInsuranceModal(false);
      setNewInsurance({
        provider_name: '',
        description: '',
        contact_note: '',
        published: true,
        display_order: updated.length + 1
      });
      setSaveStatus({ message: 'Insurance provider added and saved to Supabase!' });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({ message: `Error adding insurance provider: ${res.error}`, isError: true });
    }
  };

  const handleDeleteInsurance = async (id: string) => {
    if (window.confirm('Delete this insurance partner?')) {
      const res = await deleteInsuranceProvider(id);
      if (res.success) {
        const updated = insuranceList.filter(i => i.id !== id);
        setInsuranceList(updated);
        onUpdateInsurance(updated);
        setSaveStatus({ message: 'Insurance provider deleted from Supabase.' });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert(`Failed to delete insurance provider: ${res.error}`);
      }
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyRlsSql = () => {
    navigator.clipboard.writeText(FIX_RLS_SQL_SCRIPT);
    setCopiedRlsSql(true);
    setTimeout(() => setCopiedRlsSql(false), 2500);
  };

  // ===============================================================
  // LOGIN SCREEN
  // ===============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#073B5C] text-teal-300 rounded-xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#073B5C]">
              Tripple-T Management Portal
            </h1>
            <p className="text-xs text-slate-500">
              Restricted to authorized clinic administration & management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter administrator email"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#249A96] text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#073B5C] hover:bg-[#0B5278] text-white py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {authLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Authorized administrative access only.
          </p>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-500 hover:text-[#073B5C] transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===============================================================
  // AUTHENTICATED DASHBOARD
  // ===============================================================
  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
  const publishedServicesCount = servicesList.filter(s => s.published).length;
  const publishedPagesCount = pagesList.filter(p => p.published).length;

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#073B5C] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              Tripple-T Health Center · Management Portal
            </h1>
            <p className="text-xs text-teal-300 flex flex-wrap items-center gap-2 mt-0.5">
              <span>Duazon, Monrovia, Liberia</span>
              <span>·</span>
              {supabaseAuthStatus.authenticated ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authenticated: {supabaseAuthStatus.email || 'tripplethospital@gmail.com'}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectAuth}
                  disabled={connectingAuth}
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-white underline cursor-pointer"
                  title="Click to establish authenticated Supabase session"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>{connectingAuth ? 'Connecting...' : 'Connect Supabase Auth Session'}</span>
                </button>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            View Public Site
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-medium text-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold shadow-xs ${
          saveStatus.isError
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {saveStatus.isError ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>
          <button
            onClick={() => setSaveStatus(null)}
            className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'appointments'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Appointments {pendingAppointmentsCount > 0 && `(${pendingAppointmentsCount})`}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'messages'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Messages {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'pages'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Website Pages
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'services'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Services ({servicesList.length})
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'images'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Image Manager
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'team'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Healthcare Team
        </button>

        <button
          onClick={() => setActiveTab('insurance')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'insurance'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Insurance
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Contact & Social Links
        </button>

        <button
          onClick={() => setActiveTab('setup')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'setup'
              ? 'bg-[#073B5C] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Supabase & Auth Setup
        </button>
      </div>

      {/* =========================================================== */}
      {/* TAB: DASHBOARD OVERVIEW                                    */}
      {/* =========================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Appointments
              </span>
              <p className="text-3xl font-extrabold text-[#073B5C]">
                {pendingAppointmentsCount}
              </p>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs font-semibold text-teal-600 hover:underline pt-1 block cursor-pointer"
              >
                Review inquiries →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Unread Messages
              </span>
              <p className="text-3xl font-extrabold text-[#073B5C]">
                {unreadMessagesCount}
              </p>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-xs font-semibold text-teal-600 hover:underline pt-1 block cursor-pointer"
              >
                View messages →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Published Medical Services
              </span>
              <p className="text-3xl font-extrabold text-[#073B5C]">
                {publishedServicesCount}
              </p>
              <button
                onClick={() => setActiveTab('services')}
                className="text-xs font-semibold text-teal-600 hover:underline pt-1 block cursor-pointer"
              >
                Manage services →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Website Pages
              </span>
              <p className="text-3xl font-extrabold text-[#073B5C]">
                {publishedPagesCount}
              </p>
              <button
                onClick={() => setActiveTab('pages')}
                className="text-xs font-semibold text-teal-600 hover:underline pt-1 block cursor-pointer"
              >
                Edit page content →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#073B5C]">
              Liberia Location & Contact Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-800">Physical Location:</p>
                <p className="mt-1">{settings.location_address}, {settings.location_landmark}, {settings.location_city}, {settings.location_country}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-800">Clinic Telephone Lines:</p>
                <p className="mt-1">
                  {settings.phone_primary ? settings.phone_primary : 'No verified phone line entered yet (Update in Settings)'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-800">WhatsApp Integration:</p>
                <p className="mt-1 text-slate-600">
                  Target destination active (Number protected from public plaintext display per privacy policy).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: APPOINTMENTS                                          */}
      {/* =========================================================== */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Patient Appointment Requests
              </h2>
              <p className="text-xs text-slate-500">
                Inquiries submitted via the booking form. Confirmations remain a manual clinical desk action.
              </p>
            </div>
            <button
              onClick={loadAdminData}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#073B5C] bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No appointment requests yet.</p>
              <p className="text-xs text-slate-500">New requests submitted from the website will appear here in real time.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Patient Name</th>
                      <th className="p-4">Telephone</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Requested Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">{apt.patient_name}</p>
                          {apt.email && <p className="text-[11px] text-slate-400">{apt.email}</p>}
                          {apt.message && (
                            <p className="text-[11px] text-slate-500 italic mt-1 max-w-xs">"{apt.message}"</p>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <a
                            href={`tel:${apt.telephone.replace(/\s+/g, '')}`}
                            className="font-medium text-[#073B5C] hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-[#249A96]" />
                            {apt.telephone}
                          </a>
                        </td>
                        <td className="p-4 font-medium text-slate-800">
                          {apt.preferred_service}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{apt.preferred_date}</p>
                          <p className="text-[11px] text-slate-500">{apt.preferred_time || 'Clinic Hours'}</p>
                        </td>
                        <td className="p-4">
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                            className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : apt.status === 'contacted'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : apt.status === 'cancelled'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: CONTACT MESSAGES                                      */}
      {/* =========================================================== */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Website Inquiry Messages
              </h2>
              <p className="text-xs text-slate-500">
                General questions sent through the Contact Us form.
              </p>
            </div>
            <button
              onClick={loadAdminData}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#073B5C] bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <Mail className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No contact messages.</p>
              <p className="text-xs text-slate-500">Incoming inquiries will be listed here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white rounded-xl p-5 border transition-all ${
                    msg.status === 'unread' ? 'border-[#249A96]/50 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#073B5C] text-sm">{msg.subject}</h3>
                        {msg.status === 'unread' && (
                          <span className="text-[10px] bg-[#249A96] text-white px-2 py-0.5 rounded font-semibold">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        From: <strong className="text-slate-800">{msg.name}</strong> · Tel: {msg.telephone} {msg.email && `· ${msg.email}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={msg.status}
                        onChange={(e) => handleMessageStatus(msg.id, e.target.value as any)}
                        className="text-xs px-2.5 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Mark Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: WEBSITE PAGES CONTENT                                 */}
      {/* =========================================================== */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Website Pages & Content Editor
              </h2>
              <p className="text-xs text-slate-500">
                Manage page titles, headings, image references, and publication status for all website pages.
              </p>
            </div>

            <button
              onClick={() => setNewPageModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#073B5C] hover:bg-[#0B5278] text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Page</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagesList.map((pg) => {
              const isCore = ['home', 'about', 'services', 'team', 'insurance', 'contact'].includes(pg.id);
              return (
                <div key={pg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#073B5C] text-sm">
                        {pg.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (/{pg.id === 'home' ? '' : pg.id})
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      pg.published
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pg.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {pg.image_url && (
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={pg.image_url} alt={pg.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Heading</p>
                    <p className="text-xs text-slate-800 font-medium">{pg.heading}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Content / Subheading</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{pg.subheading}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {isCore ? 'Core System Page' : 'Custom Page'}
                    </span>
                    <div className="flex items-center gap-2">
                      {!isCore && (
                        <button
                          onClick={() => handleDeletePage(pg.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete this page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingPage(pg)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#249A96] hover:text-[#1e8581] cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Page</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Page Modal */}
          {editingPage && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#073B5C]">
                      Edit Page: {editingPage.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">Route ID: {editingPage.id}</p>
                  </div>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveEditedPage} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Title (Navigation)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Main Heading (H1)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPage.heading}
                      onChange={(e) => setEditingPage({ ...editingPage, heading: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subheading / Page Content Text
                    </label>
                    <textarea
                      rows={3}
                      value={editingPage.subheading}
                      onChange={(e) => setEditingPage({ ...editingPage, subheading: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Banner / Page Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /assets/aistudio/... or https://..."
                      value={editingPage.image_url || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, image_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={editingPage.seo_title}
                      onChange={(e) => setEditingPage({ ...editingPage, seo_title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingPage.meta_description}
                      onChange={(e) => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="edit_page_published"
                      checked={Boolean(editingPage.published)}
                      onChange={(e) => setEditingPage({ ...editingPage, published: e.target.checked })}
                      className="w-4 h-4 text-[#249A96] rounded border-slate-300"
                    />
                    <label htmlFor="edit_page_published" className="text-xs text-slate-700 cursor-pointer">
                      <strong>Published:</strong> Make this page publicly accessible to website visitors. (Uncheck to save as draft)
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPage(null)}
                      className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#249A96] hover:bg-[#1e8581] text-white rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Page to Supabase</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Create New Page Modal */}
          {newPageModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-[#073B5C]">
                    Create New Website Page
                  </h3>
                  <button
                    onClick={() => setNewPageModal(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreatePage} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Route ID (URL slug, e.g. "privacy", "careers")
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. privacy"
                      value={newPage.id || ''}
                      onChange={(e) => setNewPage({ ...newPage, id: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Privacy Policy"
                      value={newPage.title || ''}
                      onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Main Heading (H1)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clinic Privacy & Patient Rights"
                      value={newPage.heading || ''}
                      onChange={(e) => setNewPage({ ...newPage, heading: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Description / Body Content
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter introductory content or description..."
                      value={newPage.subheading || ''}
                      onChange={(e) => setNewPage({ ...newPage, subheading: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Banner Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or /assets/..."
                      value={newPage.image_url || ''}
                      onChange={(e) => setNewPage({ ...newPage, image_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="new_page_published"
                      checked={Boolean(newPage.published)}
                      onChange={(e) => setNewPage({ ...newPage, published: e.target.checked })}
                      className="w-4 h-4 text-[#249A96] rounded border-slate-300"
                    />
                    <label htmlFor="new_page_published" className="text-xs text-slate-700 cursor-pointer">
                      <strong>Published:</strong> Immediately publish this page.
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setNewPageModal(false)}
                      className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#073B5C] hover:bg-[#0B5278] text-white rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Page in Supabase</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: MEDICAL SERVICES                                      */}
      {/* =========================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#073B5C]">
              Manage Medical Services
            </h2>
            <p className="text-xs text-slate-500">
              The 6 verified clinical services. You can update descriptions or toggle visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicesList.map((svc) => (
              <div
                key={svc.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#073B5C] text-sm">
                      {svc.service_name}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      svc.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {svc.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {svc.short_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleService(svc.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#073B5C] cursor-pointer"
                  >
                    {svc.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{svc.published ? 'Hide from Website' : 'Publish'}</span>
                  </button>
                  <button
                    onClick={() => setEditingService(svc)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#249A96] hover:text-[#1e8581] cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Description</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Service Modal */}
          {editingService && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-[#073B5C]">
                  Edit Service: {editingService.service_name}
                </h3>
                <form onSubmit={handleSaveEditedService} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingService.short_description}
                      onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Overview
                    </label>
                    <textarea
                      rows={3}
                      value={editingService.full_description}
                      onChange={(e) => setEditingService({ ...editingService, full_description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#249A96] text-white rounded-lg cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: IMAGE MANAGER                                         */}
      {/* =========================================================== */}
      {activeTab === 'images' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#073B5C] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#249A96]" />
              <span>Website Image Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload, preview, or update hero and service images. Uses Supabase Storage with local fallback.
            </p>
          </div>

          {uploadMessage && (
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#249A96] shrink-0" />
              <span>{uploadMessage}</span>
            </div>
          )}

          {/* Homepage Hero Image Box */}
          <div className="p-5 border border-slate-200 rounded-xl space-y-4">
            <h3 className="font-bold text-[#073B5C] text-sm">
              Homepage Primary Hero Visual
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={settingsForm.hero_image_url || "/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png"}
                  alt="Hero Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  The primary hero image prominently features Black African healthcare personnel and baby in a clean, modern clinical environment.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="inline-flex items-center gap-2 bg-[#073B5C] hover:bg-[#0B5278] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload New Hero Photo'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'hero')}
                      disabled={uploadingImage}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...settingsForm,
                        hero_image_url: '/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png'
                      };
                      setSettingsForm(updated);
                      updateWebsiteSettings(updated);
                      onUpdateSettings(updated);
                      setUploadMessage('Reset to verified default hero image.');
                    }}
                    className="px-3.5 py-2 text-xs border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    Restore Original Hero
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: HEALTHCARE TEAM                                       */}
      {/* =========================================================== */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Healthcare Team Profiles
              </h2>
              <p className="text-xs text-slate-500">
                Manage staff profiles. Only verified personnel should be published per clinic policy.
              </p>
            </div>
            <button
              onClick={() => setNewStaffModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#249A96] hover:bg-[#1e8581] text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Profile</span>
            </button>
          </div>

          {staffList.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No staff profiles added yet.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                The public page currently shows: "Our healthcare team information will be updated shortly." Use the "Add Staff Profile" button above once verified personnel bios are ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staffList.map((member) => (
                <div key={member.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#073B5C] text-sm">{member.name}</h3>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-teal-600 font-medium">{member.professional_title} · {member.department}</p>
                  <p className="text-xs text-slate-500">{member.biography}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Staff Modal */}
          {newStaffModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-[#073B5C]">
                  Add Verified Staff Profile
                </h3>
                <form onSubmit={handleAddStaff} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="e.g. Dr. Arthur Doe"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Professional Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newStaff.professional_title}
                        onChange={(e) => setNewStaff({ ...newStaff, professional_title: e.target.value })}
                        placeholder="e.g. Medical Officer"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={newStaff.department}
                        onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                        placeholder="e.g. General Medical Care"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      value={newStaff.qualifications}
                      onChange={(e) => setNewStaff({ ...newStaff, qualifications: e.target.value })}
                      placeholder="e.g. MD, FWACS"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Biography
                    </label>
                    <textarea
                      rows={2}
                      value={newStaff.biography}
                      onChange={(e) => setNewStaff({ ...newStaff, biography: e.target.value })}
                      placeholder="Clinical background..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setNewStaffModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#249A96] text-white rounded-lg cursor-pointer"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: INSURANCE PARTNERS                                    */}
      {/* =========================================================== */}
      {activeTab === 'insurance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Health Insurance Partners
              </h2>
              <p className="text-xs text-slate-500">
                Partners: Saar, NICOL (National Insurance Corporation of Liberia), and Activa.
              </p>
            </div>
            <button
              onClick={() => setNewInsuranceModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#249A96] hover:bg-[#1e8581] text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Insurance Provider</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insuranceList.map((ins) => (
              <div key={ins.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#073B5C] text-sm">{ins.provider_name}</h3>
                  <button
                    onClick={() => handleDeleteInsurance(ins.id)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ins.description}</p>
                {ins.contact_note && (
                  <p className="text-[11px] text-teal-600 bg-teal-50 p-2 rounded">{ins.contact_note}</p>
                )}
              </div>
            ))}
          </div>

          {/* Add Insurance Modal */}
          {newInsuranceModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-[#073B5C]">
                  Add Insurance Provider
                </h3>
                <form onSubmit={handleAddInsurance} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Provider Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newInsurance.provider_name}
                      onChange={(e) => setNewInsurance({ ...newInsurance, provider_name: e.target.value })}
                      placeholder="e.g. NICOL"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newInsurance.description}
                      onChange={(e) => setNewInsurance({ ...newInsurance, description: e.target.value })}
                      placeholder="Coverage overview..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setNewInsuranceModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#249A96] text-white rounded-lg cursor-pointer"
                    >
                      Save Partner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: WEBSITE SETTINGS & SOCIAL LINKS                       */}
      {/* =========================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C]">
                Contact Information, Location & Social Links
              </h2>
              <p className="text-xs text-slate-500">
                Update verified clinic contacts, Liberia location, hours, social links, and WhatsApp routing.
              </p>
            </div>
            {settingsSaved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Identity & Location */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b pb-1">
                Hospital Identification & Liberia Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={settingsForm.hospital_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hospital_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={settingsForm.location_country}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location_country: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Highway / Address</label>
                  <input
                    type="text"
                    value={settingsForm.location_address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location_address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={settingsForm.location_landmark}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location_landmark: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={settingsForm.location_city}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location_city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Telephone Lines & Email */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b pb-1">
                Telephone & Email (Liberia Lines)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Telephone</label>
                  <input
                    type="text"
                    placeholder="+231 XX XXX XXXX"
                    value={settingsForm.phone_primary}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary Telephone</label>
                  <input
                    type="text"
                    placeholder="+231 XX XXX XXXX"
                    value={settingsForm.phone_secondary}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone_secondary: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* WhatsApp Internal Routing */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Destination Number (Internal routing only; never rendered as text on public site)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsapp_number}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                  placeholder="231770183894"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Current target: +231 77 018 3894 (international format 231770183894).
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b pb-1">
                Social Media Links (Connect With Us)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={settingsForm.facebook_url || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebook_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={settingsForm.instagram_url || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">TikTok URL</label>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@..."
                    value={settingsForm.tiktok_url || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktok_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b pb-1">
                Opening Hours & Emergency Notices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mon–Fri Hours</label>
                  <input
                    type="text"
                    value={settingsForm.hours_weekday}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours_weekday: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Emergency notice"
                    value={settingsForm.hours_weekday_emergency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours_weekday_emergency: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Saturday Hours</label>
                  <input
                    type="text"
                    value={settingsForm.hours_saturday}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours_saturday: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Emergency notice"
                    value={settingsForm.hours_saturday_emergency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours_saturday_emergency: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sunday & Holidays</label>
                  <input
                    type="text"
                    value={settingsForm.hours_sunday_holiday}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours_sunday_holiday: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#249A96] hover:bg-[#1e8581] text-white px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact & Social Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================== */}
      {/* TAB: SUPABASE & ADMIN SETUP GUIDE                          */}
      {/* =========================================================== */}
      {activeTab === 'setup' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#073B5C] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#249A96]" />
                <span>Supabase Setup & Administrator Credentials Guide</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Step-by-step instructions for Supabase Auth, database migration, and password management.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-2 bg-[#073B5C] hover:bg-[#0B5278] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? 'Copied SQL!' : 'Copy Supabase SQL'}</span>
            </button>
          </div>

          {/* Urgent RLS Fix Section */}
          <div className="p-5 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">
                    Fix: Row Level Security on "website_pages" Table
                  </h3>
                  <p className="text-xs text-amber-800">
                    Resolves: <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">new row violates row-level security policy for table "website_pages"</code>
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyRlsSql}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedRlsSql ? 'Copied RLS Fix SQL!' : 'Copy RLS Fix SQL'}</span>
              </button>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              This migration creates the database-verifiable <code className="font-mono bg-white px-1 rounded">public.admin_users</code> table, establishes the <code className="font-mono bg-white px-1 rounded">public.is_admin()</code> security definer function, adds <code className="font-mono bg-white px-1 rounded">image_url</code> to website_pages, and configures exact granular RLS policies for <strong>SELECT</strong> (public published only; admins all), <strong>INSERT</strong> (admin only), <strong>UPDATE</strong> (admin only with USING + WITH CHECK), and <strong>DELETE</strong>.
            </p>

            <details className="text-xs">
              <summary className="cursor-pointer font-semibold text-amber-800 hover:underline">
                View RLS Fix SQL Script
              </summary>
              <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] overflow-x-auto max-h-56 leading-relaxed">
                {FIX_RLS_SQL_SCRIPT}
              </pre>
            </details>
          </div>

          {/* Setup Guide Accordion/Steps */}
          <div className="space-y-4 text-xs text-slate-700">
            {/* Step 1: Account Creation in Supabase */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="font-bold text-[#073B5C] text-sm">
                  1. Administrator Account in Supabase Auth
                </p>
                <button
                  onClick={async () => {
                    setSyncLoading(true);
                    setSyncResult(null);
                    const res = await syncAdminUserToSupabase();
                    setSyncResult(res.message);
                    setSyncLoading(false);
                  }}
                  disabled={syncLoading}
                  className="inline-flex items-center gap-1.5 bg-[#249A96] hover:bg-[#1e8581] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                  <span>{syncLoading ? 'Syncing...' : 'Register / Sync Admin to Supabase'}</span>
                </button>
              </div>

              {syncResult && (
                <div className="p-2.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs">
                  {syncResult}
                </div>
              )}

              <p className="text-slate-600 leading-relaxed">
                Management Login: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">tripplethospital@gmail.com</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">Tripplet123!</code>
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
                <li>Log in to your <strong>Supabase Project Dashboard</strong> (<a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-teal-600 underline">supabase.com</a>).</li>
                <li>Navigate to <strong>Authentication</strong> → <strong>Users</strong> in the left menu.</li>
                <li>If not already present, click <strong>Add User</strong> → <strong>Create User</strong>, enter <code className="bg-white px-1.5 py-0.5 rounded border">tripplethospital@gmail.com</code> and <code className="bg-white px-1.5 py-0.5 rounded border">Tripplet123!</code> with <strong>Auto Confirm User</strong> checked.</li>
              </ol>
            </div>

            {/* Step 2: Running SQL Schema */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-[#073B5C] text-sm">
                2. Initialize Database Tables, RLS Policies & Storage
              </p>
              <p className="text-slate-600 leading-relaxed">
                Click the <strong>"Copy Supabase SQL"</strong> button above, navigate to <strong>SQL Editor</strong> in Supabase, paste into a new query, and click <strong>Run</strong>. This creates all 7 tables with Row-Level Security policies ensuring public visitors cannot view patient appointments or contact inquiries while allowing public website reads and admin dashboard updates.
              </p>
            </div>

            {/* Step 3: Password Reset */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-[#073B5C] text-sm">
                3. How to Reset or Change the Administrator Password
              </p>
              <p className="text-slate-600 leading-relaxed">
                In Supabase Dashboard → <strong>Authentication</strong> → <strong>Users</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Find <code className="bg-white px-1 rounded">tripplethospital@gmail.com</code>, click the three dots (<code className="bg-white px-1 rounded">•••</code>), and select <strong>Reset Password</strong>.</li>
                <li>You can also send a password recovery email directly to the administrator.</li>
              </ul>
            </div>

            {/* Step 4: Environment Variables in Vercel */}
            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
              <p className="font-bold text-[#073B5C] text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>4. Vercel Deployment & Environment Variables Configuration</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                When deploying to Vercel, navigate to <strong>Project Settings → Environment Variables</strong> and add these two variables for <strong>Production</strong>, <strong>Preview</strong>, and <strong>Development</strong>:
              </p>

              <div className="space-y-2.5">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Variable 1 Name</span>
                    <code className="font-mono text-xs text-[#073B5C] font-semibold">VITE_SUPABASE_URL</code>
                    <div className="text-[11px] text-slate-600 mt-0.5 font-mono break-all">https://utxqyzkzusxlnoaljcnq.supabase.co</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://utxqyzkzusxlnoaljcnq.supabase.co');
                      setCopiedVercelUrl(true);
                      setTimeout(() => setCopiedVercelUrl(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVercelUrl ? 'Copied URL!' : 'Copy Value'}</span>
                  </button>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0 pr-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Variable 2 Name</span>
                    <code className="font-mono text-xs text-[#073B5C] font-semibold">VITE_SUPABASE_ANON_KEY</code>
                    <div className="text-[11px] text-slate-600 mt-0.5 font-mono truncate max-w-sm">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eHF5emt6dXN4bG5vYWxqY25xIiwicm9sZSI6ImFub24i...</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eHF5emt6dXN4bG5vYWxqY25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjgxOTYsImV4cCI6MjEwODcwNDE5Nn0.Wiz49HNODjJassFAkMKifh1H_4ltt1mT456OryOYUXk');
                      setCopiedVercelKey(true);
                      setTimeout(() => setCopiedVercelKey(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVercelKey ? 'Copied Key!' : 'Copy Value'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-blue-200 text-slate-600 text-[11px] space-y-1">
                <p className="font-semibold text-[#073B5C]">✓ SPA Routing Configured:</p>
                <p>The root <code className="bg-slate-100 px-1 rounded font-mono">vercel.json</code> includes SPA rewrites so direct navigation to <code className="font-mono">/admin</code>, <code className="font-mono">/services</code>, and other pages loads properly without 404 errors on Vercel.</p>
              </div>
            </div>
          </div>

          {/* SQL Editor Code Block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Supabase SQL Migration Script (Liberia Edition):</span>
              <span className="text-[11px] text-slate-400">Includes RLS policies & tables</span>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-80 border border-slate-800 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
