import { openDB, IDBPDatabase } from 'idb';
import { Expert, Service, BlogPost, ResourceItem, SiteSettings, MediaItem, AppointmentBooking, ReviewItem, GalleryItem, Offer } from '../types';
import { initialExperts, initialServices, initialBlogPosts, initialResources, initialSiteSettings, initialReviews } from './seedData';
import { db as firestoreDb } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

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
const DB_VERSION = 5;

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
  offers: Offer[];
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
        if (!db.objectStoreNames.contains('offers')) {
          db.createObjectStore('offers', { keyPath: 'id' });
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
    
    // 1. Seed Settings
    const settings = await db.get('settings', 'current');
    if (!settings) {
      await db.put('settings', initialSiteSettings, 'current');
    }
    if (firestoreDb) {
      try {
        const firestoreSettingsSnap = await getDoc(doc(firestoreDb, 'settings', 'current'));
        if (!firestoreSettingsSnap.exists()) {
          await setDoc(doc(firestoreDb, 'settings', 'current'), initialSiteSettings);
        }
      } catch (e) {
        console.warn('Failed to seed settings to Firestore:', e);
      }
    }

    // 2. Seed Experts
    const expertsCount = await db.count('experts');
    if (expertsCount === 0) {
      const tx = db.transaction('experts', 'readwrite');
      for (const expert of initialExperts) {
        await tx.store.put(expert);
      }
      await tx.done;
    }
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'experts'));
        if (querySnapshot.empty) {
          for (const expert of initialExperts) {
            await setDoc(doc(firestoreDb, 'experts', expert.id), expert);
          }
        }
      } catch (e) {
        console.warn('Failed to seed experts to Firestore:', e);
      }
    }

    // 3. Seed Services
    const servicesCount = await db.count('services');
    if (servicesCount === 0) {
      const tx = db.transaction('services', 'readwrite');
      for (const service of initialServices) {
        await tx.store.put(service);
      }
      await tx.done;
    }
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'services'));
        if (querySnapshot.empty) {
          for (const service of initialServices) {
            await setDoc(doc(firestoreDb, 'services', service.id), service);
          }
        }
      } catch (e) {
        console.warn('Failed to seed services to Firestore:', e);
      }
    }

    // 4. Seed Blogs
    const blogsCount = await db.count('blogs');
    if (blogsCount === 0) {
      const tx = db.transaction('blogs', 'readwrite');
      for (const blog of initialBlogPosts) {
        await tx.store.put(blog);
      }
      await tx.done;
    }
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'blogs'));
        if (querySnapshot.empty) {
          for (const blog of initialBlogPosts) {
            await setDoc(doc(firestoreDb, 'blogs', blog.id), blog);
          }
        }
      } catch (e) {
        console.warn('Failed to seed blogs to Firestore:', e);
      }
    }

    // 5. Seed Resources
    const resourcesCount = await db.count('resources');
    if (resourcesCount === 0) {
      const tx = db.transaction('resources', 'readwrite');
      for (const res of initialResources) {
        await tx.store.put(res);
      }
      await tx.done;
    }
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'resources'));
        if (querySnapshot.empty) {
          for (const res of initialResources) {
            await setDoc(doc(firestoreDb, 'resources', res.id), res);
          }
        }
      } catch (e) {
        console.warn('Failed to seed resources to Firestore:', e);
      }
    }

    // 6. Seed Reviews
    const reviewsCount = await db.count('reviews');
    if (reviewsCount === 0) {
      const tx = db.transaction('reviews', 'readwrite');
      for (const rev of initialReviews) {
        await tx.store.put(rev);
      }
      await tx.done;
    }
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'reviews'));
        if (querySnapshot.empty) {
          for (const rev of initialReviews) {
            await setDoc(doc(firestoreDb, 'reviews', rev.id), rev);
          }
        }
      } catch (e) {
        console.warn('Failed to seed reviews to Firestore:', e);
      }
    }

    // 7. Seed Gallery - always overwrite to sync updated local high-res paths
    const tx = db.transaction('gallery', 'readwrite');
    for (const item of initialGalleryItems) {
      await tx.store.put(item);
    }
    await tx.done;
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'gallery'));
        if (querySnapshot.empty) {
          for (const item of initialGalleryItems) {
            await setDoc(doc(firestoreDb, 'gallery', item.id), item);
          }
        }
      } catch (e) {
        console.warn('Failed to seed gallery to Firestore:', e);
      }
    }

    // 8. Seed Offers if empty
    const offersCount = await db.count('offers');
    const initialOffer = {
      id: 'offer-1',
      title: 'Special Offer: Get 15 Min Free On-Call Consultation',
      description: 'Speak with our senior physiotherapy specialist today for a free diagnostic assessment.',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    if (offersCount === 0) {
      await db.put('offers', initialOffer);
    }
    if (firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'offers'));
        if (querySnapshot.empty) {
          await setDoc(doc(firestoreDb, 'offers', initialOffer.id), initialOffer);
        }
      } catch (e) {
        console.warn('Failed to seed offers to Firestore:', e);
      }
    }
  } catch (error) {
    console.error('Failed to initialize IndexedDB seed data:', error);
  }
};

