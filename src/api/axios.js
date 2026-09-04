import { auth, db } from '../firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, increment 
} from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinary';

// Utility helper to simulate Axios response promise
const mockResponse = (data, status = 200, statusText = 'OK') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status,
        statusText,
        headers: {},
        config: {},
      });
    }, 150); // Small natural delay
  });
};

// Uploads a browser File to Cloudinary CDN and returns its public URL
const uploadFile = async (file, pathPrefix = 'zk_rehab_uploads') => {
  if (!file || !(file instanceof File) || file.size === 0) return '';
  const result = await uploadToCloudinary(file, pathPrefix);
  return result.imageUrl;
};

// Parse browser FormData into a clean Javascript object, uploading files on-the-fly
const parseAndUploadFormData = async (formData, storagePath = 'uploads') => {
  if (!(formData instanceof FormData)) {
    return formData;
  }
  const obj = {};
  for (const [key, value] of formData.entries()) {
    let parsedValue = value;
    if (value instanceof File) {
      if (value.size > 0) {
        try {
          parsedValue = await uploadFile(value, storagePath);
        } catch (e) {
          console.error('Failed to upload file to Cloudinary:', e);
          continue;
        }
      } else {
        // Skip size 0 files to avoid overwriting existing URLs in DB
        continue;
      }
    } else {
      if (value === 'true') {
        parsedValue = true;
      } else if (value === 'false') {
        parsedValue = false;
      } else {
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            parsedValue = JSON.parse(value);
          }
        } catch (e) {
          parsedValue = value;
        }
      }
    }

    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        obj[key].push(parsedValue);
      } else {
        obj[key] = [obj[key], parsedValue];
      }
    } else {
      if (key === 'gallery') {
        obj[key] = [parsedValue];
      } else {
        obj[key] = parsedValue;
      }
    }
  }
  return obj;
};

// Recursively strips undefined, NaN, or non-serializable fields from an object for Firestore
const sanitizeFirestoreObject = (obj) => {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreObject).filter(item => item !== undefined && item !== null);
  }
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && typeof value !== 'function') {
      if (typeof value === 'number' && Number.isNaN(value)) continue;
      clean[key] = sanitizeFirestoreObject(value);
    }
  }
  return clean;
};

// One-time Cloud Firestore Seeding
const seedDatabase = async () => {
  try {
    const seedDocRef = doc(db, 'metadata', 'seeding');
    const seedDoc = await getDoc(seedDocRef);
    if (!seedDoc.exists()) {
      // Seed Resources
      const resourcesRef = collection(db, 'resources');
      const SEED_RESOURCES = [
        {
          _id: 'res_1',
          title: 'Understanding Chronic Pain: A Physiotherapy Perspective',
          category: 'blog',
          description: 'An evidence-based guide to understanding chronic pain mechanisms and physiotherapy interventions.',
          tags: ['pain', 'chronic', 'rehabilitation'],
          author: 'ZK Rehab Sphere',
          isPublished: true,
          publishedAt: new Date().toISOString(),
          content: '<p>Chronic pain is defined as pain lasting more than 3 months. Physiotherapy plays a crucial role in pain management through targeted exercises, manual therapy, and patient education...</p>',
          downloadCount: 15,
        },
        {
          _id: 'res_2',
          title: '5 Daily Stretches for Back Pain Relief',
          category: 'blog',
          description: 'Simple evidence-based stretches you can do at home to reduce lumbar back pain.',
          tags: ['stretches', 'back pain', 'home exercise'],
          author: 'ZK Rehab Sphere',
          isPublished: true,
          publishedAt: new Date().toISOString(),
          content: '<p>Back pain affects millions globally. Here are 5 clinically-proven stretches...</p>',
          downloadCount: 42,
        },
        {
          _id: 'res_3',
          title: 'Musculoskeletal Assessment Notes',
          category: 'clinical-notes',
          description: 'Comprehensive clinical notes covering musculoskeletal assessment techniques for physiotherapy students.',
          tags: ['musculoskeletal', 'assessment', 'students'],
          author: 'ZK Rehab Sphere',
          isPublished: true,
          publishedAt: new Date().toISOString(),
          downloadCount: 8,
        },
        {
          _id: 'res_4',
          title: 'Neurology Basics for Physiotherapy Practice',
          category: 'clinical-notes',
          description: 'Core neurological concepts essential for physiotherapy clinical practice.',
          tags: ['neurology', 'clinical notes', 'students'],
          author: 'ZK Rehab Sphere',
          isPublished: true,
          publishedAt: new Date().toISOString(),
          downloadCount: 19,
        },
        {
          _id: 'res_5',
          title: 'Patient Home Exercise Guide — Knee Rehabilitation',
          category: 'pdf',
          description: 'A printable home exercise guide for patients recovering from knee surgeries and injuries.',
          tags: ['knee', 'home exercise', 'patient guide'],
          author: 'ZK Rehab Sphere',
          isPublished: true,
          publishedAt: new Date().toISOString(),
          downloadCount: 64,
        },
      ];
      for (const res of SEED_RESOURCES) {
        await setDoc(doc(resourcesRef, res._id), res);
      }

      // Seed Blogs
      const blogsRef = collection(db, 'blogs');
      const SEED_BLOGS = [
        {
          _id: 'blog_1',
          title: 'The Future of Physiotherapy',
          slug: 'the-future-of-physiotherapy',
          summary: 'Discover how technology and evidence-based practices are shaping the future of rehabilitation.',
          content: '<p>The future of physiotherapy is evolving rapidly with new technologies...</p>',
          coverImage: '/uploads/resources/default.jpg',
          tags: ['future', 'technology'],
          status: 'published',
          publishedAt: new Date().toISOString(),
          author: {
            name: 'ZK Rehab Sphere',
            role: 'Clinical Team',
            image: '/placeholder.jpg'
          },
          likes: 5,
          shares: 2,
          createdAt: new Date().toISOString(),
        },
        {
          _id: 'blog_2',
          title: '5 Tips for Better Posture',
          slug: '5-tips-for-better-posture',
          summary: 'Improve your daily posture with these simple and effective ergonomic tips.',
          content: '<p>Good posture is essential for preventing back and neck pain. Here are 5 tips...</p>',
          coverImage: '/uploads/resources/default.jpg',
          tags: ['posture', 'ergonomics'],
          status: 'published',
          publishedAt: new Date().toISOString(),
          author: {
            name: 'ZK Rehab Sphere',
            role: 'Clinical Team',
            image: '/placeholder.jpg'
          },
          likes: 12,
          shares: 4,
          createdAt: new Date().toISOString(),
        }
      ];
      for (const b of SEED_BLOGS) {
        await setDoc(doc(blogsRef, b._id), b);
      }

      await setDoc(seedDocRef, { seeded: true, seededAt: new Date().toISOString() });
      console.log('DEBUG: Firestore database successfully pre-seeded!');
    }
  } catch (err) {
    console.error('DEBUG: Firestore seeding error:', err);
  }
};

