import { WebsiteSettings, PageContent, MedicalService, HealthcareStaff, InsuranceProvider } from '../types';

export const INITIAL_SETTINGS: WebsiteSettings = {
  id: 'default',
  hospital_name: 'TRIPPLE-T HEALTH CENTER',
  slogan: 'Excellence in Healthcare. Compassion in Service.',
  phone_primary: '+231 177 667 7688',
  phone_secondary: '+231 188 642 5903',
  whatsapp_number: '231770183894', // Strictly internal for WhatsApp routing; never displayed as plain text
  email: 'tripplehealth123@gmail.com',
  location_address: 'Roberts Field Highway',
  location_landmark: 'Duazon Last Turning Point',
  location_city: 'Duazon, Monrovia',
  location_country: 'Liberia',
  hours_weekday: '8:30 AM – 4:00 PM',
  hours_weekday_emergency: 'Emergency services available after 4:00 PM',
  hours_saturday: '9:00 AM – 2:00 PM',
  hours_saturday_emergency: 'Emergency services available after 2:00 PM',
  hours_sunday_holiday: 'Emergency services only',
  about_intro: 'Tripple-T Health Center is dedicated to providing compassionate healthcare services to individuals and families in Liberia. Our focus is on supporting the health and well-being of our community through professional medical care, diagnostic services, and patient-centered attention.',
  mission: 'To provide accessible, compassionate, and quality healthcare services that promote the health and well-being of individuals and families in Liberia.',
  vision: 'To become a trusted healthcare center recognized for professional excellence, compassionate care, and continuous clinical improvement in Liberia.',
  core_values: [
    'Compassion',
    'Professionalism',
    'Integrity',
    'Respect',
    'Excellence',
    'Patient Safety'
  ],
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  hero_image_url: '/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png'
};

export const INITIAL_PAGES: PageContent[] = [
  {
    id: 'home',
    title: 'Home',
    seo_title: 'Tripple-T Health Center – Excellence in Healthcare. Compassion in Service.',
    meta_description: 'Tripple-T Health Center provides compassionate, accessible medical care for individuals, mothers, and families in Liberia.',
    heading: 'Excellence in Healthcare. Compassion in Service.',
    subheading: 'At Tripple-T Health Center, we are committed to providing compassionate, accessible, and professional healthcare for individuals and families in Liberia.',
    published: true
  },
  {
    id: 'about',
    title: 'About Us',
    seo_title: 'About Tripple-T Health Center – Duazon, Monrovia, Liberia',
    meta_description: 'Learn about our mission, vision, and core values dedicated to compassionate healthcare in Liberia.',
    heading: 'About Tripple-T Health Center',
    subheading: 'Dedicated to providing compassionate, professional medical care to our community.',
    published: true
  },
  {
    id: 'services',
    title: 'Our Services',
    seo_title: 'Medical Services – Tripple-T Health Center Liberia',
    meta_description: 'Explore our medical services: General Care, Surgery, Maternity, Lab, Ultrasound, and Immunization.',
    heading: 'Available Medical Services',
    subheading: 'Comprehensive outpatient care, diagnostic testing, maternal health, and preventive immunization.',
    published: true
  },
  {
    id: 'team',
    title: 'Our Team',
    seo_title: 'Healthcare Team – Tripple-T Health Center',
    meta_description: 'Meet our dedicated clinical officers, nurses, and laboratory personnel in Liberia.',
    heading: 'Our Healthcare Team',
    subheading: 'Dedicated clinical staff delivering patient-centered healthcare with empathy and precision.',
    published: true
  },
  {
    id: 'insurance',
    title: 'Health Insurance',
    seo_title: 'Accepted Health Insurance – Tripple-T Health Center',
    meta_description: 'Information regarding Saar, NICOL, and Activa health insurance plans at Tripple-T Health Center.',
    heading: 'Health Insurance Partners',
    subheading: 'We work with selected health insurance providers. Contact Tripple-T Health Center to confirm your coverage and eligibility.',
    published: true
  },
  {
    id: 'contact',
    title: 'Contact Us',
    seo_title: 'Contact Tripple-T Health Center – Duazon, Monrovia, Liberia',
    meta_description: 'Reach our clinic located on Roberts Field Highway, Duazon Last Turning Point, Duazon, Monrovia, Liberia.',
    heading: 'Get in Touch with Tripple-T Health Center',
    subheading: 'Reach our administrative desk, ask questions regarding appointments, or find our location in Duazon, Monrovia, Liberia.',
    published: true
  }
];

