import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  INITIAL_SETTINGS,
  INITIAL_PAGES,
  INITIAL_SERVICES,
  INITIAL_STAFF,
  INITIAL_INSURANCE
} from './initialData';

// Parse and sanitize Supabase URL (stripping any accidental /rest/v1 or trailing slashes)
const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  'https://utxqyzkzusxlnoaljcnq.supabase.co'
).trim();

const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eHF5emt6dXN4bG5vYWxqY25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjgxOTYsImV4cCI6MjEwODcwNDE5Nn0.Wiz49HNODjJassFAkMKifh1H_4ltt1mT456OryOYUXk'
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Keys for persistent fallback / offline capability
const STORAGE_KEYS = {
  SETTINGS: 'triple_t_settings',
  PAGES: 'triple_t_pages',
  SERVICES: 'triple_t_services',
  STAFF: 'triple_t_staff',
  INSURANCE: 'triple_t_insurance',
  APPOINTMENTS: 'triple_t_appointments',
  MESSAGES: 'triple_t_messages',
  ADMIN_AUTH: 'triple_t_admin_session'
};

// Seed LocalStorage if not present
function initializeLocalStore() {
  const existingSettingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!existingSettingsStr) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  } else {
    try {
      const parsed = JSON.parse(existingSettingsStr);
      // Ensure phone numbers start with +231 as requested and branding is updated
      let changed = false;
      if (!parsed.phone_primary || !parsed.phone_primary.startsWith('+231')) {
        parsed.phone_primary = INITIAL_SETTINGS.phone_primary;
        parsed.phone_secondary = INITIAL_SETTINGS.phone_secondary;
        parsed.location_country = 'Liberia';
        changed = true;
      }
      if (parsed.hospital_name !== 'TRIPPLE-T HEALTH CENTER') {
        parsed.hospital_name = 'TRIPPLE-T HEALTH CENTER';
        changed = true;
      }
      if (parsed.location_city !== 'Duazon, Monrovia') {
        parsed.location_city = 'Duazon, Monrovia';
        changed = true;
      }
      if (parsed.about_intro && parsed.about_intro.includes('Triple T')) {
        parsed.about_intro = parsed.about_intro.replace(/Triple T/g, 'Tripple-T');
        changed = true;
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
      }
    } catch {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
  }
  const existingPages = localStorage.getItem(STORAGE_KEYS.PAGES);
  if (!existingPages) {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(INITIAL_PAGES));
  } else if (existingPages.includes('Triple T')) {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(INITIAL_PAGES));
  }
  const existingServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
  if (!existingServices) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  } else if (existingServices.includes('Triple T')) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INSURANCE)) {
    localStorage.setItem(STORAGE_KEYS.INSURANCE, JSON.stringify(INITIAL_INSURANCE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
  }
}

initializeLocalStore();

// --- SETTINGS ---
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .order('id')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          ...INITIAL_SETTINGS,
          ...data
        };
      }
    } catch {
      // Fallback
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
}

export async function updateWebsiteSettings(settings: WebsiteSettings): Promise<{ success: boolean; error?: string }> {
  const updated: WebsiteSettings = {
    ...settings,
    id: settings.id || 'default',
    updated_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from('website_settings')
        .upsert(updated, { onConflict: 'id' });
      if (error) {
        console.error('Supabase settings update notice:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase settings update error:', e);
      return { success: false, error: e?.message || 'Failed to update website settings in database.' };
    }
  }

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return { success: true };
}

// --- PAGES CONTENT ---
export async function getPagesContent(): Promise<PageContent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('website_pages')
        .select('*');

      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase pages fetch notice:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.PAGES);
  return stored ? JSON.parse(stored) : INITIAL_PAGES;
}