// Trigger seeding check in background
seedDatabase();


// ─── Typed API Helpers ─────────────────────────────────────────────────────────
let activeSessionUser = null;

export const setSessionUser = (user) => {
  activeSessionUser = user;
};

export const enforceAdmin = async () => {
  if (!activeSessionUser) {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          activeSessionUser = userDoc.data();
          return;
        }
      } catch (e) {
        console.warn('enforceAdmin background doc fetch failed:', e);
      }
    }
    const err = new Error('Forbidden');
    err.response = { 
      status: 403, 
      statusText: 'Forbidden', 
      data: { message: '403 Forbidden: Admin privileges required.' } 
    };
    throw err;
  }
  
  if (activeSessionUser.role !== 'admin') {
    const err = new Error('Forbidden');
    err.response = { 
      status: 403, 
      statusText: 'Forbidden', 
      data: { message: '403 Forbidden: Admin privileges required.' } 
    };
    throw err;
  }
};

/** Auth */
export const authAPI = {
  getMe: async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return mockResponse({ user: null });
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      const isSuperAdmin = firebaseUser.email === 'zkrehabsphere@gmail.com';
      const newUser = {
        _id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Guest'),
        photo: firebaseUser.photoURL || '',
        role: isSuperAdmin ? 'admin' : 'patient',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return mockResponse({ user: newUser });
    }
    return mockResponse({ user: userDoc.data() });
  },
  logout: () => mockResponse({ success: true }),
  updateProfile: async (data) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('Unauthorized');
    const parsed = await parseAndUploadFormData(data, 'profile-pics');
    await updateDoc(doc(db, 'users', firebaseUser.uid), parsed);
    
    // Get updated user document
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const updatedUser = userDoc.data();

    // Sync to expert profile if exists
    const expertsRef = collection(db, 'experts');
    const q = query(expertsRef, where('linkedUserId', '==', firebaseUser.uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const expDoc = snap.docs[0];
      const updates = {};
      if (parsed.name) updates.name = parsed.name;
      if (parsed.photo) updates.image = parsed.photo;
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'experts', expDoc.id), updates);
      }
    }
    return mockResponse({ user: updatedUser });
  },
  uploadProfileImage: async (formData) => {
    return authAPI.updateProfile(formData);
  },
  uploadCoverImage: async (formData) => {
    return authAPI.updateProfile(formData);
  },
  changePassword: () => mockResponse({ success: true, message: 'Password changed successfully.' }),
  getProfile: async () => {
    return authAPI.getMe();
  },
  verifyFirebase: async (token) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('No user authenticated in Firebase');
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    let user;
    if (!userDoc.exists()) {
      const isSuperAdmin = firebaseUser.email === 'zkrehabsphere@gmail.com';
      user = {
        _id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Guest'),
        photo: firebaseUser.photoURL || '',
        role: isSuperAdmin ? 'admin' : 'patient',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), user);
    } else {
      user = userDoc.data();
    }
    return mockResponse({ success: true, user });
  },
};

