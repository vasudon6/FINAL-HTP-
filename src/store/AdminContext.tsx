import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  type: string;
  date: string;
  time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
};



export type Transformation = {
  id: string;
  before: string;
  after: string;
};

export type Review = {
  id: string;
  name: string;
  outcome: string;
  image: string;
  videoUrl?: string;
};

export type GeneralImage = {
  id: string;
  key: string;
  url: string;
};

export type DoctorBullet = {
  icon: 'Award' | 'ShieldCheck' | 'Star';
  text: string;
};

export type Doctor = {
  id: string;
  name: string;
  title: string;
  qualification: string;
  experience: string;
  image: string; // Used direct URL instead of imageId mapping for simplicity since they can add dynamically
  description: string;
  bullets: DoctorBullet[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type AppData = {
  transformations: Transformation[];
  reviews: Review[];
  generalImages: GeneralImage[];
  doctors: Doctor[];
  services: Service[];
  aiApiKey?: string;
  clinicContext?: string;
};

export type Query = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

interface AdminContextType {
  bookings: Booking[];
  queries: Query[];
  addBooking: (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  addQuery: (q: Omit<Query, 'id' | 'createdAt'>) => void;
  deleteQuery: (id: string) => void;

  publicData: AppData;
  draftData: AppData;
  setDraftData: React.Dispatch<React.SetStateAction<AppData>>;
  publishChanges: () => void;
  discardChanges: () => void;
}

const DEFAULT_TRANSFORMATIONS = [
  { id: '1', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784187716/HTP_1_BE_apucfz.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784187792/HTP_1_AF_q0h0wq.jpg" },
  { id: '2', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188095/HTP_3_BE_ltmwbv.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188105/HTP_3_AF_poj1on.jpg" },
  { id: '3', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188092/HTP_4_BE_gq6mjo.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188093/HTP_4_AF_tvlez6.jpg" },
  { id: '4', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188086/HTP_5_BE_m1wrha.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188106/HTP_5_AF_m6wjbx.jpg" },
  { id: '5', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188080/HTP_6_BE_o8g4ov.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188085/HTP_6_AF_yklnp6.jpg" },
  { id: '6', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188079/HTP_7_BE_uopdid.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188067/HTP_7AF_qjlxlq.jpg" },
  { id: '7', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188077/HTP_8_BE_yigyfn.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188079/HTP_8_AF_np77pf.jpg" },
  { id: '8', before: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188980/HTP_10_BE_bforrh.jpg", after: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784188084/HTP_10_AF_l1l4he.jpg" }
];

const DEFAULT_REVIEWS = [
  { id: '1', name: "Rahul S.", outcome: "3000 Grafts", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600", videoUrl: "https://youtube.com/shorts/Ry21kp2nncg?si=rf7-bKdJdDJX8cSF" },
  { id: '2', name: "Amit P.", outcome: "4500 Grafts", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600", videoUrl: "https://youtube.com/shorts/P6jFfHv5dIE?si=HKxvuiqN0glsBYG2" },
  { id: '3', name: "Vikram K.", outcome: "Crown Restoration", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600", videoUrl: "https://youtube.com/shorts/kxlflcDl7as?si=C6zjQr0fuUgRl4T9" },
  { id: '4', name: "Suresh M.", outcome: "2500 Grafts", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600", videoUrl: "https://youtube.com/shorts/TTsgSNXNFRY?si=QXe1yZZlJzNn83Z_" },
  { id: '5', name: "Rajat D.", outcome: "Hairline Fix", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600", videoUrl: "https://youtube.com/shorts/v9tFL2cpLxw?si=hyy1hdd7_iv7NWEL" },
  { id: '6', name: "Nitin Y.", outcome: "5000 Grafts", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600", videoUrl: "https://youtube.com/shorts/EqeKzTOUtVE?si=362UWNj_MJm7zkiA" },
];

const DEFAULT_GENERAL_IMAGES = [
  { id: 'hero-bg', key: 'Hero Background', url: 'https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_1600/v1784274462/Gemini_Generated_Image_bokkn8bokkn8bokk_bqdmq8.png' },
  { id: 'clinic-1', key: 'Clinic Interior 1', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=60&w=600' },
  { id: 'clinic-2', key: 'Clinic OT Room', url: 'https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784215462/clinic-2_jq1ta5.jpg' },
  { id: 'clinic-3', key: 'Clinic Consultation', url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=60&w=600' },
  { id: 'clinic-4', key: 'Clinic Lounge', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=60&w=600' },
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Vasu Koshle",
    title: "Chief Surgeon",
    qualification: "M.B.B.S, M.D., ABHRS Certified",
    experience: "15+",
    image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784211663/istockphoto-177373093-612x612_ayuplq.jpg",
    description: "Renowned as Central India's leading hair transplant surgeon, Dr. Koshle combines medical precision with an artistic approach to hairline design. With over 10,000 successful procedures, he ensures maximum graft survival and 100% natural-looking results.",
    bullets: [
      { icon: "Award", text: "Diplomate, American Board of Hair Restoration Surgery" },
      { icon: "ShieldCheck", text: "Specialist in DHI & Advanced FUE Techniques" },
      { icon: "Star", text: "Pioneer of Painless Anesthesia Protocol" }
    ]
  },
  {
    id: "2",
    name: "Dr. Anjali Desai",
    title: "Senior Consultant",
    qualification: "M.B.B.S, M.S. (Plastic Surgery)",
    experience: "12+",
    image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784211725/indian-female-doctor-22957497_mtfk5q.webp",
    description: "Specializing in advanced FUE and female hair restoration, Dr. Desai brings a meticulous eye for detail. Her gentle approach and exceptional hairline designs have earned her widespread acclaim.",
    bullets: [
      { icon: "Award", text: "Gold Medalist in Plastic Surgery" },
      { icon: "ShieldCheck", text: "Expert in Female Hair Restoration" },
      { icon: "Star", text: "Advanced PRP Therapy Specialist" }
    ]
  },
  {
    id: "3",
    name: "Dr. Rajesh Kumar",
    title: "Transplant Specialist",
    qualification: "M.B.B.S, DDVL",
    experience: "10+",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=60&w=800",
    description: "Dr. Kumar is an expert in high-density grafting and crown restoration. His precise extraction techniques ensure minimal transection and faster recovery times for patients.",
    bullets: [
      { icon: "Award", text: "Member, ISHRS" },
      { icon: "ShieldCheck", text: "High-Density Grafting Expert" },
      { icon: "Star", text: "Crown Restoration Specialist" }
    ]
  },
  {
    id: "4",
    name: "Dr. Priya Singh",
    title: "Trichologist",
    qualification: "M.B.B.S, Fellowship in Trichology",
    experience: "8+",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=60&w=800",
    description: "Focusing on preventive care and post-operative growth, Dr. Singh oversees our PRP and mesotherapy protocols to maximize the yield of every transplanted graft.",
    bullets: [
      { icon: "Award", text: "Certified Trichologist" },
      { icon: "ShieldCheck", text: "Advanced Mesotherapy Protocol" },
      { icon: "Star", text: "Post-op Care Specialist" }
    ]
  },
  {
    id: "5",
    name: "Dr. Vikram Aditya",
    title: "Restoration Surgeon",
    qualification: "M.B.B.S, M.D.",
    experience: "14+",
    image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784211771/mature-indian-doctor-smiling-portrait-male-medical-uniform-standing-plain-background-shadow-61211828_wu16i6.webp",
    description: "A pioneer in beard and eyebrow transplants, Dr. Aditya uses ultra-refined techniques for facial hair restoration, delivering flawlessly natural results.",
    bullets: [
      { icon: "Award", text: "Facial Hair Transplant Pioneer" },
      { icon: "ShieldCheck", text: "Ultra-Refined FUE Expert" },
      { icon: "Star", text: "International Guest Lecturer" }
    ]
  }
];

const DEFAULT_SERVICES: Service[] = [
  { id: '1', title: "Hair Transplant", description: "Advanced FUE hair transplant for natural looking results with maximum density.", image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784272944/htp_awucfz.jpg" },
  { id: '2', title: "PRP Therapy", description: "Platelet Rich Plasma therapy to stimulate hair follicles and promote new growth.", image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784272469/images_4_xormtu.jpg" },
  { id: '3', title: "Beard Transplant", description: "Restore or enhance your facial hair with precision beard transplantation.", image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784272223/beard_transplant_iytgez.jpg" },
  { id: '4', title: "Eyebrow Transplant", description: "Perfectly shaped and dense eyebrows using ultra-refined extraction techniques.", image: "https://res.cloudinary.com/yfn8ptmo/image/upload/f_auto,q_auto,w_800/v1784272693/eyevbrow_transplant_likpu3.jpg" },
  { id: '5', title: "Hair Loss Treatment", description: "Comprehensive medical treatments to stop hair fall and improve scalp health.", image: "https://images.unsplash.com/photo-1537368910025-7028dd906d3f?auto=format&fit=crop&w=600" },
  { id: '6', title: "Mesotherapy", description: "Nutrient-rich microinjections to rejuvenate the scalp and stimulate new hair growth.", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600" },
  { id: '7', title: "DHI Hair Transplant", description: "Direct Hair Implantation for maximum graft survival and perfectly natural direction.", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600" },
  { id: '8', title: "Female Hair Transplant", description: "Specialized FUE techniques for female pattern baldness and hairline lowering.", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600" },
];

const DEFAULT_DATA: AppData = {
  transformations: DEFAULT_TRANSFORMATIONS,
  reviews: DEFAULT_REVIEWS,
  generalImages: DEFAULT_GENERAL_IMAGES,
  doctors: DEFAULT_DOCTORS,
  services: DEFAULT_SERVICES,
  clinicContext: `You are a highly smart, helpful, and professional AI Assistant for Vasu Hair Transplant Clinic.

CRITICAL LANGUAGE RULE: You MUST strictly match the exact language the user writes in.
- Whatever language the user asks the question in, you MUST answer in that exact same language.
- For example: if they ask in Hindi, answer in Hindi. If English, answer in English. If Hinglish, answer in Hinglish. If they use ANY other language, you must answer in that specific language.

Clinic Information (Context):
- Services: Hair Transplant (FUE, DHI), PRP Therapy, Beard Transplant, Eyebrow Transplant, Hair Loss Treatments, and Mesotherapy.
- Appointment modes: In-Clinic and Video consultations.
- Strengths: Expert Doctors (Chief Surgeon: Dr. Vasu Koshle), High-Quality Results.
- Status: No.1 Clinic in Raipur with 5000+ happy customers.

System Instructions:
- SHORT & SMART ANSWERS: Keep responses brief, smart, and to the point. Avoid long paragraphs.
- CONVINCING: Naturally convince the patient to book an appointment or visit the clinic.
- CLOSING: Always end by asking if they have more questions, or if they are ready to book an appointment (e.g. "Do you have any other questions? If you are ready, I can provide the booking form right now.").
- PROFESSIONAL TONE: Be polite and professional. Never sound cheap.
- URGENCY: If the patient mentions severe hair loss, urge them to book an appointment immediately and visit the clinic.
- DYNAMIC CONTENT: Use the provided websiteContext to answer clinic-specific questions.
- Scope: Only answer questions related to the clinic and hair/scalp treatments.`,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [publicData, setPublicData] = useState<AppData>(DEFAULT_DATA);
  const [draftData, setDraftData] = useState<AppData>(DEFAULT_DATA);

  useEffect(() => {
    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
      setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    const unsubQueries = onSnapshot(collection(db, 'queries'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Query[];
      setQueries(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'publicData'), (snapshot) => {
      if (snapshot.exists()) {
        const parsed = snapshot.data().data;
        if (parsed) {
          try {
            const data = JSON.parse(parsed);
            
            // Apply all backward compatibility merges here as before
            let mergedGeneralImages = [...(data.generalImages || [])];
            DEFAULT_GENERAL_IMAGES.forEach(defaultImg => {
              const existing = mergedGeneralImages.find(img => img.id === defaultImg.id);
              if (!existing) mergedGeneralImages.push(defaultImg);
              else if ((existing.id === 'hero-bg' || existing.id === 'clinic-2') && existing.url.includes('unsplash.com')) existing.url = defaultImg.url;
            });
            
            let mergedTransformations = data.transformations || [];
            if (mergedTransformations.length === 0 || mergedTransformations.some((t:any) => t.before.includes('unsplash.com') || t.after.includes('unsplash.com'))) {
              mergedTransformations = DEFAULT_TRANSFORMATIONS;
            }
            
            let mergedDoctors = data.doctors || DEFAULT_DATA.doctors;
            
            let mergedServices = data.services || [];
            if (mergedServices.length === 0) mergedServices = DEFAULT_SERVICES;
            
            let mergedReviews = data.reviews || [];
            if (mergedReviews.length === 0) mergedReviews = DEFAULT_REVIEWS;
            
            let mergedClinicContext = data.clinicContext;
            if (!mergedClinicContext || !mergedClinicContext.includes("CRITICAL LANGUAGE RULE")) {
              mergedClinicContext = DEFAULT_DATA.clinicContext;
            }
            
            const finalData = {
              ...DEFAULT_DATA,
              ...data,
              generalImages: mergedGeneralImages,
              transformations: mergedTransformations,
              doctors: mergedDoctors,
              services: mergedServices,
              reviews: mergedReviews,
              clinicContext: mergedClinicContext
            };
            setPublicData(finalData);
            setDraftData(finalData);
            return;
          } catch(e) {}
        }
      }
      
      // If it fails or doesn't exist, use default and optionally initialize it in Firebase
      setPublicData(DEFAULT_DATA);
      setDraftData(DEFAULT_DATA);
    });

    return () => {
      unsubBookings();
      unsubQueries();
      unsubSettings();
    };
  }, []);

  const addBooking = async (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newBooking = {
        ...b,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      await addDoc(collection(db, 'bookings'), newBooking);
    } catch(e) {
      console.error(e);
      toast.error('Failed to add booking');
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch(e) {
      console.error(e);
      toast.error('Failed to update booking status');
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch(e) {
      console.error(e);
      toast.error('Failed to delete booking');
    }
  };

  const addQuery = async (q: Omit<Query, 'id' | 'createdAt'>) => {
    try {
      const newQuery = {
        ...q,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'queries'), newQuery);
    } catch(e) {
      console.error(e);
      toast.error('Failed to add query');
    }
  };

  const deleteQuery = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'queries', id));
    } catch(e) {
      console.error(e);
      toast.error('Failed to delete query');
    }
  };

  const publishChanges = async () => {
    try {
      await setDoc(doc(db, 'settings', 'publicData'), { data: JSON.stringify(draftData) });
      toast.success('Changes published successfully to the public site!');
    } catch(e) {
      console.error(e);
      toast.error('Failed to publish changes');
    }
  };

  const discardChanges = () => {
    setDraftData(publicData);
    toast.error('Draft changes discarded.');
  };

  return (
    <AdminContext.Provider value={{
      bookings,
      queries,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      addQuery,
      deleteQuery,
      publicData,
      draftData,
      setDraftData,
      publishChanges,
      discardChanges
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