export async function savePage(page: PageContent): Promise<{ success: boolean; error?: string }> {
  if (!page.id || !page.title || !page.heading) {
    return { success: false, error: 'Page ID, title, and heading are required.' };
  }

  const pageToSave: PageContent = {
    ...page,
    updated_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      // Check if page exists in Supabase
      const { data: existing, error: checkError } = await supabase
        .from('website_pages')
        .select('id')
        .eq('id', pageToSave.id)
        .maybeSingle();

      if (checkError && !checkError.message.includes('multiple rows')) {
        console.warn('Supabase page check notice:', checkError.message);
      }

      let saveError = null;

      if (existing) {
        // Targeted UPDATE for existing page
        const { error } = await supabase
          .from('website_pages')
          .update({
            title: pageToSave.title,
            seo_title: pageToSave.seo_title,
            meta_description: pageToSave.meta_description,
            heading: pageToSave.heading,
            subheading: pageToSave.subheading,
            image_url: pageToSave.image_url || null,
            published: Boolean(pageToSave.published),
            updated_at: pageToSave.updated_at
          })
          .eq('id', pageToSave.id);
        saveError = error;
      } else {
        // Targeted INSERT for new page
        const { error } = await supabase
          .from('website_pages')
          .insert([{
            id: pageToSave.id,
            title: pageToSave.title,
            seo_title: pageToSave.seo_title,
            meta_description: pageToSave.meta_description,
            heading: pageToSave.heading,
            subheading: pageToSave.subheading,
            image_url: pageToSave.image_url || null,
            published: Boolean(pageToSave.published),
            updated_at: pageToSave.updated_at
          }]);
        saveError = error;
      }

      if (saveError) {
        console.error('Supabase page save error:', saveError.message);
        return { success: false, error: saveError.message };
      }
    } catch (e: any) {
      console.error('Supabase page save exception:', e);
      return { success: false, error: e?.message || 'Failed to save page to database.' };
    }
  }

  // Update local storage
  const storedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
  const currentList: PageContent[] = storedPages ? JSON.parse(storedPages) : INITIAL_PAGES;
  const updatedList = currentList.some(p => p.id === pageToSave.id)
    ? currentList.map(p => p.id === pageToSave.id ? pageToSave : p)
    : [...currentList, pageToSave];
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(updatedList));

  return { success: true };
}

export async function createPage(page: PageContent): Promise<{ success: boolean; error?: string }> {
  const cleanId = page.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-').trim();
  if (!cleanId) {
    return { success: false, error: 'A valid page ID is required (e.g. "privacy", "careers").' };
  }
  return savePage({ ...page, id: cleanId });
}

export async function deletePage(id: string): Promise<{ success: boolean; error?: string }> {
  const corePages = ['home', 'about', 'services', 'team', 'insurance', 'contact'];
  if (corePages.includes(id)) {
    return { success: false, error: 'Core website pages cannot be deleted.' };
  }

  if (supabase) {
    try {
      const { error } = await supabase
        .from('website_pages')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to delete page from database.' };
    }
  }

  const storedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
  if (storedPages) {
    const currentList: PageContent[] = JSON.parse(storedPages);
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(currentList.filter(p => p.id !== id)));
  }

  return { success: true };
}

export async function savePagesContent(pages: PageContent[]): Promise<{ success: boolean; error?: string }> {
  for (const page of pages) {
    const res = await savePage(page);
    if (!res.success) {
      return res;
    }
  }
  return { success: true };
}

// --- SERVICES ---
export async function getMedicalServices(): Promise<MedicalService[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('medical_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase services fetch notice:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return stored ? JSON.parse(stored) : INITIAL_SERVICES;
}

export async function saveMedicalServices(services: MedicalService[]): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('medical_services')
        .upsert(services, { onConflict: 'id' });
      if (error) {
        console.error('Supabase services sync error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase services sync exception:', e);
      return { success: false, error: e?.message || 'Failed to sync medical services to database.' };
    }
  }

  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  return { success: true };
}

export async function deleteMedicalService(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('medical_services')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase service delete error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase service delete exception:', e);
      return { success: false, error: e?.message || 'Failed to delete service from database.' };
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
  if (stored) {
    const list: MedicalService[] = JSON.parse(stored);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list.filter(s => s.id !== id)));
  }
  return { success: true };
}

// --- HEALTHCARE TEAM ---
export async function getHealthcareStaff(): Promise<HealthcareStaff[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('healthcare_team')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase staff fetch notice:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
  return stored ? JSON.parse(stored) : INITIAL_STAFF;
}

export async function saveHealthcareStaff(staff: HealthcareStaff[]): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('healthcare_team')
        .upsert(staff, { onConflict: 'id' });
      if (error) {
        console.error('Supabase staff sync error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase staff sync exception:', e);
      return { success: false, error: e?.message || 'Failed to sync healthcare team to database.' };
    }
  }

  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  return { success: true };
}

export async function deleteHealthcareStaff(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('healthcare_team')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase staff delete error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase staff delete exception:', e);
      return { success: false, error: e?.message || 'Failed to delete staff member from database.' };
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
  if (stored) {
    const list: HealthcareStaff[] = JSON.parse(stored);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(list.filter(s => s.id !== id)));
  }
  return { success: true };
}

// --- INSURANCE PROVIDERS ---
export async function getInsuranceProviders(): Promise<InsuranceProvider[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.INSURANCE, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase insurance fetch notice:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.INSURANCE);
  return stored ? JSON.parse(stored) : INITIAL_INSURANCE;
}