// Database API functions with Firestore Cloud Syncing
export const dbService = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      if (firestoreDb) {
        const docSnap = await getDoc(doc(firestoreDb, 'settings', 'current'));
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          const db = await getDB();
          await db.put('settings', data, 'current');
          return data;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch settings warning:', e);
    }
    const db = await getDB();
    const settings = await db.get('settings', 'current');
    return settings || initialSiteSettings;
  },
  async updateSettings(settings: SiteSettings): Promise<void> {
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'settings', 'current'), settings);
    }
    const db = await getDB();
    await db.put('settings', settings, 'current');
  },

  // Experts
  async getExperts(): Promise<Expert[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'experts'));
        if (!querySnapshot.empty) {
          const list: Expert[] = [];
          const db = await getDB();
          const tx = db.transaction('experts', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as Expert;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
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
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'experts', expert.id), expert);
    }
    const db = await getDB();
    await db.put('experts', expert);
  },
  async deleteExpert(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'experts', id));
    }
    const db = await getDB();
    await db.delete('experts', id);
  },

  // Services
  async getServices(): Promise<Service[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'services'));
        if (!querySnapshot.empty) {
          const list: Service[] = [];
          const db = await getDB();
          const tx = db.transaction('services', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as Service;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch services warning:', e);
    }
    const db = await getDB();
    const services = await db.getAll('services');
    return services.length ? services : initialServices;
  },
  async saveService(service: Service): Promise<void> {
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'services', service.id), service);
    }
    const db = await getDB();
    await db.put('services', service);
  },
  async deleteService(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'services', id));
    }
    const db = await getDB();
    await db.delete('services', id);
  },

  // Blogs (Synced to Firestore Collection 'blogs')
  async getBlogs(): Promise<BlogPost[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'blogs'));
        if (!querySnapshot.empty) {
          const list: BlogPost[] = [];
          const db = await getDB();
          const tx = db.transaction('blogs', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as BlogPost;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
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
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'blogs', blog.id), blog);
    }
    const db = await getDB();
    await db.put('blogs', blog);
  },
  async deleteBlog(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'blogs', id));
    }
    const db = await getDB();
    await db.delete('blogs', id);
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'resources'));
        if (!querySnapshot.empty) {
          const list: ResourceItem[] = [];
          const db = await getDB();
          const tx = db.transaction('resources', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as ResourceItem;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch resources warning:', e);
    }
    const db = await getDB();
    const resources = await db.getAll('resources');
    return resources.length ? resources : initialResources;
  },
  async saveResource(resource: ResourceItem): Promise<void> {
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'resources', resource.id), resource);
    }
    const db = await getDB();
    await db.put('resources', resource);
  },
  async deleteResource(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'resources', id));
    }
    const db = await getDB();
    await db.delete('resources', id);
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'media'));
        if (!querySnapshot.empty) {
          const list: MediaItem[] = [];
          const db = await getDB();
          const tx = db.transaction('media', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as MediaItem;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch media warning:', e);
    }
    const db = await getDB();
    return db.getAll('media');
  },
  async saveMedia(item: MediaItem): Promise<void> {
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'media', item.id), item);
    }
    const db = await getDB();
    await db.put('media', item);
  },
  async deleteMedia(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'media', id));
    }
    const db = await getDB();
    await db.delete('media', id);
  },

  // Appointments
  async getAppointments(): Promise<AppointmentBooking[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'appointments'));
        if (!querySnapshot.empty) {
          const list: AppointmentBooking[] = [];
          const db = await getDB();
          const tx = db.transaction('appointments', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as AppointmentBooking;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch appointments warning:', e);
    }
    const db = await getDB();
    return db.getAll('appointments');
  },
  async saveAppointment(item: AppointmentBooking): Promise<void> {
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'appointments', item.id), item);
    }
    const db = await getDB();
    await db.put('appointments', item);
  },
  async updateAppointmentStatus(id: string, status: AppointmentBooking['status']): Promise<void> {
    const db = await getDB();
    const appt = await db.get('appointments', id);
    if (appt) {
      appt.status = status;
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'appointments', id), appt);
      }
      await db.put('appointments', appt);
    }
  },

  // Reviews (Synced to Firestore Collection 'reviews')
  async getReviews(): Promise<ReviewItem[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'reviews'));
        if (!querySnapshot.empty) {
          const list: ReviewItem[] = [];
          const db = await getDB();
          const tx = db.transaction('reviews', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as ReviewItem;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
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
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'reviews', review.id), review);
    }
    const db = await getDB();
    await db.put('reviews', review);
  },
  async deleteReview(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'reviews', id));
    }
    const db = await getDB();
    await db.delete('reviews', id);
  },
  async updateReviewStatus(id: string, status: ReviewItem['status']): Promise<void> {
    const db = await getDB();
    const rev = await db.get('reviews', id);
    if (rev) {
      rev.status = status;
      if (status === 'approved') rev.isVerified = true;
      if (firestoreDb) {
        await setDoc(doc(firestoreDb, 'reviews', id), rev);
      }
      await db.put('reviews', rev);
    }
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'gallery'));
        if (!querySnapshot.empty) {
          const list: GalleryItem[] = [];
          const db = await getDB();
          const tx = db.transaction('gallery', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as GalleryItem;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
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
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'gallery', item.id), item);
    }
    const db = await getDB();
    await db.put('gallery', item);
  },
  async deleteGalleryItem(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'gallery', id));
    }
    const db = await getDB();
    await db.delete('gallery', id);
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    try {
      if (firestoreDb) {
        const querySnapshot = await getDocs(collection(firestoreDb, 'offers'));
        if (!querySnapshot.empty) {
          const list: Offer[] = [];
          const db = await getDB();
          const tx = db.transaction('offers', 'readwrite');
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as Offer;
            list.push(data);
            tx.store.put(data);
          });
          await tx.done;
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch offers warning:', e);
    }
    const db = await getDB();
    const offers = await db.getAll('offers');
    return offers;
  },
  async saveOffer(offer: Offer): Promise<void> {
    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'offers', offer.id), offer);
    }
    const db = await getDB();
    await db.put('offers', offer);
  },
  async deleteOffer(id: string): Promise<void> {
    if (firestoreDb) {
      await deleteDoc(doc(firestoreDb, 'offers', id));
    }
    const db = await getDB();
    await db.delete('offers', id);
  }
};