/** Appointments */
export const appointmentsAPI = {
  book: async (data) => {
    const _id = Math.random().toString(36).substring(2, 9);
    const apt = {
      _id,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'appointments', _id), apt);

    // Mark slot as booked
    if (data.slotId) {
      await updateDoc(doc(db, 'slots', data.slotId), { isBooked: true });
    } else {
      const q = query(
        collection(db, 'slots'), 
        where('expert', '==', data.expert), 
        where('date', '==', data.slotDate),
        where('time', '==', data.slotTime)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(doc(db, 'slots', snap.docs[0].id), { isBooked: true });
      }
    }
    return mockResponse({ appointment: apt });
  },
  getAll: async (params = {}) => {
    let q = collection(db, 'appointments');
    if (params.patient) {
      q = query(q, where('patient', '==', params.patient));
    }
    if (params.expert) {
      q = query(q, where('expert', '==', params.expert));
    }
    if (params.status && params.status !== 'all') {
      q = query(q, where('status', '==', params.status));
    }
    const snap = await getDocs(q);
    const appointments = snap.docs.map(doc => doc.data());
    return mockResponse({ appointments });
  },
  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'appointments', id));
    if (!docSnap.exists()) throw new Error('Appointment not found.');
    return mockResponse(docSnap.data());
  },
  updateStatus: async (id, data) => {
    await updateDoc(doc(db, 'appointments', id), data);
    const updated = await getDoc(doc(db, 'appointments', id));
    
    // If appointment is cancelled, mark slot as available again
    if (data.status === 'cancelled') {
      const apt = updated.data();
      const q = query(
        collection(db, 'slots'), 
        where('expert', '==', apt.expert), 
        where('date', '==', apt.slotDate),
        where('time', '==', apt.slotTime)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(doc(db, 'slots', snap.docs[0].id), { isBooked: false });
      }
    }
    return mockResponse(updated.data());
  },
  update: async (id, data) => {
    return appointmentsAPI.updateStatus(id, data);
  },
  delete: async (id) => {
    const aptDoc = await getDoc(doc(db, 'appointments', id));
    if (aptDoc.exists()) {
      const apt = aptDoc.data();
      const q = query(
        collection(db, 'slots'), 
        where('expert', '==', apt.expert), 
        where('date', '==', apt.slotDate),
        where('time', '==', apt.slotTime)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(doc(db, 'slots', snap.docs[0].id), { isBooked: false });
      }
      await deleteDoc(doc(db, 'appointments', id));
    }
    return mockResponse({ success: true });
  },
  getStats: async () => {
    return usersAPI.getDashboardStats();
  },
};

/** Slots */
export const slotsAPI = {
  getAvailable: async (params = {}) => {
    let q = query(collection(db, 'slots'), where('isBooked', '==', false), where('isActive', '==', true));
    if (params.expertId) {
      q = query(q, where('expert', '==', params.expertId));
    }
    if (params.date) {
      q = query(q, where('date', '==', params.date));
    }
    const snap = await getDocs(q);
    const slots = snap.docs.map(doc => doc.data());
    return mockResponse({ slots });
  },
  getAll: async (params = {}) => {
    let q = collection(db, 'slots');
    if (params.doctorId) {
      q = query(q, where('expert', '==', params.doctorId));
    }
    const snap = await getDocs(q);
    const slots = snap.docs.map(doc => doc.data());
    return mockResponse({ slots });
  },
  create: async (data) => {
    const slotsRef = collection(db, 'slots');
    const newSlots = [];
    const { expertId, date, times } = data;

    const existingSnap = await getDocs(query(slotsRef, where('expert', '==', expertId), where('date', '==', date)));
    const existingTimes = existingSnap.docs.map(d => d.data().time);

    for (const time of times) {
      if (!existingTimes.includes(time)) {
        const _id = Math.random().toString(36).substring(2, 9);
        const newSlot = {
          _id,
          expert: expertId,
          date,
          time,
          isBooked: false,
          isActive: true,
        };
        await setDoc(doc(db, 'slots', _id), newSlot);
        newSlots.push(newSlot);
      }
    }
    return mockResponse({ slots: newSlots });
  },
  update: async (id, data) => {
    await updateDoc(doc(db, 'slots', id), data);
    const updated = await getDoc(doc(db, 'slots', id));
    return mockResponse(updated.data());
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'slots', id));
    return mockResponse({ success: true });
  },
};

