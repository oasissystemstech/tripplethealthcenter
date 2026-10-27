export interface WebsiteSettings {
  id: string;
  hospital_name: string;
  slogan: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp_number: string; // Strictly internal; never displayed as text on public site
  email: string;
  location_address: string;
  location_landmark: string;
  location_city: string;
  location_country: string;
  hours_weekday: string;
  hours_weekday_emergency: string;
  hours_saturday: string;
  hours_saturday_emergency: string;
  hours_sunday_holiday: string;
  about_intro: string;
  mission: string;
  vision: string;
  core_values: string[];
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  hero_image_url?: string;
  updated_at?: string;
}

export interface PageContent {
  id: string; // 'home' | 'about' | 'services' | 'team' | 'insurance' | 'contact' or custom page id
  title: string;
  seo_title: string;
  meta_description: string;
  heading: string;
  subheading: string;
  image_url?: string;
  published: boolean;
  updated_at?: string;
}

export interface MedicalService {
  id: string;
  service_name: string;
  short_description: string;
  full_description: string;
  category: 'general' | 'surgical' | 'maternity' | 'laboratory' | 'ultrasound' | 'immunization';
  image_url?: string;
  icon_name: string;
  display_order: number;
  published: boolean;
  features?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface HealthcareStaff {
  id: string;
  name: string;
  professional_title: string;
  department: string;
  qualifications: string;
  biography: string;
  image_url?: string;
  display_order: number;
  published: boolean;
  created_at?: string;
}

export interface InsuranceProvider {
  id: string;
  provider_name: string;
  description: string;
  logo_url?: string;
  contact_note?: string;
  published: boolean;
  display_order: number;
}

export interface AppointmentRequest {
  id: string;
  patient_name: string;
  telephone: string;
  email?: string;
  preferred_service: string;
  preferred_date: string;
  preferred_time?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  admin_notes?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  telephone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}