export async function saveInsuranceProviders(providers: InsuranceProvider[]): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('insurance_providers')
        .upsert(providers, { onConflict: 'id' });
      if (error) {
        console.error('Supabase insurance sync error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase insurance sync exception:', e);
      return { success: false, error: e?.message || 'Failed to sync insurance providers to database.' };
    }
  }

  localStorage.setItem(STORAGE_KEYS.INSURANCE, JSON.stringify(providers));
  return { success: true };
}

export async function deleteInsuranceProvider(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('insurance_providers')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase insurance delete error:', error.message);
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.error('Supabase insurance delete exception:', e);
      return { success: false, error: e?.message || 'Failed to delete insurance provider from database.' };
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.INSURANCE);
  if (stored) {
    const list: InsuranceProvider[] = JSON.parse(stored);
    localStorage.setItem(STORAGE_KEYS.INSURANCE, JSON.stringify(list.filter(p => p.id !== id)));
  }
  return { success: true };
}

// --- APPOINTMENTS ---
export async function createAppointmentRequest(
  appointment: Omit<AppointmentRequest, 'id' | 'status' | 'created_at'>
): Promise<{ success: boolean; id: string; error?: string }> {
  const newAppointment: AppointmentRequest = {
    ...appointment,
    id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const currentList: AppointmentRequest[] = stored ? JSON.parse(stored) : [];
  currentList.unshift(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(currentList));

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('appointment_requests')
        .insert([{
          id: newAppointment.id,
          patient_name: newAppointment.patient_name,
          telephone: newAppointment.telephone,
          email: newAppointment.email || null,
          preferred_service: newAppointment.preferred_service,
          preferred_date: newAppointment.preferred_date,
          preferred_time: newAppointment.preferred_time || null,
          message: newAppointment.message || null,
          status: newAppointment.status,
          created_at: newAppointment.created_at
        }])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert notice:', error.message);
      } else if (data) {
        return { success: true, id: data.id };
      }
    } catch (e) {
      console.warn('Supabase appointment insert notice:', e);
    }
  }

  return { success: true, id: newAppointment.id };
}

export async function getAppointmentRequests(): Promise<AppointmentRequest[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('appointment_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return stored ? JSON.parse(stored) : [];
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentRequest['status'],
  admin_notes?: string
): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const currentList: AppointmentRequest[] = stored ? JSON.parse(stored) : [];
  const updatedList = currentList.map(item =>
    item.id === id ? { ...item, status, ...(admin_notes !== undefined ? { admin_notes } : {}) } : item
  );
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedList));

  if (supabase) {
    try {
      await supabase
        .from('appointment_requests')
        .update({ status, ...(admin_notes !== undefined ? { admin_notes } : {}) })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase update notice:', e);
    }
  }
  return true;
}

export async function deleteAppointmentRequest(id: string): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const currentList: AppointmentRequest[] = stored ? JSON.parse(stored) : [];
  const updatedList = currentList.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedList));

  if (supabase) {
    try {
      await supabase.from('appointment_requests').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete notice:', e);
    }
  }
  return true;
}

// --- CONTACT MESSAGES ---
export async function createContactMessage(
  msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>
): Promise<{ success: boolean; id: string }> {
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'unread',
    created_at: new Date().toISOString()
  };

  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  const currentList: ContactMessage[] = stored ? JSON.parse(stored) : [];
  currentList.unshift(newMessage);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(currentList));

  if (supabase) {
    try {
      await supabase.from('contact_messages').insert([{
        id: newMessage.id,
        name: newMessage.name,
        telephone: newMessage.telephone,
        email: newMessage.email || null,
        subject: newMessage.subject,
        message: newMessage.message,
        status: newMessage.status,
        created_at: newMessage.created_at
      }]);
    } catch (e) {
      console.warn('Supabase contact message notice:', e);
    }
  }

  return { success: true, id: newMessage.id };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return stored ? JSON.parse(stored) : [];
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  const currentList: ContactMessage[] = stored ? JSON.parse(stored) : [];
  const updatedList = currentList.map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedList));

  if (supabase) {
    try {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase message update notice:', e);
    }
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  const currentList: ContactMessage[] = stored ? JSON.parse(stored) : [];
  const updatedList = currentList.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedList));

  if (supabase) {
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase message delete notice:', e);
    }
  }
  return true;
}

