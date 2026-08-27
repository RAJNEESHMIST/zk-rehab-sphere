import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expert, Service, BlogPost, ResourceItem, SiteSettings, MediaItem, AppointmentBooking, ReviewItem, GalleryItem, Offer } from '../types';
import { dbService, initDBSeedData } from '../services/db';

interface SiteDataContextType {
  settings: SiteSettings;
  experts: Expert[];
  services: Service[];
  blogs: BlogPost[];
  resources: ResourceItem[];
  media: MediaItem[];
  appointments: AppointmentBooking[];
  reviews: ReviewItem[];
  gallery: GalleryItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  saveExpert: (expert: Expert) => Promise<void>;
  deleteExpert: (id: string) => Promise<void>;
  saveService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveBlog: (blog: BlogPost) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  saveResource: (resource: ResourceItem) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  saveMedia: (item: MediaItem) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  saveGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  bookAppointment: (appointment: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentBooking['status']) => Promise<void>;
  offers: Offer[];
  saveOffer: (offer: Offer) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  saveReview: (review: ReviewItem) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  updateReviewStatus: (id: string, status: ReviewItem['status']) => Promise<void>;
  submitPublicReview: (reviewData: Omit<ReviewItem, 'id' | 'createdAt' | 'status' | 'isVerified' | 'isFeatured'>) => Promise<void>;
  getManagedImage: (key: string, defaultUrl: string) => string;
  getAltText: (key: string, defaultAlt: string) => string;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({} as SiteSettings);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await initDBSeedData();
      const [st, ex, sv, bl, rs, md, ap, rv, gl, ofs] = await Promise.all([
        dbService.getSettings(),
        dbService.getExperts(),
        dbService.getServices(),
        dbService.getBlogs(),
        dbService.getResources(),
        dbService.getMedia(),
        dbService.getAppointments(),
        dbService.getReviews(),
        dbService.getGallery(),
        dbService.getOffers(),
      ]);
      setSettings(st);
      setExperts(ex);
      setServices(sv);
      setBlogs(bl);
      setResources(rs);
      setMedia(md);
      setAppointments(ap);
      setReviews(rv);
      setGallery(gl);
      
