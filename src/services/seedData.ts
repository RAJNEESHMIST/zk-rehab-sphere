import { Expert, Service, BlogPost, ResourceItem, BodyPartCondition, SiteSettings, ReviewItem } from '../types';

import founderImg from '../assets/founder.jpeg';
import receptionImg from '../assets/zk-reception.png';
import physioGymImg from '../assets/physio-gym.png';
import physioTreatmentImg from '../assets/physio-treatment.png';
import receptionModernImg from '../assets/reception-modern.png';
import zkReceptionImg from '../assets/zk-reception.png';
import service1Img from '../assets/service-1.png';
import service2Img from '../assets/service-2.png';
import service3Img from '../assets/service-3.png';
import service4Img from '../assets/service-4.png';
import expert1Img from '../assets/expert-1.png';
import expert2Img from '../assets/expert-2.png';
import expert3Img from '../assets/expert-3.png';
import expertManiImg from '../assets/expert-mani.jpeg';
import expertMehulImg from '../assets/expert-mehul.jpeg';
import expertNumanImg from '../assets/expert-numan.jpeg';
import bookCoverImg from '../assets/book-cover.png';
import blogBgImg from '../assets/blog-bg.png';

export const initialSiteSettings: SiteSettings = {
  clinicName: "ZK Rehab Sphere",
  tagline: "Empowering recovery through advanced diagnostics, personalized therapy, and compassionate care.",
  founderName: "Sajid Khan",
  founderTitle: "Founder & Lead Physiotherapy Specialist",
  founderBio: "Founded ZK Rehab Sphere with a vision to build a premier rehabilitation platform grounded in science, structured clinical learning, and accessible home-based care across Chandigarh Tricity.",
  phone: "+91 7340820883",
  whatsapp: "+91 7340820883",
  email: "zkrehabsphere@gmail.com",
  address: "Chandigarh Tricity Region (Chandigarh | Mohali | Kharar)",
  areasCovered: ["Chandigarh", "Mohali", "Kharar"],
  heroTitle: "Evidence-Based Home Physiotherapy & Rehabilitation",
  heroSubtitle: "Rebuilding strength, restoring movement, and restoring confidence in the comfort of your home across Chandigarh, Mohali, & Kharar.",
  openingHours: "Mon - Sat: 8:00 AM - 8:00 PM | Sun: By Appointment",
  socialLinks: {
    facebook: "https://www.facebook.com/share/18UmYRQRDr/",
    instagram: "https://www.instagram.com/zkrehabsphere",
    linkedin: "https://www.linkedin.com/company/zk-rehab-sphere/",
    youtube: "https://youtube.com/@zkrehabsphere"
  },
  metaTitle: "ZK Rehab Sphere | Home Visit Physiotherapy Chandigarh, Mohali & Kharar",
  metaDescription: "Premier home visit physiotherapy and rehabilitation in Chandigarh Tricity. Specialized in Stroke rehab, Knee replacement, Spinal care, Sciatica & Sports injuries."
};