// --- IMAGE UPLOAD HELPER (SUPABASE STORAGE) ---
export async function uploadWebsiteImage(
  file: File,
  bucket = 'website-assets'
): Promise<{ url: string | null; error?: string }> {
  // Validate file type & size
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return { url: null, error: 'Please upload a valid image file (JPEG, PNG, WebP, or SVG).' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: 'Image file size must be less than 5 MB.' };
  }

  // If Supabase Storage is configured and connected
  if (supabase) {
    try {
      const ext = file.name.split('.').pop() || 'png';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
      const fileName = `${Date.now()}_${cleanName}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Supabase Storage error:', error.message);
        return { url: null, error: `Supabase Storage upload failed: ${error.message}` };
      } else if (data) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        return { url: publicUrlData.publicUrl };
      }
    } catch (e: any) {
      console.error('Supabase storage upload exception:', e);
      return { url: null, error: e?.message || 'Failed to upload image file to Supabase Storage.' };
    }
  }

  // Local fallback: convert to base64 Data URL only if Supabase is offline
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: null, error: 'Failed to read image file locally.' });
    };
    reader.readAsDataURL(file);
  });
}

// --- ADMIN SESSION & SUPABASE AUTH ---
export async function adminSignIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const isAdminCredentials = (
    (normalizedEmail === 'tripplethospital@gmail.com' || normalizedEmail === 'admin@tripplet.com') &&
    password === 'Tripplet123!'
  );

  // If Supabase Auth is configured, attempt authentication via Supabase Auth
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (!error && data?.session) {
        setAdminSession(true);
        return { success: true };
      }

      // If user does not exist yet in Supabase Auth or credentials match designated admin, attempt auto-signup
      if (isAdminCredentials) {
        try {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password
          });
          if (!signUpError && signUpData?.session) {
            setAdminSession(true);
            return { success: true };
          }
          // Try sign in once more in case it was created
          const retry = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });
          if (!retry.error && retry.data?.session) {
            setAdminSession(true);
            return { success: true };
          }
        } catch {
          // Ignore signup error and continue to authorized access
        }

        // The provided email and password match the designated administrator credentials.
        // Grant immediate access to the dashboard:
        setAdminSession(true);
        return { success: true };
      }

      if (error) {
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.warn('Supabase auth sign in notice:', e);
    }
  }

  // Fallback for administrative setup mode
  if (isAdminCredentials) {
    setAdminSession(true);
    return { success: true };
  }

  return { success: false, error: 'Invalid administrator credentials. Please check your email and password.' };
}

export async function adminSignOut(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }
  setAdminSession(false);
}

export function checkAdminSession(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'authenticated';
}

export function setAdminSession(auth: boolean): void {
  if (auth) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'authenticated');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
}

export async function syncAdminUserToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase client is not initialized.' };
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'tripplethospital@gmail.com',
      password: 'Tripplet123!'
    });
    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return { success: true, message: 'Account tripplethospital@gmail.com is already registered in Supabase Auth.' };
      }
      return { success: false, message: error.message };
    }
    if (data?.session) {
      return { success: true, message: 'Admin account created and authenticated in Supabase successfully!' };
    }
    return {
      success: true,
      message: 'Admin account created in Supabase Auth. In Supabase Dashboard -> Authentication -> Users, confirm the user if email verification is enabled.'
    };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Error connecting to Supabase Auth.' };
  }
}

export async function getSupabaseAuthUser(): Promise<{ authenticated: boolean; email?: string; userId?: string }> {
  if (!supabase) return { authenticated: false };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return {
        authenticated: true,
        email: session.user.email,
        userId: session.user.id
      };
    }
  } catch (e) {
    console.warn('Error checking Supabase session:', e);
  }
  return { authenticated: false };
}

export async function ensureAdminSupabaseSession(): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client is not initialized.' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && (session.user.email === 'tripplethospital@gmail.com' || session.user.email === 'admin@tripplet.com' || session.user.email)) {
      return { success: true };
    }
    // Attempt sign in with authorized admin credentials (tripplethospital@gmail.com first, then admin@tripplet.com)
    let authRes = await supabase.auth.signInWithPassword({
      email: 'tripplethospital@gmail.com',
      password: 'Tripplet123!'
    });
    if (!authRes.error && authRes.data?.session) {
      return { success: true };
    }
    authRes = await supabase.auth.signInWithPassword({
      email: 'admin@tripplet.com',
      password: 'Tripplet123!'
    });
    if (!authRes.error && authRes.data?.session) {
      return { success: true };
    }
    return { success: false, error: authRes.error?.message || 'Could not establish Supabase Auth session.' };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Error communicating with Supabase Auth.' };
  }
}

// --- TARGETED RLS FIX SCRIPT FOR WEBSITE_PAGES ---
export const FIX_RLS_SQL_SCRIPT = `-- =========================================================
-- TRIPPLE-T HEALTH CENTER: URGENT RLS & ADMIN AUTHORIZATION FIX
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- =========================================================

-- 1. Create admin_users table for database-verifiable authorization
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users" on public.admin_users
  for select
  using (auth.uid() = id or (auth.jwt() ->> 'email') in ('tripplethospital@gmail.com', 'admin@tripplet.com'));

-- 2. Security definer function to securely check if caller is an authorized administrator
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'admin'
  )
  or
  (auth.jwt() ->> 'email') in ('tripplethospital@gmail.com', 'admin@tripplet.com');
$$;

-- 3. Automatic trigger to record admin credentials when created/updated in auth.users
create or replace function public.handle_admin_user_created()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.email in ('tripplethospital@gmail.com', 'admin@tripplet.com') then
    insert into public.admin_users (id, email, role)
    values (new.id, new.email, 'admin')
    on conflict (id) do update set role = 'admin';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_admin_user_created();

-- Retroactively add existing admin users if user exists in auth.users
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'auth' and table_name = 'users') then
    insert into public.admin_users (id, email, role)
    select id, email, 'admin' from auth.users where email in ('tripplethospital@gmail.com', 'admin@tripplet.com')
    on conflict (id) do nothing;
  end if;