/** Experts */
export const expertsAPI = {
  getMe: async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return mockResponse({ expert: null });
    const expertsRef = collection(db, 'experts');
    const q = query(expertsRef, where('linkedUserId', '==', firebaseUser.uid));
    const snap = await getDocs(q);
    if (snap.empty) return mockResponse({ expert: null });
    return mockResponse({ expert: snap.docs[0].data() });
  },
  updateMe: async (data) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error('Unauthorized');
    const parsed = await parseAndUploadFormData(data, 'experts');
    const expertsRef = collection(db, 'experts');
    const q = query(expertsRef, where('linkedUserId', '==', firebaseUser.uid));
    const snap = await getDocs(q);
    let expertDoc;
    if (snap.empty) {
      const _id = Math.random().toString(36).substring(2, 9);
      const newExpert = {
        _id,
        linkedUserId: firebaseUser.uid,
        ...parsed,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'experts', _id), newExpert);
      expertDoc = newExpert;
    } else {
      const id = snap.docs[0].id;
      await updateDoc(doc(db, 'experts', id), parsed);
      const updated = await getDoc(doc(db, 'experts', id));
      expertDoc = updated.data();
    }

    // Sync fields to User account
    const userUpdates = {};
    if (parsed.name) userUpdates.name = parsed.name;
    if (parsed.phone) userUpdates.phone = parsed.phone;
    if (parsed.image) userUpdates.photo = parsed.image;
    if (Object.keys(userUpdates).length > 0) {
      await updateDoc(doc(db, 'users', firebaseUser.uid), userUpdates);
    }
    return mockResponse({ expert: expertDoc });
  },
  getAll: async () => {
    const q = query(collection(db, 'experts'), where('isActive', '==', true));
    const snap = await getDocs(q);
    let expertsList = snap.docs.map(doc => doc.data());
    
    const usersSnap = await getDocs(collection(db, 'users'));
    const usersList = usersSnap.docs.map(doc => doc.data());

    expertsList = expertsList.map(e => {
      const user = usersList.find(u => u._id === e.linkedUserId);
      return { ...e, linkedUserId: user || e.linkedUserId };
    });
    return mockResponse({ experts: expertsList });
  },
  getAllAdmin: async () => {
    const snap = await getDocs(collection(db, 'experts'));
    let expertsList = snap.docs.map(doc => doc.data());
    
    const usersSnap = await getDocs(collection(db, 'users'));
    const usersList = usersSnap.docs.map(doc => doc.data());

    expertsList = expertsList.map(e => {
      const user = usersList.find(u => u._id === e.linkedUserId);
      return { ...e, linkedUserId: user || e.linkedUserId };
    });
    return mockResponse({ experts: expertsList });
  },
  getById: async (id) => {
    let expertDoc = await getDoc(doc(db, 'experts', id));
    let expert = expertDoc.exists() ? expertDoc.data() : null;
    
    if (!expert) {
      const q = query(collection(db, 'experts'), where('linkedUserId', '==', id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        expert = snap.docs[0].data();
      }
    }

    if (!expert) return mockResponse(null);

    const userDoc = await getDoc(doc(db, 'users', expert.linkedUserId));
    const user = userDoc.exists() ? userDoc.data() : null;

    return mockResponse({ ...expert, linkedUserId: user || expert.linkedUserId });
  },
  create: async (data) => {
    const parsed = await parseAndUploadFormData(data, 'experts');
    const _id = Math.random().toString(36).substring(2, 9);
    const newExpert = {
      _id,
      ...parsed,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'experts', _id), newExpert);

    if (parsed.linkedUserId) {
      const uIdx = parsed.linkedUserId;
      const userDoc = await getDoc(doc(db, 'users', uIdx));
      if (userDoc.exists()) {
        const userUpdates = { role: 'expert' };
        if (parsed.name) userUpdates.name = parsed.name;
        if (parsed.phone) userUpdates.phone = parsed.phone;
        if (parsed.image) userUpdates.photo = parsed.image;
        await updateDoc(doc(db, 'users', uIdx), userUpdates);
      }
    }
    return mockResponse(newExpert);
  },
  update: async (id, data) => {
    const parsed = await parseAndUploadFormData(data, 'experts');
    
    let expertId = id;
    let expertDoc = await getDoc(doc(db, 'experts', id));
    if (!expertDoc.exists()) {
      const q = query(collection(db, 'experts'), where('linkedUserId', '==', id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        expertId = snap.docs[0].id;
        expertDoc = snap.docs[0];
      } else {
        throw new Error('Expert profile not found.');
      }
    }

    const oldLinkedUserId = expertDoc.data().linkedUserId;
    await updateDoc(doc(db, 'experts', expertId), parsed);
    const updated = await getDoc(doc(db, 'experts', expertId));

    if (oldLinkedUserId && oldLinkedUserId !== parsed.linkedUserId) {
      await updateDoc(doc(db, 'users', oldLinkedUserId), { role: 'patient' });
    }

    const targetUserId = parsed.linkedUserId || oldLinkedUserId;
    if (targetUserId) {
      const userDoc = await getDoc(doc(db, 'users', targetUserId));
      if (userDoc.exists()) {
        const userUpdates = { role: 'expert' };
        if (parsed.name) userUpdates.name = parsed.name;
        if (parsed.phone) userUpdates.phone = parsed.phone;
        if (parsed.image) userUpdates.photo = parsed.image;
        await updateDoc(doc(db, 'users', targetUserId), userUpdates);
      }
    }
    return mockResponse(updated.data());
  },
  delete: async (id) => {
    const expertDoc = await getDoc(doc(db, 'experts', id));
    if (expertDoc.exists()) {
      const linkedUserId = expertDoc.data().linkedUserId;
      if (linkedUserId) {
        await updateDoc(doc(db, 'users', linkedUserId), { role: 'patient' });
      }
      await deleteDoc(doc(db, 'experts', id));
    }
    return mockResponse({ success: true });
  },
};

/** Resources */
export const resourcesAPI = {
  getPublished: async (params = {}) => {
    let q = query(collection(db, 'resources'), where('isPublished', '==', true));
    if (params.category) {
      q = query(q, where('category', '==', params.category));
    }
    const snap = await getDocs(q);
    const resources = snap.docs.map(doc => doc.data());
    return mockResponse({ resources });
  },
  getAllAdmin: async (params = {}) => {
    const snap = await getDocs(collection(db, 'resources'));
    const resources = snap.docs.map(doc => doc.data());
    return mockResponse({ resources });
  },
  getById: async (id) => {
    const docSnap = await getDoc(doc(db, 'resources', id));
    if (!docSnap.exists()) throw new Error('Resource not found.');
    return mockResponse(docSnap.data());
  },
  create: async (formData) => {
    const parsed = await parseAndUploadFormData(formData, 'resources');
    const _id = Math.random().toString(36).substring(2, 9);
    const resource = {
      _id,
      ...parsed,
      isPublished: true,
      downloadCount: 0,
      publishedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'resources', _id), resource);
    return mockResponse(resource);
  },
  update: async (id, formData) => {
    const parsed = await parseAndUploadFormData(formData, 'resources');
    await updateDoc(doc(db, 'resources', id), parsed);
    const updated = await getDoc(doc(db, 'resources', id));
    return mockResponse(updated.data());
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'resources', id));
    return mockResponse({ success: true });
  },
  incrementDownload: async (id) => {
    // Basic local updates or increment (if rules allow update)
    try {
      const refDoc = doc(db, 'resources', id);
      const res = await getDoc(refDoc);
      if (res.exists()) {
        const newCount = (res.data().downloadCount || 0) + 1;
        await updateDoc(refDoc, { downloadCount: newCount });
      }
    } catch (e) {
      console.warn("Could not increment download count in cloud db: ", e);
    }
    return mockResponse({ success: true });
  },
};

