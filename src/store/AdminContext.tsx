import React, { createContext, useContext, useState, useEffect } from 'react';
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
  clinicContext: `आप Vasu Hair Transplant Clinic के एक बेहद स्मार्ट, मददगार और कंविनसिंग (convincing) AI असिस्टेंट हैं।

आपका मुख्य काम है:
1. ग्राहक के सवालों का सटीक और स्मार्ट तरीके से जवाब देना।
2. ग्राहकों को क्लिनिक की खूबियां बताना और उन्हें क्लिनिक विजिट करने या अपॉइंटमेंट बुक करने के लिए प्रेरित करना (लेकिन बहुत नेचुरल तरीके से, cheap या pushy नहीं लगना चाहिए)।

क्लिनिक की जानकारी (Context):
- हमारी सर्विसेज: Hair Transplant (FUE, DHI), PRP Therapy, Beard Transplant, Eyebrow Transplant, Hair Loss Treatments, और Mesotherapy।
- अपॉइंटमेंट के तरीके: In-Clinic और Video consultations।
- हमारी खूबियां: विशेषज्ञ डॉक्टर्स (Chief Surgeon: Dr. Vasu Koshle), हाई क्वालिटी रिज़ल्ट्स, और खुश ग्राहकों के रिव्यू।
- क्लिनिक रायपुर में 5000+ खुश ग्राहकों के साथ No.1 क्लिनिक है।

जवाब देने के नियम (SYSTEM INSTRUCTIONS):
- LANGUAGE MATCHING: ग्राहक जिस भाषा में सवाल पूछे, उसी भाषा में जवाब दें। अगर ग्राहक हिंदी में पूछे तो हिंदी में, English में पूछे तो English में, और सबसे महत्वपूर्ण: अगर ग्राहक Hinglish (जैसे "Mera hair fall ho raha hai kya karu") में पूछे, तो आप भी Hinglish में ही जवाब दें! Hinglish को लेकर confuse मत होना, Hinglish बहुत common है।
- SHORT & SMART ANSWERS: जवाब बहुत ही संक्षिप्त (short) और स्मार्ट होना चाहिए। जो पूछा जाए सिर्फ उसका सटीक जवाब दें, लंबी-चौड़ी बातें न लिखें।
- CONVINCING: स्मार्ट तरीके से उन्हें क्लिनिक विज़िट करने या कंसल्टेशन बुक करने के लिए कनविंस करें।
- PACING: एक ही मैसेज में सारी जानकारी मत थोपें। बातचीत को नेचुरल रखें।
- CLOSING: अपने जवाब के अंत में हमेशा मरीज से पूछें कि क्या उन्हें कोई और कन्फ्यूजन या सवाल है? और उन्हें बताएं कि अगर वे तैयार हैं तो आप उनके लिए अपॉइंटमेंट बुक कर सकते हैं (जैसे: "क्या आपको कोई और कन्फ्यूजन है? अगर आप चाहें तो मैं अभी आपका अपॉइंटमेंट बुक कर सकता हूँ। बस बता दें।")
- अगर कोई सवाल क्लिनिक या हेयर ट्रांसप्लांट से संबंधित नहीं है, तो विनम्रता से मना कर दें।
- जो भी डायनेमिक कंटेंट (websiteContext) आपको मिले, उसका इस्तेमाल सवालों के जवाब देने के लिए करें।`,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('vasu_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  

  const [queries, setQueries] = useState<Query[]>(() => {
    const saved = localStorage.getItem('vasu_queries');
    return saved ? JSON.parse(saved) : [];
  });

  const [publicData, setPublicData] = useState<AppData>(() => {
    const saved = localStorage.getItem('vasu_public_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Ensure backward compatibility with newer fields
      const mergedGeneralImages = [...(parsed.generalImages || [])];
      
      // Add missing default images
      DEFAULT_GENERAL_IMAGES.forEach(defaultImg => {
        const existing = mergedGeneralImages.find(img => img.id === defaultImg.id);
        if (!existing) {
          mergedGeneralImages.push(defaultImg);
        } else if ((existing.id === 'hero-bg' || existing.id === 'clinic-2') && existing.url.includes('unsplash.com')) {
          existing.url = defaultImg.url;
        }
      });
      
      let mergedTransformations = parsed.transformations || [];
      const hasUnsplash = mergedTransformations.some(t => t.before.includes('unsplash.com') || t.after.includes('unsplash.com'));
      if (hasUnsplash || mergedTransformations.length === 0) {
        mergedTransformations = DEFAULT_TRANSFORMATIONS;
      }
      
      let mergedDoctors = parsed.doctors || DEFAULT_DATA.doctors;
      mergedDoctors = mergedDoctors.map((doc: any) => {
        if (doc.id === '1' && doc.name === 'Dr. Siddharth Sharma') {
          doc.name = 'Dr. Vasu Koshle';
          doc.description = doc.description.replace(/Dr\. Sharma/g, 'Dr. Koshle');
        }
        if (['1', '2', '5'].includes(doc.id) && doc.image.includes('unsplash.com')) {
          const def = DEFAULT_DOCTORS.find(d => d.id === doc.id);
          if (def) doc.image = def.image;
        }
        return doc;
      });

      let mergedServices = parsed.services || [];
      if (mergedServices.length === 0) {
        mergedServices = DEFAULT_SERVICES;
      } else {
        mergedServices = mergedServices.map(s => {
          if (['1', '2', '3', '4'].includes(s.id) && s.image.includes('unsplash.com')) {
            const def = DEFAULT_SERVICES.find(ds => ds.id === s.id);
            if (def) s.image = def.image;
          }
          return s;
        });
        
        // Add new services if they don't exist
        ['7', '8'].forEach(id => {
          if (!mergedServices.find(s => s.id === id)) {
            const def = DEFAULT_SERVICES.find(ds => ds.id === id);
            if (def) mergedServices.push(def);
          }
        });
      }

      let mergedReviews = parsed.reviews || [];
      if (mergedReviews.length === 0) {
        mergedReviews = DEFAULT_REVIEWS;
      } else {
        mergedReviews = mergedReviews.map(r => {
          if (!r.videoUrl) {
            const def = DEFAULT_REVIEWS.find(dr => dr.id === r.id);
            if (def) r.videoUrl = def.videoUrl;
          }
          return r;
        });
      }

      let mergedClinicContext = parsed.clinicContext;
      if (!mergedClinicContext || !mergedClinicContext.includes("Vasu Hair Transplant Clinic के एक बेहद स्मार्ट")) {
        mergedClinicContext = DEFAULT_DATA.clinicContext;
      }
      return {
        ...DEFAULT_DATA,
        ...parsed,
        generalImages: mergedGeneralImages,
        doctors: mergedDoctors,
        transformations: mergedTransformations,
        services: mergedServices,
        reviews: mergedReviews,
        clinicContext: mergedClinicContext
      };
    }
    return DEFAULT_DATA;
  });

  const [draftData, setDraftData] = useState<AppData>(publicData);

  useEffect(() => {
    localStorage.setItem('vasu_bookings', JSON.stringify(bookings));
  }, [bookings]);


  useEffect(() => {
    localStorage.setItem('vasu_queries', JSON.stringify(queries));
  }, [queries]);

  useEffect(() => {
    localStorage.setItem('vasu_public_data', JSON.stringify(publicData));
  }, [publicData]);

  const addBooking = (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...b,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const addQuery = (q: Omit<Query, 'id' | 'createdAt'>) => {
    const newQuery: Query = {
      ...q,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setQueries(prev => [newQuery, ...prev]);
  };

  const deleteQuery = (id: string) => {
    setQueries(prev => prev.filter(q => q.id !== id));
  };

  const publishChanges = () => {
    setPublicData(draftData);
    toast.success('Changes published successfully to the public site!');
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