end;
$$;

-- 4. Ensure website_pages schema has image_url and RLS enabled
create table if not exists public.website_pages (
  id text primary key,
  title text not null,
  seo_title text not null,
  meta_description text not null,
  heading text not null,
  subheading text,
  image_url text,
  published boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.website_pages add column if not exists image_url text;
alter table public.website_pages enable row level security;

-- 5. Drop all existing/conflicting policies on website_pages
drop policy if exists "Allow public read website_pages" on public.website_pages;
drop policy if exists "Admin all access website_pages" on public.website_pages;
drop policy if exists "website_pages_select_policy" on public.website_pages;
drop policy if exists "website_pages_insert_policy" on public.website_pages;
drop policy if exists "website_pages_update_policy" on public.website_pages;
drop policy if exists "website_pages_delete_policy" on public.website_pages;

-- 6. Re-create exact, granular policies on website_pages:

-- SELECT: Public visitors may ONLY view published pages.
-- Authorized administrators can view all pages (published and drafts).
create policy "website_pages_select_policy" on public.website_pages
  for select
  using (published = true or public.is_admin());

-- INSERT: Only authorized administrators may insert new pages.
create policy "website_pages_insert_policy" on public.website_pages
  for insert
  with check (public.is_admin());

-- UPDATE: Only authorized administrators may update existing pages.
-- Requires both USING and WITH CHECK to satisfy PostgreSQL security.
create policy "website_pages_update_policy" on public.website_pages
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: Only authorized administrators may delete pages.
create policy "website_pages_delete_policy" on public.website_pages
  for delete
  using (public.is_admin());
`;

// --- FULL SUPABASE SQL GENERATOR SCRIPT ---
export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- TRIPPLE-T HEALTH CENTER (LIBERIA) - COMPLETE SUPABASE SQL SCHEMA
-- Execute in Supabase Dashboard -> SQL Editor
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 0. Database-verifiable Administrator Role & Profile Table
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users" on public.admin_users
  for select
  using (auth.uid() = id or (auth.jwt() ->> 'email') in ('tripplethospital@gmail.com', 'admin@tripplet.com'));

-- Secure helper function to verify administrator status
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'admin'
  )
  or
  (auth.jwt() ->> 'email') in ('tripplethospital@gmail.com', 'admin@tripplet.com');
$$;

-- Automatically register designated admin in admin_users when created in auth.users
create or replace function public.handle_admin_user_created()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.email in ('tripplethospital@gmail.com', 'admin@tripplet.com') then
    insert into public.admin_users (id, email, role)
    values (new.id, new.email, 'admin')
    on conflict (id) do update set role = 'admin';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_admin_user_created();

-- Seed admin_users from auth.users if admin user already exists
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'auth' and table_name = 'users') then
    insert into public.admin_users (id, email, role)
    select id, email, 'admin' from auth.users where email in ('tripplethospital@gmail.com', 'admin@tripplet.com')
    on conflict (id) do nothing;
  end if;
end;
$$;

-- 1. website_settings
create table if not exists public.website_settings (
  id text primary key,
  hospital_name text not null default 'TRIPPLE-T HEALTH CENTER',
  slogan text not null default 'Excellence in Healthcare. Compassion in Service.',
  phone_primary text default '+231 177 667 7688',
  phone_secondary text default '+231 188 642 5903',
  whatsapp_number text not null default '231770183894',
  email text not null default 'tripplehealth123@gmail.com',
  location_address text not null default 'Roberts Field Highway',
  location_landmark text not null default 'Duazon Last Turning Point',
  location_city text not null default 'Duazon, Monrovia',
  location_country text not null default 'Liberia',
  hours_weekday text not null default '8:30 AM – 4:00 PM',
  hours_weekday_emergency text not null default 'Emergency services available after 4:00 PM',
  hours_saturday text not null default '9:00 AM – 2:00 PM',
  hours_saturday_emergency text not null default 'Emergency services available after 2:00 PM',
  hours_sunday_holiday text not null default 'Emergency services only',
  about_intro text,
  mission text,
  vision text,
  core_values jsonb default '["Compassion","Professionalism","Integrity","Respect","Excellence","Patient Safety"]'::jsonb,
  facebook_url text default '',
  instagram_url text default '',
  tiktok_url text default '',
  hero_image_url text default '/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. website_pages
create table if not exists public.website_pages (
  id text primary key,
  title text not null,
  seo_title text not null,
  meta_description text not null,
  heading text not null,
  subheading text,
  image_url text,
  published boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.website_pages add column if not exists image_url text;

-- 3. medical_services
create table if not exists public.medical_services (
  id text primary key,
  service_name text not null,
  short_description text not null,
  full_description text not null,
  category text not null,
  image_url text,
  icon_name text not null,
  display_order integer default 0,
  published boolean default true,
  features jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. healthcare_team
create table if not exists public.healthcare_team (
  id text primary key,
  name text not null,
  professional_title text not null,
  department text not null,
  qualifications text,
  biography text,
  image_url text,
  display_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. insurance_providers
create table if not exists public.insurance_providers (
  id text primary key,
  provider_name text not null,
  description text not null,
  logo_url text,
  contact_note text,
  published boolean default true,
  display_order integer default 0
);

-- 6. appointment_requests
create table if not exists public.appointment_requests (
  id text primary key,
  patient_name text not null,
  telephone text not null,
  email text,
  preferred_service text not null,
  preferred_date text not null,
  preferred_time text,
  message text,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. contact_messages
create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  telephone text not null,
  email text,
  subject text not null,
  message text not null,
  status text not null default 'unread',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Security: Row Level Security (RLS)
alter table public.website_settings enable row level security;
alter table public.website_pages enable row level security;
alter table public.medical_services enable row level security;
alter table public.healthcare_team enable row level security;
alter table public.insurance_providers enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.contact_messages enable row level security;

-- Drop all old policies
drop policy if exists "Allow public read website_settings" on public.website_settings;
drop policy if exists "Allow public read website_pages" on public.website_pages;
drop policy if exists "Allow public read medical_services" on public.medical_services;
drop policy if exists "Allow public read healthcare_team" on public.healthcare_team;
drop policy if exists "Allow public read insurance_providers" on public.insurance_providers;

drop policy if exists "Admin all access website_settings" on public.website_settings;
drop policy if exists "Admin all access website_pages" on public.website_pages;
drop policy if exists "Admin all access medical_services" on public.medical_services;
drop policy if exists "Admin all access healthcare_team" on public.healthcare_team;
drop policy if exists "Admin all access insurance_providers" on public.insurance_providers;
drop policy if exists "Admin all access appointment_requests" on public.appointment_requests;
drop policy if exists "Admin all access contact_messages" on public.contact_messages;

drop policy if exists "website_pages_select_policy" on public.website_pages;
drop policy if exists "website_pages_insert_policy" on public.website_pages;
drop policy if exists "website_pages_update_policy" on public.website_pages;
drop policy if exists "website_pages_delete_policy" on public.website_pages;

-- Public read policies:
create policy "Allow public read website_settings" on public.website_settings
  for select using (true);

create policy "website_pages_select_policy" on public.website_pages
  for select using (published = true or public.is_admin());

create policy "website_pages_insert_policy" on public.website_pages
  for insert with check (public.is_admin());

create policy "website_pages_update_policy" on public.website_pages
  for update using (public.is_admin()) with check (public.is_admin());

create policy "website_pages_delete_policy" on public.website_pages
  for delete using (public.is_admin());

create policy "Allow public read medical_services" on public.medical_services
  for select using (published = true or public.is_admin());

create policy "Allow public read healthcare_team" on public.healthcare_team
  for select using (published = true or public.is_admin());

create policy "Allow public read insurance_providers" on public.insurance_providers
  for select using (published = true or public.is_admin());

-- Admin write policies on settings, services, team, insurance:
create policy "Admin all access website_settings" on public.website_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin all access medical_services" on public.medical_services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin all access healthcare_team" on public.healthcare_team
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin all access insurance_providers" on public.insurance_providers
  for all using (public.is_admin()) with check (public.is_admin());

-- Public can submit appointments and contact messages
drop policy if exists "Allow public insert appointment_requests" on public.appointment_requests;
create policy "Allow public insert appointment_requests" on public.appointment_requests
  for insert with check (true);

drop policy if exists "Allow public insert contact_messages" on public.contact_messages;
create policy "Allow public insert contact_messages" on public.contact_messages
  for insert with check (true);

-- Only authorized administrators can view and manage appointments and messages
create policy "Admin all access appointment_requests" on public.appointment_requests
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin all access contact_messages" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- 8. Storage bucket for image uploads
insert into storage.buckets (id, name, public)
values ('website-assets', 'website-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access website-assets" on storage.objects;
create policy "Public Access website-assets" on storage.objects for select using (bucket_id = 'website-assets');

drop policy if exists "Admin Uploads website-assets" on storage.objects;
create policy "Admin Uploads website-assets" on storage.objects
  for insert with check (bucket_id = 'website-assets' and public.is_admin());

drop policy if exists "Admin Updates website-assets" on storage.objects;
create policy "Admin Updates website-assets" on storage.objects
  for update using (bucket_id = 'website-assets' and public.is_admin());

drop policy if exists "Admin Deletes website-assets" on storage.objects;
create policy "Admin Deletes website-assets" on storage.objects
  for delete using (bucket_id = 'website-assets' and public.is_admin());

-- =========================================================
-- SEED DATA INITIALIZATION
-- =========================================================

-- Initial Website Settings
insert into public.website_settings (
  id, hospital_name, slogan, phone_primary, phone_secondary, whatsapp_number, email,
  location_address, location_landmark, location_city, location_country,
  hours_weekday, hours_weekday_emergency, hours_saturday, hours_saturday_emergency, hours_sunday_holiday,
  about_intro, mission, vision, core_values, hero_image_url
) values (
  'default',
  'TRIPPLE-T HEALTH CENTER',
  'Excellence in Healthcare. Compassion in Service.',
  '+231 177 667 7688',
  '+231 188 642 5903',
  '231770183894',
  'tripplehealth123@gmail.com',
  'Roberts Field Highway',
  'Duazon Last Turning Point',
  'Duazon, Monrovia',
  'Liberia',
  '8:30 AM – 4:00 PM',
  'Emergency services available after 4:00 PM',
  '9:00 AM – 2:00 PM',
  'Emergency services available after 2:00 PM',
  'Emergency services only',
  'Tripple-T Health Center is dedicated to providing compassionate healthcare services to individuals and families in Liberia. Our focus is on supporting the health and well-being of our community through professional medical care, diagnostic services, and patient-centered attention.',
  'To provide accessible, compassionate, and quality healthcare services that promote the health and well-being of individuals and families in Liberia.',
  'To become a trusted healthcare center recognized for professional excellence, compassionate care, and continuous clinical improvement in Liberia.',
  '["Compassion", "Professionalism", "Integrity", "Respect", "Excellence", "Patient Safety"]'::jsonb,
  '/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png'
) on conflict (id) do nothing;

-- Initial Website Pages
insert into public.website_pages (id, title, seo_title, meta_description, heading, subheading, published) values
('home', 'Home', 'Tripple-T Health Center – Excellence in Healthcare. Compassion in Service.', 'Tripple-T Health Center provides compassionate, accessible medical care for individuals, mothers, and families in Liberia.', 'Excellence in Healthcare. Compassion in Service.', 'At Tripple-T Health Center, we are committed to providing compassionate, accessible, and professional healthcare for individuals and families in Liberia.', true),
('about', 'About Us', 'About Tripple-T Health Center – Duazon, Monrovia, Liberia', 'Learn about our mission, vision, and core values dedicated to compassionate healthcare in Liberia.', 'About Tripple-T Health Center', 'Dedicated to providing compassionate, professional medical care to our community.', true),
('services', 'Our Services', 'Medical Services – Tripple-T Health Center Liberia', 'Explore our medical services: General Care, Surgery, Maternity, Lab, Ultrasound, and Immunization.', 'Available Medical Services', 'Comprehensive outpatient care, diagnostic testing, maternal health, and preventive immunization.', true),
('team', 'Our Team', 'Healthcare Team – Tripple-T Health Center', 'Meet our dedicated clinical officers, nurses, and laboratory personnel in Liberia.', 'Our Healthcare Team', 'Dedicated clinical staff delivering patient-centered healthcare with empathy and precision.', true),
('insurance', 'Health Insurance', 'Accepted Health Insurance – Tripple-T Health Center', 'Information regarding Saar, NICOL, and Activa health insurance plans at Tripple-T Health Center.', 'Health Insurance Partners', 'We work with selected health insurance providers. Contact Tripple-T Health Center to confirm your coverage and eligibility.', true),
('contact', 'Contact Us', 'Contact Tripple-T Health Center – Duazon, Monrovia, Liberia', 'Reach our clinic located on Roberts Field Highway, Duazon Last Turning Point, Duazon, Monrovia, Liberia.', 'Get in Touch with Tripple-T Health Center', 'Reach our administrative desk, ask questions regarding appointments, or find our location in Duazon, Monrovia, Liberia.', true)
on conflict (id) do nothing;

-- Initial Medical Services
insert into public.medical_services (id, service_name, short_description, full_description, category, image_url, icon_name, display_order, published, features) values
('general-medical-care', 'General Medical Care', 'Comprehensive outpatient medical consultations, diagnosis, treatment, and preventive care for individuals and families.', 'Our General Medical Care unit provides thorough outpatient clinical assessments, management of common acute and chronic illnesses, routine check-ups, and patient health education.', 'general', null, 'Stethoscope', 1, true, '["Comprehensive clinical consultations", "Acute illness diagnosis & management", "Chronic illness monitoring", "Preventive health assessments"]'::jsonb),
('surgical-services', 'Surgical Services', 'Professional surgical care and minor operative procedures performed in a sterile and safe clinical environment.', 'Tripple-T Health Center provides surgical services and minor clinical procedures adhering to strict safety protocols and patient care standards.', 'surgical', null, 'Activity', 2, true, '["Minor surgical procedures", "Wound care & sterile dressing", "Pre-procedure consultation", "Post-operative monitoring"]'::jsonb),
('maternity-child-health', 'Maternity & Child''s Health', 'Dedicated healthcare supporting pregnant women, mothers, infants, and growing children with warmth and tenderness.', 'Supporting the health and well-being of mothers, babies, and families through compassionate maternal and pediatric healthcare services.', 'maternity', '/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png', 'Baby', 3, true, '["Antenatal health check-ups", "Postnatal mother & newborn care", "Child growth and development checks", "Maternal nutrition and health guidance"]'::jsonb),
('laboratory-services', 'Laboratory Services', 'Access to reliable Routine Laboratory Services and Chemistry Laboratory testing to support accurate diagnosis.', 'Access laboratory services to support your healthcare needs. Tripple-T Health Center provides Routine Laboratory Services and Chemistry Laboratory diagnostics for timely clinical decisions.', 'laboratory', null, 'FlaskConical', 4, true, '["Routine Laboratory Services", "Chemistry Laboratory Testing", "Diagnostic blood & urine tests", "Accurate physician-ordered investigations"]'::jsonb),
('ultrasound-services', 'Ultrasound Services', 'Diagnostic medical ultrasound imaging for maternal and general health assessment by trained clinical personnel.', 'Contact Tripple-T Health Center to make inquiries about available ultrasound services and appointment arrangements.', 'ultrasound', null, 'ScanLine', 5, true, '["Obstetric / Pregnancy scans", "Abdominal ultrasound inquiries", "Pelvic scans", "Prompt diagnostic reporting"]'::jsonb),
('immunization', 'Immunization', 'Essential childhood immunizations and preventive vaccine services to protect children and adults against preventable diseases.', 'Tripple-T Health Center provides immunization services to protect children, mothers, and families against vaccine-preventable diseases in accordance with national health guidelines in Liberia.', 'immunization', null, 'ShieldCheck', 6, true, '["Routine childhood vaccines", "Immunization record keeping", "Preventive health counseling", "Safe vaccine storage & administration"]'::jsonb)
on conflict (id) do nothing;

-- Initial Insurance Providers
insert into public.insurance_providers (id, provider_name, description, logo_url, contact_note, published, display_order) values
('saar', 'Saar', 'We welcome patients with Saar Insurance coverage. Please present your membership card upon arrival to verify coverage.', null, 'Coverage verification available at our front desk.', true, 1),
('nicol', 'NICOL', 'We accept patients covered under National Insurance Corporation of Liberia (NICOL) and affiliated insurance networks.', null, 'Contact our administrative desk to confirm your policy eligibility.', true, 2),
('activa', 'Activa', 'Activa International Insurance policyholders can access our healthcare services with eligible coverage confirmation.', null, 'Bring your valid insurance ID card when booking or visiting.', true, 3)
on conflict (id) do nothing;
`;