      let finalOffers = ofs;
      if (!ofs || ofs.filter(o => o.isActive).length === 0) {
        const demoOffer = {
          id: 'demo-active-offer',
          title: 'Special Offer: Get 15 Min Free On-Call Consultation',
          description: 'Speak with our senior physiotherapy specialist today for a free diagnostic assessment.',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        dbService.saveOffer(demoOffer).catch(e => console.warn('Auto-seed offer failed:', e));
        finalOffers = [demoOffer, ...(ofs || [])];
      }
      setOffers(finalOffers);
    } catch (err) {
      console.error('Error loading SiteData from IndexedDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    await dbService.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSaveExpert = async (expert: Expert) => {
    await dbService.saveExpert(expert);
    const updated = await dbService.getExperts();
    setExperts(updated);
  };

  const handleDeleteExpert = async (id: string) => {
    await dbService.deleteExpert(id);
    const updated = await dbService.getExperts();
    setExperts(updated);
  };
  const handleSaveService = async (service: Service) => {
    await dbService.saveService(service);
    const updated = await dbService.getServices();
    setServices(updated);
  };

  const handleDeleteService = async (id: string) => {
    await dbService.deleteService(id);
    const updated = await dbService.getServices();
    setServices(updated);
  };
  const handleSaveBlog = async (blog: BlogPost) => {
    await dbService.saveBlog(blog);
    const updated = await dbService.getBlogs();
    setBlogs(updated);
  };

  const handleDeleteBlog = async (id: string) => {
    await dbService.deleteBlog(id);
    const updated = await dbService.getBlogs();
    setBlogs(updated);
  };

  const handleSaveResource = async (resource: ResourceItem) => {
    await dbService.saveResource(resource);
    const updated = await dbService.getResources();
    setResources(updated);
  };

  const handleDeleteResource = async (id: string) => {
    await dbService.deleteResource(id);
    const updated = await dbService.getResources();
    setResources(updated);
  };

  const handleSaveMedia = async (item: MediaItem) => {
    await dbService.saveMedia(item);
    const updated = await dbService.getMedia();
    setMedia(updated);
  };

  const handleDeleteMedia = async (id: string) => {
    await dbService.deleteMedia(id);
    const updated = await dbService.getMedia();
    setMedia(updated);
  };

  const handleSaveGalleryItem = async (item: GalleryItem) => {
    await dbService.saveGalleryItem(item);
    const updated = await dbService.getGallery();
    setGallery(updated);
  };

  const handleDeleteGalleryItem = async (id: string) => {
    await dbService.deleteGalleryItem(id);
    const updated = await dbService.getGallery();
    setGallery(updated);
  };

  const handleSaveOffer = async (offer: Offer) => {
    await dbService.saveOffer(offer);
    const updated = await dbService.getOffers();
    setOffers(updated);
  };

  const handleDeleteOffer = async (id: string) => {
    await dbService.deleteOffer(id);
    const updated = await dbService.getOffers();
    setOffers(updated);
  };

  const handleBookAppointment = async (apptData: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>) => {
    const newAppt: AppointmentBooking = {
      ...apptData,
      id: `appt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    await dbService.saveAppointment(newAppt);
    const updated = await dbService.getAppointments();
    setAppointments(updated);
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentBooking['status']) => {
    // Optimistic local state update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    // Background save
    dbService.updateAppointmentStatus(id, status).catch((e) => console.warn('Background update appt warning:', e));
  };

  const handleSaveReview = async (review: ReviewItem) => {
    // Optimistic local state update
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? review : r))
    );
    // Background save
    dbService.saveReview(review).catch((e) => console.warn('Background save review warning:', e));
  };

  const handleDeleteReview = async (id: string) => {
    // Optimistic local state update
    setReviews((prev) => prev.filter((r) => r.id !== id));
    // Background delete
    dbService.deleteReview(id).catch((e) => console.warn('Background delete review warning:', e));
  };

  const handleUpdateReviewStatus = async (id: string, status: ReviewItem['status']) => {
    // Optimistic local state update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, isVerified: status === 'approved' ? true : r.isVerified }
          : r
      )
    );
    // Background status update
    dbService.updateReviewStatus(id, status).catch((e) => console.warn('Background update review warning:', e));
  };

  const handleSubmitPublicReview = async (reviewData: Omit<ReviewItem, 'id' | 'createdAt' | 'status' | 'isVerified' | 'isFeatured'>) => {
    const newReview: ReviewItem = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isVerified: false,
      isFeatured: false,
    };
    // Update local state immediately for instant success transition
    setReviews((prev) => [newReview, ...prev]);
    
    // Save to database & firestore in background
    dbService.saveReview(newReview).catch((e) => {
      console.warn('Background save review warning:', e);
    });
  };

  const getManagedImage = (key: string, defaultUrl: string): string => {
    const override = settings?.imageOverrides?.[key];
    if (override?.url) {
      return `${override.url}?v=${new Date(override.updatedAt).getTime()}`;
    }
    return defaultUrl;
  };

  const getAltText = (key: string, defaultAlt: string): string => {
    const override = settings?.imageOverrides?.[key];
    return override?.altText || defaultAlt;
  };

  return (
    <SiteDataContext.Provider
      value={{
        settings,
        experts,
        services,
        blogs,
        resources,
        media,
        appointments,
        reviews,
        gallery,
        offers,
        loading,
        refreshData: loadAllData,
        updateSettings: handleUpdateSettings,
        saveExpert: handleSaveExpert,
        deleteExpert: handleDeleteExpert,
        saveService: handleSaveService,
        deleteService: handleDeleteService,
        saveBlog: handleSaveBlog,
        deleteBlog: handleDeleteBlog,
        saveResource: handleSaveResource,
        deleteResource: handleDeleteResource,
        saveMedia: handleSaveMedia,
        deleteMedia: handleDeleteMedia,
        saveGalleryItem: handleSaveGalleryItem,
        deleteGalleryItem: handleDeleteGalleryItem,
        saveOffer: handleSaveOffer,
        deleteOffer: handleDeleteOffer,
        bookAppointment: handleBookAppointment,
        updateAppointmentStatus: handleUpdateAppointmentStatus,
        saveReview: handleSaveReview,
        deleteReview: handleDeleteReview,
        updateReviewStatus: handleUpdateReviewStatus,
        submitPublicReview: handleSubmitPublicReview,
        getManagedImage,
        getAltText,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
