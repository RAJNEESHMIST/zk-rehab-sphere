import { openDB, IDBPDatabase } from 'idb';
import { Expert, Service, BlogPost, ResourceItem, SiteSettings, MediaItem, AppointmentBooking, ReviewItem, GalleryItem } from '../types';
import { initialExperts, initialServices, initialBlogPosts, initialResources, initialSiteSettings, initialReviews } from './seedData';
import { db as firestoreDb } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

// Import local gallery images
import strokeRehabImg from '../assets/treatments/stroke_rehab.png';
import parkinsonsTherapyImg from '../assets/treatments/parkinsons_therapy.png';
import balanceGaitImg from '../assets/treatments/balance_gait.png';
import postSurgeryRehabImg from '../assets/treatments/post_surgery_rehab.png';
import sportsInjuryRehabImg from '../assets/treatments/sports_injury_rehab.png';
import jointPainManagementImg from '../assets/treatments/joint_pain_management.png';
import lowerBackPainImg from '../assets/treatments/lower_back_pain.png';
import bodyNeckImg from '../assets/treatments/body_neck.png';
import postureCorrectionImg from '../assets/treatments/posture_correction.png';
import electrotherapyImg from '../assets/treatments/electrotherapy.png';
import shockwaveTherapyImg from '../assets/treatments/shockwave_therapy.png';
import roboticRehabImg from '../assets/treatments/robotic_rehab.png';

const DB_NAME = 'ZK_Rehab_Sphere_DB';
const DB_VERSION = 4;

export interface ZKDatabase {
  settings: SiteSettings;
  experts: Expert[];
  services: Service[];
  blogs: BlogPost[];
  resources: ResourceItem[];
  media: MediaItem[];
  appointments: AppointmentBooking[];
  reviews: ReviewItem[];
  gallery: GalleryItem[];
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
        if (!db.objectStoreNames.contains('gallery')) {
          db.createObjectStore('gallery', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// Initial dynamic gallery items seed data
const initialGalleryItems: GalleryItem[] = [
  // Neurological Care
  {
    id: 'gal-1',
    title: 'Stroke Rehabilitation Home Session',
    category: 'Neurological Care',
    image: strokeRehabImg,
    beforeImage: strokeRehabImg,
    afterImage: strokeRehabImg,
    caption: 'Patient undergoing upper limb neuro-plasticity & functional movement retraining in Sector 34, Chandigarh.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-2',
    title: "Parkinson's Tremor Management",
    category: 'Neurological Care',
    image: parkinsonsTherapyImg,
    caption: 'Coordination and progressive balance exercise session under therapist supervision.',
    location: 'Mohali'
  },
  {
    id: 'gal-3',
    title: 'Balance & Gait Mobility Training',
    category: 'Neurological Care',
    image: balanceGaitImg,
    caption: 'Preventing fall risks and correcting biomechanical walking patterns for geriatric safety.',
    location: 'Kharar'
  },

  // Orthopedic Rehab
  {
    id: 'gal-4',
    title: 'Post Knee Replacement flexion mobilization',
    category: 'Orthopedic Rehab',
    image: postSurgeryRehabImg,
    beforeImage: postSurgeryRehabImg,
    afterImage: postSurgeryRehabImg,
    caption: 'Progressive unassisted weight-bearing practice 3 weeks post knee replacement surgery.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-5',
    title: 'ACL Ligament Tear Rehabilitation',
    category: 'Orthopedic Rehab',
    image: sportsInjuryRehabImg,
    caption: 'Targeted strengthening of the quadriceps and hamstring muscle group post injury.',
    location: 'Mohali'
  },
  {
    id: 'gal-6',
    title: 'Adhesive Capsulitis (Frozen Shoulder) Therapy',
    category: 'Orthopedic Rehab',
    image: jointPainManagementImg,
    caption: 'Joint mobilization maneuvers and passive stretching routines to restore functional arc.',
    location: 'Kharar'
  },

  // Spine Care
  {
    id: 'gal-7',
    title: 'Lumbar Disc Herniation Decompression',
    category: 'Spine Care',
    image: lowerBackPainImg,
    caption: 'McKenzie mechanical diagnosis spinal retraction and lumbar posture corrections.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-8',
    title: 'Cervical Spondylosis Manual Traction',
    category: 'Spine Care',
    image: bodyNeckImg,
    caption: 'Bedside manual traction to relieve nerve pressure and reduce acute cervical radiation.',
    location: 'Mohali'
  },
  {
    id: 'gal-9',
    title: 'Spinal Alignment & Posture Scan',
    category: 'Spine Care',
    image: postureCorrectionImg,
    caption: 'Assessing muscular balance and spinal curvatures to correct seated ergonomics.',
    location: 'Kharar'
  },

  // Advanced Equipment
  {
    id: 'gal-10',
    title: 'Portable Ultrasound Therapy Session',
    category: 'Advanced Equipment',
    image: electrotherapyImg,
    caption: 'Hospital-grade portable electrotherapy & ultrasound modalities brought directly to the patient’s bedside for targeted pain alleviation.',
    location: 'Chandigarh'
  },
  {
    id: 'gal-11',
    title: 'Dual Channel TENS Muscle Stimulation',
    category: 'Advanced Equipment',
    image: electrotherapyImg,
    caption: 'Targeted nerve stimulation and pain gating therapy for chronic joint arthrosis.',
    location: 'Mohali'
  },
  {
    id: 'gal-12',
    title: 'Bedside Mechanical Spine Decompression',
    category: 'Advanced Equipment',
    image: roboticRehabImg,
    caption: 'Deploying high-traction decompression belts to reduce sciatic radiation.',
    location: 'Kharar'
  }
];

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

    // Seed Gallery - always overwrite to sync updated local high-res paths
    const tx = db.transaction('gallery', 'readwrite');
    for (const item of initialGalleryItems) {
      await tx.store.put(item);
    }
    await tx.done;
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
  async saveService(service: Service): Promise<void> {
    const db = await getDB();
    await db.put('services', service);
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'services', service.id), service);
      }
    } catch (e) {
      console.warn('Firestore save service error:', e);
    }
  },
  async deleteService(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('services', id);
    try {
      if (firestoreDb) {
        await deleteDoc(doc(firestoreDb, 'services', id));
      }
    } catch (e) {
      console.warn('Firestore delete service error:', e);
    }
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
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'gallery'));
        if (!querySnapshot.empty) {
          const list: GalleryItem[] = [];
          querySnapshot.forEach((docSnap) => list.push(docSnap.data() as GalleryItem));
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch gallery warning:', e);
    }
    const db = await getDB();
    const gallery = await db.getAll('gallery');
    return gallery.length ? gallery : initialGalleryItems;
  },
  async saveGalleryItem(item: GalleryItem): Promise<void> {
    const db = await getDB();
    await db.put('gallery', item);
    try {
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'gallery', item.id), item);
      }
    } catch (e) {
      console.warn('Firestore save gallery item warning:', e);
    }
  },
  async deleteGalleryItem(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('gallery', id);
    try {
      if (firestoreDb) {
        await deleteDoc(doc(firestoreDb, 'gallery', id));
      }
    } catch (e) {
      console.warn('Firestore delete gallery item warning:', e);
    }
  }
};