/** Contact */
export const contactAPI = {
  send: async (data) => {
    const _id = Math.random().toString(36).substring(2, 9);
    const msg = {
      _id,
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'contact', _id), msg);
    return mockResponse(msg);
  },
  getAll: async (params = {}) => {
    const snap = await getDocs(collection(db, 'contact'));
    const messages = snap.docs.map(doc => doc.data());
    return mockResponse({ messages });
  },
  markRead: async (id, isRead = true) => {
    await updateDoc(doc(db, 'contact', id), { isRead });
    return mockResponse({ success: true });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'contact', id));
    return mockResponse({ success: true });
  },
};

/** Newsletter */
export const newsletterAPI = {
  subscribe: async (email) => {
    const _id = Math.random().toString(36).substring(2, 9);
    await setDoc(doc(db, 'newsletter', _id), { _id, email, createdAt: new Date().toISOString() });
    return mockResponse({ success: true });
  },
  getAll: async (params = {}) => {
    const snap = await getDocs(collection(db, 'newsletter'));
    const subscribers = snap.docs.map(doc => doc.data());
    return mockResponse({ subscribers });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'newsletter', id));
    return mockResponse({ success: true });
  },
};

/** Users (Admin) */
export const usersAPI = {
  getAll: async (params = {}) => {
    await enforceAdmin();
    let q = collection(db, 'users');
    if (params.role) {
      q = query(q, where('role', '==', params.role));
    }
    const snap = await getDocs(q);
    let usersList = snap.docs.map(doc => doc.data());
    
    const expertsSnap = await getDocs(collection(db, 'experts'));
    const expertsList = expertsSnap.docs.map(doc => doc.data());

    usersList = usersList.map(u => {
      const profile = expertsList.find(e => e.linkedUserId === u._id);
      return { ...u, profile };
    });
    return mockResponse({ users: usersList });
  },
  getById: async (id) => {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (!userDoc.exists()) throw new Error('User not found');
    const user = userDoc.data();
    
    const expertsRef = collection(db, 'experts');
    const q = query(expertsRef, where('linkedUserId', '==', id));
    const snap = await getDocs(q);
    const profile = !snap.empty ? snap.docs[0].data() : null;
    return mockResponse({ user: { ...user, profile } });
  },
  updateRole: async (id, role) => {
    await updateDoc(doc(db, 'users', id), { role });
    const userDoc = await getDoc(doc(db, 'users', id));
    
    if (role === 'patient') {
      const expertsRef = collection(db, 'experts');
      const q = query(expertsRef, where('linkedUserId', '==', id));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'experts', d.id));
      }
    }
    return mockResponse({ user: userDoc.data() });
  },
  setActive: async (id, isActive) => {
    await updateDoc(doc(db, 'users', id), { isActive });
    const userDoc = await getDoc(doc(db, 'users', id));
    return mockResponse({ user: userDoc.data() });
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'users', id));
    const expertsRef = collection(db, 'experts');
    const q = query(expertsRef, where('linkedUserId', '==', id));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'experts', d.id));
    }
    return mockResponse({ success: true });
  },
  getDashboardStats: async () => {
    await enforceAdmin();
    const usersSnap = await getDocs(collection(db, 'users'));
    const aptsSnap = await getDocs(collection(db, 'appointments'));
    const messagesSnap = await getDocs(collection(db, 'contact'));
    const newsletterSnap = await getDocs(collection(db, 'newsletter'));

    const users = usersSnap.docs.map(d => d.data());
    const appointments = aptsSnap.docs.map(d => d.data());
    const messages = messagesSnap.docs.map(d => d.data());
    const subscribers = newsletterSnap.docs.map(d => d.data());

    const totalUsers = users.length;
    const totalPatients = users.filter(u => u.role === 'patient').length;
    const totalDoctors = users.filter(u => u.role === 'expert').length;
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
    const unreadMessages = messages.filter(m => !m.isRead).length;
    const totalSubscribers = subscribers.length;

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentAppointments = appointments.filter(a => new Date(a.createdAt).getTime() >= weekAgo).length;

    return mockResponse({
      success: true,
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        unreadMessages,
        totalSubscribers,
        recentAppointments,
      }
    });
  },
};

