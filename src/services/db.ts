import { openDB, IDBPDatabase } from 'idb';
import { Expert, Service, BlogPost, ResourceItem, SiteSettings, MediaItem, AppointmentBooking, ReviewItem } from '../types';
import { initialExperts, initialServices, initialBlogPosts, initialResources, initialSiteSettings, initialReviews } from './seedData';
import { db as firestoreDb } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

const DB_NAME = 'ZK_Rehab_Sphere_DB';
const DB_VERSION = 2;

export interface ZKDatabase {
  settings: SiteSettings;
  experts: Expert[];
  services: Service[];
  blogs: BlogPost[];
  resources: ResourceItem[];
  media: MediaItem[];
  appointments: AppointmentBooking[];
  reviews: ReviewItem[];
}

let dbPromise: Promise<IDBPDatabase> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('experts')) {
          db.createObjectStore('experts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('services')) {
          db.createObjectStore('services', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('blogs')) {
          db.createObjectStore('blogs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('appointments')) {
          db.createObjectStore('appointments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reviews')) {
          db.createObjectStore('reviews', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const initDBSeedData = async (): Promise<void> => {
  try {
    const db = await getDB();
    
    // Seed Settings if not exists
    const settings = await db.get('settings', 'current');
    if (!settings) {
      await db.put('settings', initialSiteSettings, 'current');
    }

    // Seed Experts if empty
    const expertsCount = await db.count('experts');
    if (expertsCount === 0) {
      const tx = db.transaction('experts', 'readwrite');
      for (const expert of initialExperts) {
        await tx.store.put(expert);
      }
      await tx.done;
    }

    // Seed Services if empty
    const servicesCount = await db.count('services');
    if (servicesCount === 0) {
      const tx = db.transaction('services', 'readwrite');
      for (const service of initialServices) {
        await tx.store.put(service);
      }
      await tx.done;
    }

    // Seed Blogs if empty
    const blogsCount = await db.count('blogs');
    if (blogsCount === 0) {
      const tx = db.transaction('blogs', 'readwrite');
      for (const blog of initialBlogPosts) {
        await tx.store.put(blog);
      }
      await tx.done;
    }

    // Seed Resources if empty
    const resourcesCount = await db.count('resources');
    if (resourcesCount === 0) {
      const tx = db.transaction('resources', 'readwrite');
      for (const res of initialResources) {
        await tx.store.put(res);
      }
      await tx.done;
    }

    // Seed Reviews if empty
    const reviewsCount = await db.count('reviews');
    if (reviewsCount === 0) {
      const tx = db.transaction('reviews', 'readwrite');
      for (const rev of initialReviews) {
        await tx.store.put(rev);
      }
      await tx.done;
    }
  } catch (error) {
    console.error('Failed to initialize IndexedDB seed data:', error);
  }
};

// Database API functions with Firestore Cloud Syncing
export const dbService = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    const db = await getDB();
    const settings = await db.get('settings', 'current');
    return settings || initialSiteSettings;
  },
  async updateSettings(settings: SiteSettings): Promise<void> {
    const db = await getDB();
    await db.put('settings', settings, 'current');
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'settings', 'current'), settings);
      }
    } catch (e) {
      console.warn('Firestore settings update warning:', e);
    }
  },

  // Experts
  async getExperts(): Promise<Expert[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'experts'));
        if (!querySnapshot.empty) {
          const list: Expert[] = [];
          querySnapshot.forEach((docSnap) => list.push(docSnap.data() as Expert));
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch experts warning:', e);
    }
    const db = await getDB();
    const experts = await db.getAll('experts');
    return experts.length ? experts : initialExperts;
  },
  async saveExpert(expert: Expert): Promise<void> {
    const db = await getDB();
    await db.put('experts', expert);
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'experts', expert.id), expert);
      }
    } catch (e) {
      console.warn('Firestore save expert warning:', e);
    }
  },
  async deleteExpert(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('experts', id);
    try {
      if (firestoreDb) {
        await deleteDoc(doc(firestoreDb, 'experts', id));
      }
    } catch (e) {
      console.warn('Firestore delete expert warning:', e);
    }
  },

  // Services
  async getServices(): Promise<Service[]> {
    const db = await getDB();
    const services = await db.getAll('services');
    return services.length ? services : initialServices;
  },

  // Blogs (Synced to Firestore Collection 'blogs')
  async getBlogs(): Promise<BlogPost[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'blogs'));
        if (!querySnapshot.empty) {
          const list: BlogPost[] = [];
          querySnapshot.forEach((docSnap) => list.push(docSnap.data() as BlogPost));
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch blogs warning:', e);
    }
    const db = await getDB();
    const blogs = await db.getAll('blogs');
    return blogs.length ? blogs : initialBlogPosts;
  },
  async saveBlog(blog: BlogPost): Promise<void> {
    const db = await getDB();
    await db.put('blogs', blog);
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'blogs', blog.id), blog);
      }
    } catch (e) {
      console.warn('Firestore save blog warning:', e);
    }
  },
  async deleteBlog(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('blogs', id);
    try {
      if (firestoreDb) {
        await deleteDoc(doc(firestoreDb, 'blogs', id));
      }
    } catch (e) {
      console.warn('Firestore delete blog warning:', e);
    }
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    const db = await getDB();
    const resources = await db.getAll('resources');
    return resources.length ? resources : initialResources;
  },
  async saveResource(resource: ResourceItem): Promise<void> {
    const db = await getDB();
    await db.put('resources', resource);
  },
  async deleteResource(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('resources', id);
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    const db = await getDB();
    return db.getAll('media');
  },
  async saveMedia(item: MediaItem): Promise<void> {
    const db = await getDB();
    await db.put('media', item);
  },
  async deleteMedia(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('media', id);
  },

  // Appointments
  async getAppointments(): Promise<AppointmentBooking[]> {
    const db = await getDB();
    return db.getAll('appointments');
  },
  async saveAppointment(item: AppointmentBooking): Promise<void> {
    const db = await getDB();
    await db.put('appointments', item);
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'appointments', item.id), item);
      }
    } catch (e) {
      console.warn('Firestore save appointment warning:', e);
    }
  },
  async updateAppointmentStatus(id: string, status: AppointmentBooking['status']): Promise<void> {
    const db = await getDB();
    const appt = await db.get('appointments', id);
    if (appt) {
      appt.status = status;
      await db.put('appointments', appt);
      try {
        if (firestoreDb) {
          await setDoc(doc(firestoreDb, 'appointments', id), appt);
        }
      } catch (e) {
        console.warn('Firestore update appointment warning:', e);
      }
    }
  },

  // Reviews (Synced to Firestore Collection 'reviews')
  async getReviews(): Promise<ReviewItem[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'reviews'));
        if (!querySnapshot.empty) {
          const list: ReviewItem[] = [];
          querySnapshot.forEach((docSnap) => list.push(docSnap.data() as ReviewItem));
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch reviews warning:', e);
    }
    const db = await getDB();
    const reviews = await db.getAll('reviews');
    return reviews.length ? reviews : initialReviews;
  },
  async saveReview(review: ReviewItem): Promise<void> {
    const db = await getDB();
    await db.put('reviews', review);
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'reviews', review.id), review);
      }
    } catch (e) {
      console.warn('Firestore save review warning:', e);
    }
  },
  async deleteReview(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('reviews', id);
    try {
      if (firestoreDb) {
        await deleteDoc(doc(firestoreDb, 'reviews', id));
      }
    } catch (e) {
      console.warn('Firestore delete review warning:', e);
    }
  },
  async updateReviewStatus(id: string, status: ReviewItem['status']): Promise<void> {
    const db = await getDB();
    const rev = await db.get('reviews', id);
    if (rev) {
      rev.status = status;
      if (status === 'approved') rev.isVerified = true;
      await db.put('reviews', rev);
      try {
        if (firestoreDb) {
          await setDoc(doc(firestoreDb, 'reviews', id), rev);
        }
      } catch (e) {
        console.warn('Firestore update review warning:', e);
      }
    }
  }
};