export const initialExperts: Expert[] = [
  {
    id: "exp-1",
    name: "Sajid Khan",
    role: "Founder & Lead Physiotherapy Specialist",
    qualification: "BPT, MPT (Neurology Specialist)",
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 142,
    specializations: ["Stroke Rehabilitation", "Paralysis & Hemiplegia", "Spinal Cord Care", "Cupping Therapy (Hijama)"],
    biography: "Sajid Khan is an expert physical therapist with specialized training in neurological rehabilitation and post-stroke recovery. He leads ZK Rehab Sphere with an ethical, evidence-based approach.",
    availability: "Mon - Sat (Home Visits by Slot)",
    location: "Chandigarh & Mohali",
    image: founderImg,
    certifications: ["Certified Neurological Rehab Specialist", "Advanced Manual Therapy", "Dry Needling & Hijama"],
    socialLinks: {
      linkedin: "https://www.linkedin.com/company/zk-rehab-sphere/",
      instagram: "https://www.instagram.com/zkrehabsphere",
      email: "zkrehabsphere@gmail.com"
    }
  },
  {
    id: "exp-2",
    name: "Dr. Numan Ahmed",
    role: "Senior Orthopedic Physiotherapist",
    qualification: "BPT, Certified Orthopedic Rehab Specialist",
    experienceYears: 6,
    rating: 4.8,
    reviewsCount: 98,
    specializations: ["Total Knee Replacement (TKR)", "Total Hip Replacement (THR)", "Sciatica & Slip Disc"],
    biography: "Dr. Numan Ahmed specializes in joint replacement rehab and spinal disorders. His customized home exercise protocols accelerate recovery and reduce pain.",
    availability: "Mon - Sat (9:00 AM - 6:00 PM)",
    location: "Mohali & Kharar",
    image: expertNumanImg || expert1Img,
    certifications: ["Orthopedic Manual Therapy", "Spine Rehabilitation Certificate"],
    socialLinks: {
      email: "zkrehabsphere@gmail.com"
    }
  },
  {
    id: "exp-3",
    name: "Dr. Mehul Verma",
    role: "Sports Rehabilitation & Musculoskeletal Expert",
    qualification: "BPT, MPT (Sports Medicine)",
    experienceYears: 5,
    rating: 4.9,
    reviewsCount: 115,
    specializations: ["Sports Injury Rehab", "ACL & PCL Ligament Care", "Frozen Shoulder", "Kinesiotherapy"],
    biography: "Dr. Mehul Verma works with athletes and active individuals to restore mobility, prevent re-injury, and enhance athletic posture and performance.",
    availability: "Mon - Fri (10:00 AM - 7:00 PM)",
    location: "Chandigarh & Kharar",
    image: expertMehulImg || expert2Img,
    certifications: ["Certified Sports Physical Therapist", "Taping & Soft Tissue Therapy"],
    socialLinks: {
      email: "zkrehabsphere@gmail.com"
    }
  },
  {
    id: "exp-4",
    name: "Dr. Mani Sharma",
    role: "Geriatric & Pediatric Rehab Specialist",
    qualification: "BPT, PG Diploma in Geriatric Care",
    experienceYears: 7,
    rating: 4.9,
    reviewsCount: 84,
    specializations: ["Geriatric Mobility", "Balance & Fall Prevention", "Osteoarthritis Care", "Bell's Palsy"],
    biography: "Dr. Mani Sharma is known for her patient, compassionate care with elderly patients suffering from mobility loss, balance disorders, and chronic arthritis.",
    availability: "Tue - Sun (8:00 AM - 5:00 PM)",
    location: "Chandigarh, Mohali, Kharar",
    image: expertManiImg || expert3Img,
    certifications: ["Geriatric Balance Masterclass", "Facial Nerve Rehabilitation"],
    socialLinks: {
      email: "zkrehabsphere@gmail.com"
    }
  }
];