/** Blogs */
export const blogsAPI = {
  getPublished: async (params = {}) => {
    let q = query(collection(db, 'blogs'), where('status', '==', 'published'));
    if (params.category) {
      q = query(q, where('category', '==', params.category));
    }
    const snap = await getDocs(q);
    let blogs = snap.docs.map(doc => doc.data());

    if (params.search) {
      const term = params.search.toLowerCase();
      blogs = blogs.filter(b => b.title.toLowerCase().includes(term) || b.summary.toLowerCase().includes(term));
    }

    blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    let paginatedBlogs = blogs;
    let page = Number(params.page) || 1;
    let limitVal = Number(params.limit) || 9;
    const total = blogs.length;
    const pages = Math.ceil(total / limitVal);
    const startIndex = (page - 1) * limitVal;
    paginatedBlogs = blogs.slice(startIndex, startIndex + limitVal);

    return mockResponse({
      blogs: paginatedBlogs,
      pagination: {
        total,
        page,
        limit: limitVal,
        pages: pages || 1,
      }
    });
  },
  getAllAdmin: async (params = {}) => {
    const snap = await getDocs(collection(db, 'blogs'));
    let blogs = snap.docs.map(doc => doc.data());
    blogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return mockResponse({ blogs, pagination: { total: blogs.length, page: 1, limit: blogs.length, pages: 1 } });
  },
  getBySlug: async (slug) => {
    const q = query(collection(db, 'blogs'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('Blog not found.');
    return mockResponse(snap.docs[0].data());
  },
  create: async (formData) => {
    const parsed = await parseAndUploadFormData(formData, 'blogs');
    const _id = Math.random().toString(36).substring(2, 9);
    
    const firebaseUser = auth.currentUser;
    const authorObj = {
      name: firebaseUser?.displayName || 'ZK Rehab Sphere',
      role: 'Clinical Team',
      image: firebaseUser?.photoURL || '/placeholder.jpg'
    };

    const blog = {
      _id,
      ...parsed,
      likes: 0,
      shares: 0,
      author: authorObj,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'blogs', _id), blog);
    return mockResponse(blog);
  },
  update: async (id, formData) => {
    const parsed = await parseAndUploadFormData(formData, 'blogs');
    await updateDoc(doc(db, 'blogs', id), parsed);
    const updated = await getDoc(doc(db, 'blogs', id));
    return mockResponse(updated.data());
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'blogs', id));
    return mockResponse({ success: true });
  },
  like: async (id) => {
    try {
      const docRef = doc(db, 'blogs', id);
      const res = await getDoc(docRef);
      if (res.exists()) {
        const newLikes = (res.data().likes || 0) + 1;
        await updateDoc(docRef, { likes: newLikes });
      }
    } catch (e) {
      console.warn("Could not increment like: ", e);
    }
    return mockResponse({ success: true });
  },
  share: async (id) => {
    try {
      const docRef = doc(db, 'blogs', id);
      const res = await getDoc(docRef);
      if (res.exists()) {
        const newShares = (res.data().shares || 0) + 1;
        await updateDoc(docRef, { shares: newShares });
      }
    } catch (e) {
      console.warn("Could not increment share: ", e);
    }
    return mockResponse({ success: true });
  },
};

// Default Public Collaborations Seed Data
const SEED_COLLABORATIONS = [
  {
    _id: 'collab_1',
    name: 'The Platinum Fitness Club',
    type: 'Gym',
    description: 'Premier fitness & athletic training facility in Sector 35 Chandigarh. Partnering with ZK RehabSphere for member posture assessments, injury prevention screenings, and clinical recovery support.',
    address: 'SCO 142-143, Sector 35-C',
    city: 'Chandigarh',
    state: 'Chandigarh',
    contactPerson: 'Rahul Sharma',
    contactNumber: '+91 9876543210',
    email: 'contact@platinumfitness.in',
    website: 'https://platinumfitness.in',
    instagram: '',
    facebook: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Active',
    servicesOffered: [
      'Free Physiotherapy Assessment',
      'Posture Assessment',
      'Sports Injury Screening',
      'Injury Prevention'
    ]
  },
  {
    _id: 'collab_2',
    name: 'Tricity Athletics Academy',
    type: 'Sports Academy',
    description: 'Leading sports and youth athletics training center in Mohali. Conducting regular biomechanical movement analysis and injury screening camps with senior clinical physiotherapists.',
    address: 'Phase 7, Industrial Area',
    city: 'Mohali',
    state: 'Punjab',
    contactPerson: 'Gurpreet Singh',
    contactNumber: '+91 9812345678',
    email: 'info@tricityathletics.com',
    website: '',
    instagram: '',
    facebook: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Active',
    servicesOffered: [
      'Movement Assessment',
      'Sports Performance',
      'Recovery Program',
      'Awareness Camp'
    ]
  },
  {
    _id: 'collab_3',
    name: 'Gold’s Gym & Wellness Hub',
    type: 'Fitness Center',
    description: 'State-of-the-art strength and cardio center in Kharar. Offering free on-site physical therapy consultations and joint mobility workshops for all registered members.',
    address: 'Landran Road, Sector 125',
    city: 'Kharar',
    state: 'Punjab',
    contactPerson: 'Manpreet Kaur',
    contactNumber: '+91 9779123456',
    email: 'kharar@goldsgym.in',
    website: '',
    instagram: '',
    facebook: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Active',
    servicesOffered: [
      'Physiotherapy Consultation',
      'Free Physiotherapy Assessment',
      'Workshop'
    ]
  }
];

// Local Storage Persistence Helpers for Collaborations, Campaigns, and Enquiries
const getStorageList = (key) => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : [];
  } catch (e) {
    return [];
  }
};

const saveStorageList = (key, list) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn(`Could not save ${key}:`, e);
  }
};

