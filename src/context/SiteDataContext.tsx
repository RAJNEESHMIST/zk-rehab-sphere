import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expert, Service, BlogPost, ResourceItem, SiteSettings, MediaItem, AppointmentBooking, ReviewItem } from '../types';
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
  loading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  saveExpert: (expert: Expert) => Promise<void>;
  deleteExpert: (id: string) => Promise<void>;
  saveBlog: (blog: BlogPost) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  saveResource: (resource: ResourceItem) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  saveMedia: (item: MediaItem) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  bookAppointment: (appointment: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentBooking['status']) => Promise<void>;
  saveReview: (review: ReviewItem) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  updateReviewStatus: (id: string, status: ReviewItem['status']) => Promise<void>;
  submitPublicReview: (reviewData: Omit<ReviewItem, 'id' | 'createdAt' | 'status' | 'isVerified' | 'isFeatured'>) => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await initDBSeedData();
      const [st, ex, sv, bl, rs, md, ap, rv] = await Promise.all([
        dbService.getSettings(),
        dbService.getExperts(),
        dbService.getServices(),
        dbService.getBlogs(),
        dbService.getResources(),
        dbService.getMedia(),
        dbService.getAppointments(),
        dbService.getReviews(),
      ]);
      setSettings(st);
      setExperts(ex);
      setServices(sv);
      setBlogs(bl);
      setResources(rs);
      setMedia(md);
      setAppointments(ap);
      setReviews(rv);
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
    await dbService.updateAppointmentStatus(id, status);
    const updated = await dbService.getAppointments();
    setAppointments(updated);
  };

  const handleSaveReview = async (review: ReviewItem) => {
    await dbService.saveReview(review);
    const updated = await dbService.getReviews();
    setReviews(updated);
  };

  const handleDeleteReview = async (id: string) => {
    await dbService.deleteReview(id);
    const updated = await dbService.getReviews();
    setReviews(updated);
  };

  const handleUpdateReviewStatus = async (id: string, status: ReviewItem['status']) => {
    await dbService.updateReviewStatus(id, status);
    const updated = await dbService.getReviews();
    setReviews(updated);
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
    await dbService.saveReview(newReview);
    const updated = await dbService.getReviews();
    setReviews(updated);
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
        loading,
        refreshData: loadAllData,
        updateSettings: handleUpdateSettings,
        saveExpert: handleSaveExpert,
        deleteExpert: handleDeleteExpert,
        saveBlog: handleSaveBlog,
        deleteBlog: handleDeleteBlog,
        saveResource: handleSaveResource,
        deleteResource: handleDeleteResource,
        saveMedia: handleSaveMedia,
        deleteMedia: handleDeleteMedia,
        bookAppointment: handleBookAppointment,
        updateAppointmentStatus: handleUpdateAppointmentStatus,
        saveReview: handleSaveReview,
        deleteReview: handleDeleteReview,
        updateReviewStatus: handleUpdateReviewStatus,
        submitPublicReview: handleSubmitPublicReview,
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