export const initialServices: Service[] = [
  {
    id: "serv-1",
    title: "Home Visit Physiotherapy",
    shortDesc: "Comprehensive hospital-grade physical therapy delivered directly at your home across Chandigarh, Mohali, and Kharar.",
    description: "Our primary service brings certified physiotherapists equipped with portable electrotherapy, ultrasound, and mobility apparatus directly to your home. Designed to eliminate painful commute strain for bed-ridden, post-operative, or elderly patients.",
    iconName: "Activity",
    image: service1Img,
    category: "physiotherapy",
    features: [
      "Zero travel strain for pain or trauma-affected patients",
      "Dedicated 45-60 minute 1-on-1 personalized home sessions",
      "Portable TENS, ultrasound & muscle stimulator modalities",
      "Daily digital progress tracking and home exercise handbooks"
    ],
    gradient: "from-blue-600 via-indigo-600 to-cyan-500"
  },
  {
    id: "serv-2",
    title: "Neurological & Stroke Rehabilitation",
    shortDesc: "Specialized neuro-rehab for Stroke, Hemiplegia, Parkinson's, and Paralysis recovery.",
    description: "Neurological conditions demand systematic motor retraining, neuro-plasticity exercises, and balance modification. Lead by Sajid Khan (MPT Neurology), our protocols help rebuild functional independence.",
    iconName: "Brain",
    image: service2Img,
    category: "neurology",
    features: [
      "Bobath & PNF neuro-developmental techniques",
      "Gait modification & unassisted balance retraining",
      "Upper limb dexterity and daily functional restoration",
      "Caregiver training for safe transfers and positioning"
    ],
    gradient: "from-teal-500 via-emerald-600 to-cyan-600"
  },
  {
    id: "serv-3",
    title: "Orthopedic & Post-Surgical Rehab",
    shortDesc: "Targeted recovery for Total Knee Replacement (TKR), Hip Replacement (THR), and Fractures.",
    description: "Early post-operative physical therapy prevents joint contractures and muscle atrophy. We guide patients step-by-step from bed-side mobility to unassisted stair climbing.",
    iconName: "Bone",
    image: service3Img,
    category: "orthopedic",
    features: [
      "Post-TKR & THR joint mobility and quad strength activation",
      "Scar tissue mobilization & swelling reduction protocols",
      "Pain-free passive and active-assisted range expansion",
      "Unassisted walking & staircase navigation training"
    ],
    gradient: "from-blue-500 via-cyan-600 to-teal-500"
  },
  {
    id: "serv-4",
    title: "Cupping Therapy (Hijama)",
    shortDesc: "Authentic wet & dry cupping therapy for chronic muscular stiffness, inflammation, and detox.",
    description: "Specialized wet and dry cupping therapy administered by certified practitioners for rapid deep tissue pain relief, micro-circulation enhancement, and muscle spasm resolution.",
    iconName: "Sparkles",
    image: physioTreatmentImg,
    category: "wellness",
    features: [
      "Sterile single-use disposable cupping kits",
      "Targeted myofascial release for chronic back & shoulder tightness",
      "Blood circulation enhancement & tissue detoxification",
      "Certified hygienic execution in your home"
    ],
    gradient: "from-emerald-600 via-teal-600 to-cyan-600"
  },
  {
    id: "serv-5",
    title: "Sports Injury & ACL Rehabilitation",
    shortDesc: "Targeted recovery for ACL/PCL tears, ligament sprains, and athletic performance restoration.",
    description: "Evidence-based protocols tailored for athletes and active individuals recovering from ligament reconstruction or sports trauma to restore power, agility, and joint stability.",
    iconName: "Zap",
    image: physioGymImg,
    category: "orthopedic",
    features: [
      "Post-ACL reconstruction knee stability protocols",
      "Proprioception, agility & balance board training",
      "Kinesiology taping & soft tissue mobilization",
      "Return-to-sports functional testing"
    ],
    gradient: "from-cyan-500 via-sky-600 to-blue-600"
  },
  {
    id: "serv-6",
    title: "Frozen Shoulder (Adhesive Capsulitis)",
    shortDesc: "Joint capsule release and progressive shoulder elevation for pain-free arm movement.",
    description: "Restoring painful restricted shoulder mobility through gentle capsular stretching, joint mobilization, and rotator cuff strengthening exercises.",
    iconName: "Shield",
    image: receptionModernImg,
    category: "orthopedic",
    features: [
      "Passive & active shoulder capsule release",
      "Scapulohumeral rhythm correction",
      "Sleep position & ergonomic guidance",
      "Overhead reaching & daily functional recovery"
    ],
    gradient: "from-indigo-600 via-blue-600 to-cyan-500"
  },
  {
    id: "serv-7",
    title: "Sciatica & Lumbar Back Pain Care",
    shortDesc: "Spinal decompression and McKenzie disc centralization without invasive surgery.",
    description: "Non-surgical relief for sharp radiating leg pain, disc herniation (L4-L5/L5-S1), and lumbar spondylosis using mechanical traction principles.",
    iconName: "HeartPulse",
    image: zkReceptionImg,
    category: "orthopedic",
    features: [
      "McKenzie mechanical disc extension protocol",
      "Sciatic nerve gliding & flossing exercises",
      "Core stabilization & lumbar belt weaning",
      "Ergonomic posture setup consultation"
    ],
    gradient: "from-teal-600 via-cyan-600 to-sky-500"
  },
  {
    id: "serv-8",
    title: "Geriatric Care & Fall Prevention",
    shortDesc: "Compassionate mobility and balance enhancement for senior citizens.",
    description: "Dedicated home care program focused on improving leg strength, balance confidence, and home safety for elderly family members.",
    iconName: "UserCheck",
    image: founderImg,
    category: "physiotherapy",
    features: [
      "Senior balance & fall risk reduction assessment",
      "Gentle joint mobilization for osteoarthritis",
      "Walk-support transition to independent movement",
      "Home environmental hazard audit"
    ],
    gradient: "from-sky-500 via-teal-500 to-emerald-600"
  },
  {
    id: "serv-9",
    title: "Bell's Palsy & Facial Nerve Rehab",
    shortDesc: "Facial nerve stimulation, massage, and neuromuscular retraining for facial paralysis.",
    description: "Early intervention for facial weakness or asymmetry following Bell's Palsy using electric stimulation, facial muscle exercises, and taping.",
    iconName: "Smile",
    image: expert3Img,
    category: "neurology",
    features: [
      "Facial nerve electrical stimulation",
      "Expression muscle biofeedback retraining",
      "Eye closure protection & massage techniques",
      "Symmetrical smiling & speaking practice"
    ],
    gradient: "from-cyan-600 via-teal-500 to-emerald-500"
  },
  {
    id: "serv-10",
    title: "Clinical Mentorship & Student Learning",
    shortDesc: "Academic case studies, research handbooks, and practical mentorship for physio students.",
    description: "Bridging clinical practice and academic learning. ZK Rehab Sphere provides practical learning modules, clinical handbooks, and mentorship for emerging physical therapists.",
    iconName: "GraduationCap",
    image: service4Img,
    category: "education",
    features: [
      "Evidence-based clinical guidelines & research notes",
      "Neurological & orthopedic case breakdown",
      "Student mentorship & career development guidance",
      "Downloadable rehabilitation handbooks"
    ],
    gradient: "from-purple-600 via-indigo-600 to-blue-600"
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Essential Post-Stroke Rehabilitation Exercises for Early Home Recovery",
    slug: "post-stroke-rehabilitation-home-guide",
    summary: "Discover critical early-stage exercises and positioning guidelines that promote neuroplasticity and motor recovery following a stroke.",
    content: `
# Essential Post-Stroke Rehabilitation Exercises for Early Home Recovery

Recovering from a stroke is a journey that requires consistency, patience, and evidence-based physiological stimulation. Early rehabilitation within the first few months is crucial for harnessing **neuroplasticity**—the brain's remarkable ability to rewire itself.

## 1. Passive Range of Motion (PROM)
For paralyzed or severely weakened limbs, passive movement prevents joint stiffness and maintains tissue elasticity. Caregivers or therapists gently move the affected shoulder, elbow, wrist, and knee through their full anatomical arc.

## 2. Bridging & Core Stabilization
Lying flat on a firm mattress, flex both knees and press feet firmly down. Slowly lift hips upward towards the ceiling while engaging glutes and abdomen. Hold for 5 seconds and repeat 10 times.

## 3. Weight-Bearing & Sit-to-Stand Retraining
Weight bearing sends crucial proprioceptive feedback to the motor cortex. Practice controlled sit-to-stand transitions from a sturdy armless chair, ensuring equal weight distribution across both feet.

> **Clinical Note:** Always consult your attending physical therapist before initiating new resistance exercises.
    `,
    category: "Neurology",
    author: "Sajid Khan",
    authorRole: "Founder & Lead Physiotherapy Specialist",
    readTime: "6 min read",
    publishDate: "2026-07-28",
    coverImage: blogBgImg || service2Img,
    tags: ["Stroke", "Neurology", "Home Care", "Rehabilitation"],
    status: "published"
  },
  {
    id: "post-2",
    title: "Total Knee Replacement (TKR): Day 1 to Month 3 Milestone Blueprint",
    slug: "tkr-rehabilitation-timeline-guide",
    summary: "A step-by-step recovery guide for patients undergoing Total Knee Replacement, detailing swelling control, range of motion targets, and walking progression.",
    content: `
# Total Knee Replacement (TKR): Day 1 to Month 3 Milestone Blueprint

Successful knee replacement surgery relies heavily on post-operative physical therapy. Here is what to expect during your home rehabilitation timeline.

## Phase 1: Days 1 - 14 (Initial Healing & Motion)
* **Goal:** Achieve 90-degree knee flexion and full terminal knee extension (0 degrees).
* **Key Interventions:** Ankle pumps, straight leg raises, ice cryotherapy, and quad sets.
* **Mobility:** Walking short distances using a walker frame.

## Phase 2: Weeks 2 - 6 (Strength & Gait Refinement)
* **Goal:** Flexion > 110 degrees, transition to a single cane or unassisted walking.
* **Key Interventions:** Stationary bike cycling, step-ups, mini squats, and scar tissue mobilization.

## Phase 3: Months 2 - 3 (Functional Independence)
* **Goal:** Full fluid walking pattern, climbing stairs alternating feet, returning to light recreational activities.
    `,
    category: "Orthopedics",
    author: "Dr. Numan Ahmed",
    authorRole: "Senior Orthopedic Physiotherapist",
    readTime: "8 min read",
    publishDate: "2026-07-20",
    coverImage: service1Img,
    tags: ["TKR", "Knee Replacement", "Orthopedics", "Exercise"],
    status: "published"
  },
  {
    id: "post-3",
    title: "Managing Sciatica & Lumbar Disc Herniation Without Surgery",
    slug: "managing-sciatica-lumbar-disc-herniation",
    summary: "Learn how targeted mechanical diagnosis, nerve gliding exercises, and core decompression alleviate sharp radiating leg pain.",
    content: `
# Managing Sciatica & Lumbar Disc Herniation Without Surgery

Sciatica occurs when the sciatic nerve is compressed or inflamed, causing sharp, shooting pain down the buttock, thigh, and calf. Over 90% of non-emergency sciatica cases resolve with conservative physical therapy.

## Core Management Strategies
1. **McKenzie Extension Protocol:** Press-ups from prone position help centralize herniated disc material away from the nerve root.
2. **Sciatic Nerve Flossing:** Gentle rhythmic tensioning of the sciatic nerve frees adhesions along the nerve pathway.
3. **Ergonomic Decompression:** Avoiding prolonged slouching and incorporating lumbar support cushions during desk work.
    `,
    category: "Spine Care",
    author: "Dr. Mehul Verma",
    authorRole: "Musculoskeletal Specialist",
    readTime: "5 min read",
    publishDate: "2026-07-15",
    coverImage: physioGymImg,
    tags: ["Sciatica", "Spine", "Back Pain", "Manual Therapy"],
    status: "published"
  }
];