/** Collaborations API */
export const collaborationsAPI = {
  getAll: async () => {
    let cloudList = [];
    try {
      const snap = await getDocs(collection(db, 'collaborations'));
      cloudList = snap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    } catch (err) {
      console.warn('Firestore collaborations fetch warning:', err);
    }
    const localList = getStorageList('zk_rehab_collaborations');
    const map = new Map();
    [...SEED_COLLABORATIONS, ...cloudList, ...localList].forEach(item => {
      if (item && item._id) map.set(item._id, item);
    });
    return mockResponse({ collaborations: Array.from(map.values()) });
  },
  getById: async (id) => {
    try {
      const docSnap = await getDoc(doc(db, 'collaborations', id));
      if (docSnap.exists()) return mockResponse({ _id: docSnap.id, ...docSnap.data() });
    } catch (err) {
      console.warn('Firestore getById warning:', err);
    }
    const localList = getStorageList('zk_rehab_collaborations');
    const localItem = localList.find(c => c._id === id);
    if (localItem) return mockResponse(localItem);
    throw new Error('Collaboration not found.');
  },
  create: async (formData) => {
    const parsed = await parseAndUploadFormData(formData, 'collaborations');
    const _id = Math.random().toString(36).substring(2, 9);
    
    // Combine existingGallery and gallery if present
    const existingG = Array.isArray(parsed.existingGallery) ? parsed.existingGallery : [];
    const newG = Array.isArray(parsed.gallery) ? parsed.gallery : (parsed.gallery ? [parsed.gallery] : []);
    const gallery = [...existingG, ...newG];
    delete parsed.existingGallery;
    if (gallery.length > 0) {
      parsed.gallery = gallery;
    }

    const item = sanitizeFirestoreObject({
      _id,
      ...parsed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    try {
      await setDoc(doc(db, 'collaborations', _id), item);
    } catch (err) {
      console.warn('Firestore setDoc failed for collaboration (permission/network error), saved locally:', err);
    }

    const currentList = getStorageList('zk_rehab_collaborations');
    saveStorageList('zk_rehab_collaborations', [item, ...currentList.filter(c => c._id !== _id)]);

    return mockResponse(item);
  },
  update: async (id, formData) => {
    const parsed = await parseAndUploadFormData(formData, 'collaborations');
    
    // Combine existingGallery and gallery if present
    const existingG = Array.isArray(parsed.existingGallery) ? parsed.existingGallery : [];
    const newG = Array.isArray(parsed.gallery) ? parsed.gallery : (parsed.gallery ? [parsed.gallery] : []);
    const gallery = [...existingG, ...newG];
    delete parsed.existingGallery;
    if (gallery.length > 0 || Array.isArray(parsed.existingGallery)) {
      parsed.gallery = gallery;
    }

    const updates = sanitizeFirestoreObject({
      ...parsed,
      updatedAt: new Date().toISOString()
    });

    try {
      await setDoc(doc(db, 'collaborations', id), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc update failed for collaboration (permission/network error), saved locally:', err);
    }

    const currentList = getStorageList('zk_rehab_collaborations');
    let existingItem = currentList.find(c => c._id === id) || { _id: id };
    const updatedItem = { ...existingItem, ...updates, _id: id };
    saveStorageList('zk_rehab_collaborations', currentList.some(c => c._id === id)
      ? currentList.map(c => c._id === id ? updatedItem : c)
      : [updatedItem, ...currentList]);

    return mockResponse(updatedItem);
  },
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'collaborations', id));
    } catch (err) {
      console.warn('Firestore deleteDoc failed for collaboration, removed locally:', err);
    }
    const currentList = getStorageList('zk_rehab_collaborations');
    saveStorageList('zk_rehab_collaborations', currentList.filter(c => c._id !== id));
    return mockResponse({ success: true });
  }
};