export const INITIAL_SERVICES: MedicalService[] = [
  {
    id: 'general-medical-care',
    service_name: 'General Medical Care',
    short_description: 'Comprehensive outpatient medical consultations, diagnosis, treatment, and preventive care for individuals and families.',
    full_description: 'Our General Medical Care unit provides thorough outpatient clinical assessments, management of common acute and chronic illnesses, routine check-ups, and patient health education.',
    category: 'general',
    icon_name: 'Stethoscope',
    display_order: 1,
    published: true,
    features: [
      'Comprehensive clinical consultations',
      'Acute illness diagnosis & management',
      'Chronic illness monitoring',
      'Preventive health assessments'
    ]
  },
  {
    id: 'surgical-services',
    service_name: 'Surgical Services',
    short_description: 'Professional surgical care and minor operative procedures performed in a sterile and safe clinical environment.',
    full_description: 'Tripple-T Health Center provides surgical services and minor clinical procedures adhering to strict safety protocols and patient care standards.',
    category: 'surgical',
    icon_name: 'Activity',
    display_order: 2,
    published: true,
    features: [
      'Minor surgical procedures',
      'Wound care & sterile dressing',
      'Pre-procedure consultation',
      'Post-operative monitoring'
    ]
  },
  {
    id: 'maternity-child-health',
    service_name: "Maternity & Child's Health",
    short_description: 'Dedicated healthcare supporting pregnant women, mothers, infants, and growing children with warmth and tenderness.',
    full_description: 'Supporting the health and well-being of mothers, babies, and families through compassionate maternal and pediatric healthcare services.',
    category: 'maternity',
    image_url: '/assets/aistudio/Caring_Hands_in_a_Modern_Hospital_Ward_ebeb8456.png',
    icon_name: 'Baby',
    display_order: 3,
    published: true,
    features: [
      'Antenatal health check-ups',
      'Postnatal mother & newborn care',
      'Child growth and development checks',
      'Maternal nutrition and health guidance'
    ]
  },
  {
    id: 'laboratory-services',
    service_name: 'Laboratory Services',
    short_description: 'Access to reliable Routine Laboratory Services and Chemistry Laboratory testing to support accurate diagnosis.',
    full_description: 'Access laboratory services to support your healthcare needs. Tripple-T Health Center provides Routine Laboratory Services and Chemistry Laboratory diagnostics for timely clinical decisions.',
    category: 'laboratory',
    icon_name: 'FlaskConical',
    display_order: 4,
    published: true,
    features: [
      'Routine Laboratory Services',
      'Chemistry Laboratory Testing',
      'Diagnostic blood & urine tests',
      'Accurate physician-ordered investigations'
    ]
  },
  {
    id: 'ultrasound-services',
    service_name: 'Ultrasound Services',
    short_description: 'Diagnostic medical ultrasound imaging for maternal and general health assessment by trained clinical personnel.',
    full_description: 'Contact Tripple-T Health Center to make inquiries about available ultrasound services and appointment arrangements.',
    category: 'ultrasound',
    icon_name: 'ScanLine',
    display_order: 5,
    published: true,
    features: [
      'Obstetric / Pregnancy scans',
      'Abdominal ultrasound inquiries',
      'Pelvic scans',
      'Prompt diagnostic reporting'
    ]
  },
  {
    id: 'immunization',
    service_name: 'Immunization',
    short_description: 'Essential childhood immunizations and preventive vaccine services to protect children and adults against preventable diseases.',
    full_description: 'Tripple-T Health Center provides immunization services to protect children, mothers, and families against vaccine-preventable diseases in accordance with national health guidelines in Liberia.',
    category: 'immunization',
    icon_name: 'ShieldCheck',
    display_order: 6,
    published: true,
    features: [
      'Routine childhood vaccines',
      'Immunization record keeping',
      'Preventive health counseling',
      'Safe vaccine storage & administration'
    ]
  }
];

export const INITIAL_STAFF: HealthcareStaff[] = [];

export const INITIAL_INSURANCE: InsuranceProvider[] = [
  {
    id: 'saar',
    provider_name: 'Saar',
    description: 'We welcome patients with Saar Insurance coverage. Please present your membership card upon arrival to verify coverage.',
    contact_note: 'Coverage verification available at our front desk.',
    published: true,
    display_order: 1
  },
  {
    id: 'nicol',
    provider_name: 'NICOL',
    description: 'We accept patients covered under National Insurance Corporation of Liberia (NICOL) and affiliated insurance networks.',
    contact_note: 'Contact our administrative desk to confirm your policy eligibility.',
    published: true,
    display_order: 2
  },
  {
    id: 'activa',
    provider_name: 'Activa',
    description: 'Activa International Insurance policyholders can access our healthcare services with eligible coverage confirmation.',
    contact_note: 'Bring your valid insurance ID card when booking or visiting.',
    published: true,
    display_order: 3
  }
];