export const initialResources: ResourceItem[] = [
  {
    id: "res-1",
    title: "Home Physical Therapy Patient Handbook",
    subtitle: "Complete clinical guide to home-based exercise routines, ergonomic setups, and posture management.",
    type: "book",
    coverImage: bookCoverImg,
    readTimeOrPages: "48 Pages PDF",
    summary: "An essential handbook for home recovery covering knee rehab, lumbar support, stroke positioning, and daily mobility protocols.",
    author: "Sajid Khan",
    category: "Patient Guide"
  },
  {
    id: "res-2",
    title: "Post-Surgical Knee & Hip Exercise Checklist",
    subtitle: "Printable daily log and exercise checklist for joint replacement patients.",
    type: "checklist",
    coverImage: service3Img,
    readTimeOrPages: "4 Pages PDF",
    summary: "Track reps, ice applications, and knee angle flexion achievements day-by-day during your TKR or THR home rehabilitation.",
    author: "ZK Rehab Team",
    category: "Checklist"
  },
  {
    id: "res-3",
    title: "Neurological Rehabilitation Assessment Blueprint",
    subtitle: "Clinical framework for physiotherapy students analyzing upper and lower motor neuron disorders.",
    type: "guide",
    coverImage: service2Img,
    readTimeOrPages: "24 Pages PDF",
    summary: "Detailed clinical notes covering tone assessment, reflex scoring, Fugl-Meyer assessment scale, and neuro-plasticity exercises.",
    author: "Sajid Khan",
    category: "Academic Notes"
  }
];