/** Campaigns/Events API */
export const campaignsAPI = {
  getAll: async () => {
    let cloudList = [];
    try {
      const snap = await getDocs(collection(db, 'campaigns'));
      cloudList = snap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    } catch (err) {
      console.warn('Firestore campaigns fetch warning:', err);
    }
    const localList = getStorageList('zk_rehab_campaigns');
    const map = new Map();
    [...cloudList, ...localList].forEach(item => {
      if (item && item._id) map.set(item._id, item);
    });
    return mockResponse({ campaigns: Array.from(map.values()) });
  },
  getById: async (id) => {
    try {
      const docSnap = await getDoc(doc(db, 'campaigns', id));
      if (docSnap.exists()) return mockResponse({ _id: docSnap.id, ...docSnap.data() });
    } catch (err) {
      console.warn('Firestore campaign getById warning:', err);
    }
    const localList = getStorageList('zk_rehab_campaigns');
    const localItem = localList.find(c => c._id === id);
    if (localItem) return mockResponse(localItem);
    throw new Error('Campaign not found.');
  },
  create: async (data) => {
    const _id = Math.random().toString(36).substring(2, 9);
    const item = sanitizeFirestoreObject({
      _id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    try {
      await setDoc(doc(db, 'campaigns', _id), item);
    } catch (err) {
      console.warn('Firestore setDoc failed for campaign, saved locally:', err);
    }

    const currentList = getStorageList('zk_rehab_campaigns');
    saveStorageList('zk_rehab_campaigns', [item, ...currentList.filter(c => c._id !== _id)]);

    return mockResponse(item);
  },
  update: async (id, data) => {
    const updates = sanitizeFirestoreObject({
      ...data,
      updatedAt: new Date().toISOString()
    });

    try {
      await setDoc(doc(db, 'campaigns', id), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore update failed for campaign, saved locally:', err);
    }

    const currentList = getStorageList('zk_rehab_campaigns');
    let existingItem = currentList.find(c => c._id === id) || { _id: id };
    const updatedItem = { ...existingItem, ...updates, _id: id };
    saveStorageList('zk_rehab_campaigns', currentList.some(c => c._id === id)
      ? currentList.map(c => c._id === id ? updatedItem : c)
      : [updatedItem, ...currentList]);

    return mockResponse(updatedItem);
  },
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (err) {
      console.warn('Firestore deleteDoc failed for campaign, removed locally:', err);
    }
    const currentList = getStorageList('zk_rehab_campaigns');
    saveStorageList('zk_rehab_campaigns', currentList.filter(c => c._id !== id));
    return mockResponse({ success: true });
  }
};

/** Registrations API */
import { notificationService } from '../services/notificationService';

export const registrationsAPI = {
  getAll: async () => {
    let cloudList = [];
    try {
      await enforceAdmin();
      const snap = await getDocs(collection(db, 'registrations'));
      cloudList = snap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    } catch (err) {
      console.warn('Registrations getAll warning:', err);
    }
    const localList = getStorageList('zk_rehab_registrations');
    const map = new Map();
    [...cloudList, ...localList].forEach(item => {
      if (item && item._id) map.set(item._id, item);
    });
    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return mockResponse({ registrations: list });
  },
  create: async (data) => {
    const year = new Date().getFullYear();
    let count = 0;
    try {
      const snap = await getDocs(collection(db, 'registrations'));
      count = snap.size;
    } catch (e) {
      count = 0;
    }
    const nextNum = String(count + 1).padStart(6, '0');
    const registrationId = `ZKR-${year}-${nextNum}`;

    const _id = Math.random().toString(36).substring(2, 9);
    const registration = sanitizeFirestoreObject({
      _id,
      registrationId,
      ...data,
      status: 'Registered',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    try {
      await setDoc(doc(db, 'registrations', _id), registration);
    } catch (err) {
      console.warn('Firestore setDoc failed for registration, saved locally:', err);
    }

    const currentList = getStorageList('zk_rehab_registrations');
    saveStorageList('zk_rehab_registrations', [registration, ...currentList.filter(r => r._id !== _id)]);

    let venueName = 'Other / To be announced';
    let campaignTitle = 'Free Assessment Camp';
    let campaignDate = 'N/A';

    try {
      if (data.collaborationId) {
        const collabDoc = await getDoc(doc(db, 'collaborations', data.collaborationId));
        if (collabDoc.exists()) {
          venueName = collabDoc.data().name;
        }
      }
      if (data.eventId) {
        const eventDoc = await getDoc(doc(db, 'campaigns', data.eventId));
        if (eventDoc.exists()) {
          campaignTitle = eventDoc.data().title;
          campaignDate = eventDoc.data().date;
        }
      }
    } catch (err) {
      console.warn('Error fetching metadata for notification:', err);
    }

    notificationService.sendRegistrationNotification({
      registrationId,
      venueName,
      campaignTitle,
      campaignDate,
      ...registration
    }).catch(e => console.error('Failed to send registration notification:', e));

    return mockResponse(registration);
  },
  updateStatus: async (id, status) => {
    const updates = sanitizeFirestoreObject({ status, updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'registrations', id), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore updateStatus failed for registration, updated locally:', err);
    }

    const currentList = getStorageList('zk_rehab_registrations');
    let existingItem = currentList.find(r => r._id === id) || { _id: id };
    const updatedItem = { ...existingItem, ...updates, _id: id };
    saveStorageList('zk_rehab_registrations', currentList.some(r => r._id === id)
      ? currentList.map(r => r._id === id ? updatedItem : r)
      : [updatedItem, ...currentList]);

    return mockResponse(updatedItem);
  },
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (err) {
      console.warn('Firestore deleteDoc failed for registration, removed locally:', err);
    }
    const currentList = getStorageList('zk_rehab_registrations');
    saveStorageList('zk_rehab_registrations', currentList.filter(r => r._id !== id));
    return mockResponse({ success: true });
  }
};

/** Collaboration Enquiries API */
export const enquiriesAPI = {
  getAll: async () => {
    let cloudList = [];
    try {
      await enforceAdmin();
      const snap = await getDocs(collection(db, 'collaboration_enquiries'));
      cloudList = snap.docs.map(doc => doc.data());
    } catch (err) {
      console.warn('Firestore enquiries fetch warning:', err);
    }
    const localList = getStorageList('zk_rehab_enquiries');
    const map = new Map();
    [...cloudList, ...localList].forEach(item => {
      if (item && item._id) map.set(item._id, item);
    });
    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return mockResponse({ enquiries: list });
  },
  create: async (data) => {
    const _id = Math.random().toString(36).substring(2, 9);
    const enquiry = sanitizeFirestoreObject({
      _id,
      ...data,
      createdAt: new Date().toISOString()
    });

    try {
      await setDoc(doc(db, 'collaboration_enquiries', _id), enquiry);
    } catch (err) {
      console.warn('Firestore setDoc failed for enquiry, saved locally:', err);
    }

    const currentList = getStorageList('zk_rehab_enquiries');
    saveStorageList('zk_rehab_enquiries', [enquiry, ...currentList.filter(e => e._id !== _id)]);

    return mockResponse(enquiry);
  }
};

/** Analytics API */
export const analyticsAPI = {
  logEvent: async (data) => {
    const _id = Math.random().toString(36).substring(2, 9);
    const event = sanitizeFirestoreObject({
      _id,
      ...data,
      timestamp: new Date().toISOString()
    });
    await setDoc(doc(db, 'analytics_events', _id), event);
    return mockResponse(event);
  },
  
  getMetrics: async () => {
    await enforceAdmin();
    
    // Fetch website analytics events
    const snap = await getDocs(collection(db, 'analytics_events'));
    const events = snap.docs.map(doc => doc.data());

    // Fetch primary business database collections
    const [regSnap, aptSnap, enqSnap, colSnap, campSnap] = await Promise.all([
      getDocs(collection(db, 'registrations')),
      getDocs(collection(db, 'appointments')),
      getDocs(collection(db, 'collaboration_enquiries')),
      getDocs(collection(db, 'collaborations')),
      getDocs(collection(db, 'campaigns'))
    ]);
    
    const registrations = regSnap.docs.map(d => d.data());
    const appointments = aptSnap.docs.map(d => d.data());
    const enquiries = enqSnap.docs.map(d => d.data());
    const collaborations = colSnap.docs.map(d => ({ _id: d.id, ...d.data() }));
    const campaignsList = campSnap.docs.map(d => d.data());



    return mockResponse({
      success: true,
      events,
      registrations,
      appointments,
      enquiries,
      collaborations,
      campaigns: campaignsList
    });
  }
};

export default authAPI;

