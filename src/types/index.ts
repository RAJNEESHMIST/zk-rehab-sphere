export interface Expert {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  specializations: string[];
  biography: string;
  availability: string;
  location: string;
  image: string;
  certifications?: string[];
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    email?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  iconName: string;
  image: string;
  category: 'physiotherapy' | 'neurology' | 'orthopedic' | 'education' | 'wellness';
  features: string[];
  gradient: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishDate: string;
  coverImage: string;
  tags: string[];
  status: 'published' | 'draft';
  featured?: boolean;
  pinned?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  views?: number;
  tableOfContents?: { id: string; text: string }[];
}

export interface ReviewItem {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  city: 'Chandigarh' | 'Mohali' | 'Kharar' | string;
  treatment: 'Stroke Rehab' | 'Orthopedic' | 'Sports Injury' | 'Back Pain' | 'Post Surgery' | 'Hijama' | string;
  condition: string;
  rating: number;
  message: string;
  patientPhoto?: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  doctorName?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'guide' | 'book' | 'checklist' | 'article';
  coverImage: string;
  downloadUrl?: string;
  readTimeOrPages: string;
  summary: string;
  author: string;
  category: string;
}

export interface BodyPartCondition {
  id: string;
  partKey: 'neck' | 'shoulder' | 'back' | 'hip' | 'knee' | 'ankle';
  partName: string;
  commonSymptoms: string[];
  recommendedTreatments: string[];
  exercises: string[];
  relatedExpertIds: string[];
  relatedBlogSlugs: string[];
}

export interface SiteSettings {
  clinicName: string;
  tagline: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  areasCovered: string[];
  heroTitle: string;
  heroSubtitle: string;
  openingHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  metaTitle: string;
  metaDescription: string;
  imageOverrides?: Record<string, {
    url: string;
    altText?: string;
    updatedAt: string;
    updatedBy: string;
  }>;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'icon' | 'document';
  sizeBytes: number;
  uploadedAt: string;
}

export interface AppointmentBooking {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  selectedService: string;
  preferredDoctor?: string;
  locationArea: string;
  preferredDate: string;
  notes: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface TrustPillar {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  details: string[];
  metrics: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  caption: string;
  location: string;
}

export interface AreaCoverageItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  landmarks: string[];
  responseHours: string;
  patientCount: number;
  featuredTherapist: string;
  localTestimonial: {
    quote: string;
    patient: string;
    condition: string;
  };
}

export interface TestimonialItem {
  id: string;
  patientName: string;
  patientImage?: string;
  location: string;
  condition: string;
  doctorName: string;
  recoveryDuration: string;
  quote: string;
  rating: number;
  videoUrl?: string;
}

export type CursorMode = 'default' | 'explore' | 'book' | 'read' | 'view' | 'play';