export const bodyConditions: BodyPartCondition[] = [
  {
    id: "body-neck",
    partKey: "neck",
    partName: "Neck & Cervical Spine",
    commonSymptoms: ["Cervical Spondylosis", "Neck Stiffness & Spasms", "Radiating Arm Numbness", "Cervicogenic Headaches"],
    recommendedTreatments: ["Cervical Decompression", "Postural Realignment", "Isometric Neck Strengthening", "Trigger Point Therapy"],
    exercises: ["Chin Tucks", "Upper Trapezius Stretch", "Isometric Neck Press", "Scapular Retractions"],
    relatedExpertIds: ["exp-1", "exp-3"],
    relatedBlogSlugs: ["managing-sciatica-lumbar-disc-herniation"]
  },
  {
    id: "body-shoulder",
    partKey: "shoulder",
    partName: "Shoulder & Rotator Cuff",
    commonSymptoms: ["Frozen Shoulder (Adhesive Capsulitis)", "Rotator Cuff Tendonitis", "Shoulder Impingement", "Post-Dislocation Instability"],
    recommendedTreatments: ["Joint Capsule Mobilization", "Passive Range Elevation", "Rotator Cuff Resistance Band Training", "Cupping Therapy"],
    exercises: ["Pendulum Swings", "Wall Crawl Finger Exercises", "Cross-Body Shoulder Stretch", "External Rotation with Band"],
    relatedExpertIds: ["exp-3", "exp-2"],
    relatedBlogSlugs: ["post-stroke-rehabilitation-home-guide"]
  },
  {
    id: "body-back",
    partKey: "back",
    partName: "Lumbar Spine & Lower Back",
    commonSymptoms: ["Sciatica", "Slip Disc / Disc Herniation", "Lumbar Spondylosis", "Acute Muscle Spasm"],
    recommendedTreatments: ["McKenzie Disc Centralization", "Core Stability Retraining", "Manual Spinal Traction", "Sciatic Nerve Glide"],
    exercises: ["Prone Cobra Press-ups", "Bird-Dog Extensions", "Pelvic Tilts", "Sciatic Nerve Flossing"],
    relatedExpertIds: ["exp-2", "exp-1"],
    relatedBlogSlugs: ["managing-sciatica-lumbar-disc-herniation"]
  },
  {
    id: "body-hip",
    partKey: "hip",
    partName: "Hip Joint & Pelvis",
    commonSymptoms: ["Total Hip Replacement (THR)", "Hip Osteoarthritis", "Bursitis", "Piriformis Syndrome"],
    recommendedTreatments: ["Post-THR Gait Retraining", "Gluteus Medius Strengthening", "Piriformis Myofascial Release"],
    exercises: ["Clamshells", "Side-Lying Leg Abduction", "Glute Bridges", "Seated Piriformis Stretch"],
    relatedExpertIds: ["exp-2", "exp-4"],
    relatedBlogSlugs: ["tkr-rehabilitation-timeline-guide"]
  },
  {
    id: "body-knee",
    partKey: "knee",
    partName: "Knee Joint & Ligaments",
    commonSymptoms: ["Total Knee Replacement (TKR)", "ACL / PCL Ligament Tear", "Knee Osteoarthritis", "Meniscus Tears"],
    recommendedTreatments: ["Post-TKR Flexion & Extension Retraining", "VMO Quad Activation", "Balance & Proprioception Board Work"],
    exercises: ["Quad Sets & Ankle Pumps", "Terminal Knee Extension (TKE)", "Straight Leg Raises (SLR)", "Heel Slides"],
    relatedExpertIds: ["exp-2", "exp-3"],
    relatedBlogSlugs: ["tkr-rehabilitation-timeline-guide"]
  },
  {
    id: "body-ankle",
    partKey: "ankle",
    partName: "Ankle & Foot",
    commonSymptoms: ["Plantar Fasciitis", "Ankle Sprain & Ligament Laxity", "Achilles Tendonitis", "Drop Foot"],
    recommendedTreatments: ["Ankle Proprioceptive Training", "Plantar Fascia Release", "Gait Modification & Orthotics"],
    exercises: ["Towel Scrunching", "Calf Stretch on Step", "Single Leg Balance", "Ankle Alphabet Swirls"],
    relatedExpertIds: ["exp-3", "exp-4"],
    relatedBlogSlugs: ["post-stroke-rehabilitation-home-guide"]
  }
];

export const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    patientName: 'Gurpreet Singh & Family',
    patientPhone: '+91 98723****',
    patientEmail: 'gurpreet.mhl@gmail.com',
    city: 'Mohali',
    treatment: 'Stroke Rehab',
    condition: 'Post-Stroke Right Hemiparesis',
    rating: 5,
    message: 'Sajid Khan treated my father after a severe ischemic stroke. Within 6 weeks of structured home visit sessions, my father started walking with minimal assistance. Highly dedicated, punctual, and scientific team!',
    patientPhoto: physioTreatmentImg,
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    createdAt: '2026-07-15T10:30:00Z',
    doctorName: 'Sajid Khan (Founder)'
  },
  {
    id: 'rev-2',
    patientName: 'Dr. Ananya Sharma',
    patientPhone: '+91 98141****',
    patientEmail: 'ananya.sharma@chd.edu',
    city: 'Chandigarh',
    treatment: 'Orthopedic',
    condition: 'Total Knee Replacement (TKR)',
    rating: 5,
    message: 'After my TKR surgery, travelling to a hospital clinic was impossible due to severe post-op pain. ZK Rehab Sphere brought hospital-grade electrotherapy and motorized CPM right to my bedside in Sector 34. Swelling reduced dramatically in 3 days!',
    patientPhoto: receptionModernImg,
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    createdAt: '2026-07-20T14:15:00Z',
    doctorName: 'Dr. Numan Ahmed'
  },
  {
    id: 'rev-3',
    patientName: 'Ramesh Verma',
    patientPhone: '+91 98882****',
    patientEmail: 'rverma.khr@gmail.com',
    city: 'Kharar',
    treatment: 'Back Pain',
    condition: 'L4-L5 Sciatica & Disc Decompression',
    rating: 5,
    message: 'I was suffering from agonizing sciatica leg numbness for 4 months. Dr. Mehul’s mechanical disc traction and sciatic nerve flossing cured my leg pain without invasive surgery. Cannot recommend ZK Rehab Sphere enough!',
    patientPhoto: physioGymImg,
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    createdAt: '2026-07-22T09:45:00Z',
    doctorName: 'Dr. Mehul Verma'
  },
  {
    id: 'rev-4',
    patientName: 'Harjit Kaur',
    patientPhone: '+91 97791****',
    patientEmail: 'harjit.sec35@yahoo.com',
    city: 'Chandigarh',
    treatment: 'Orthopedic',
    condition: 'Adhesive Capsulitis (Frozen Shoulder)',
    rating: 5,
    message: 'My shoulder movement was almost zero. Dr. Manpreet performed gentle joint glides and hydrotherapy stretching at home. Within 4 weeks I regained 90% overhead shoulder reach!',
    status: 'approved',
    isVerified: true,
    isFeatured: true,
    createdAt: '2026-07-25T11:20:00Z',
    doctorName: 'Dr. Manpreet Kaur'
  },
  {
    id: 'rev-5',
    patientName: 'Vikramaditya Rana',
    patientPhone: '+91 98150****',
    patientEmail: 'v.rana@sportsindia.org',
    city: 'Mohali',
    treatment: 'Sports Injury',
    condition: 'ACL Reconstruction Rehabilitation',
    rating: 5,
    message: 'Top tier sports rehab at home! The bio-mechanical gait analysis and quad activation exercises helped me get back to running 12 weeks post ACL surgery. Very professional specialists.',
    status: 'approved',
    isVerified: true,
    isFeatured: false,
    createdAt: '2026-07-28T16:00:00Z',
    doctorName: 'Sajid Khan (Founder)'
  },
  {
    id: 'rev-6',
    patientName: 'Sunita Mehra',
    patientPhone: '+91 98765****',
    patientEmail: 'sunita.khr@gmail.com',
    city: 'Kharar',
    treatment: 'Hijama',
    condition: 'Chronic Myofascial Back Stiffness',
    rating: 5,
    message: 'Sterile, hygienic Wet Cupping (Hijama) session done at my residence. All equipment was single-use sealed, and my chronic back knot stiffness disappeared after 2 sessions.',
    status: 'approved',
    isVerified: true,
    isFeatured: false,
    createdAt: '2026-07-29T18:30:00Z',
    doctorName: 'Dr. Mehul Verma'
  }
];

