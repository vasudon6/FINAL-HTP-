import React, { Suspense, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../store/AdminContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

const AIChatbot = React.lazy(() => import('../components/AIChatbot'));

export default function ClinicDetails() {
  const { publicData } = useAdmin();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const heroImage = publicData.generalImages.find(img => img.id === 'hero-bg')?.url || "https://res.cloudinary.com/yfn8ptmo/image/upload/v1784274462/Gemini_Generated_Image_bokkn8bokkn8bokk_bqdmq8.png";
  
  const allClinicImages = publicData.generalImages.filter(
    img => img.key.toLowerCase().includes('clinic') || img.id.toLowerCase().includes('clinic')
  );
  
  const clinicImageUrl = allClinicImages.length > 0 
    ? allClinicImages[0].url 
    : "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200";

  const doctor = publicData.doctors[0] || {
    name: "Dr. Vasu Koshle",
    title: "Chief Hair Transplant Surgeon",
    qualification: "MBBS, MD, Diploma in Hair Transplant",
    experience: "15+ Years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    description: "Dr. Vasu is a renowned expert in hair restoration.",
    bullets: []
  };

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden flex flex-col pb-24 sm:pb-0">
      <Navbar />
      
      <main className="flex flex-col gap-12 px-4 py-8 sm:p-6 lg:p-12 max-w-[1440px] mx-auto w-full flex-grow">
        
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden shadow-lg w-full bg-slate-200">
          <img fetchPriority="high" decoding="async" src={heroImage} 
            alt="Vasu Hair Transplant Clinic Hero" 
            className="w-full h-auto min-h-[25vh] max-h-[60vh] object-cover"
          />
        </section>

        {/* Clinic Information */}
        <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm flex flex-col gap-12">
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="prose prose-slate max-w-none"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                About Vasu Hair Transplant Clinic
              </h2>
              <p className="text-lg leading-relaxed text-slate-700">
                Located in the heart of Raipur, Chhattisgarh, <strong>Vasu Hair Transplant Clinic</strong> is Central India's premier destination for permanent, natural-looking hair restoration. Established with a vision to provide world-class aesthetic treatments, our clinic integrates cutting-edge technology with artistic precision to deliver life-changing results.
              </p>
              <p className="text-lg leading-relaxed text-slate-700">
                We understand that hair loss is not just a physical change but an emotional journey that can significantly impact one's self-esteem and confidence. That is precisely why our approach is deeply rooted in empathy, transparency, and clinical excellence. We focus on delivering personalized, minimally invasive treatments specifically tailored to each patient's unique scalp condition and aesthetic goals.
              </p>
              
              <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Core Philosophy</h3>
              <p className="text-base leading-relaxed text-slate-700">
                At Vasu Clinic, we believe that a successful hair transplant goes beyond simply moving hair follicles; it is about recreating a completely natural hairline that complements your facial structure and ages gracefully with you. We utilize the principles of facial symmetry and artistic design combined with advanced surgical protocols to ensure that no one can tell you've had a hair transplant.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative w-full h-[300px] md:h-[450px]"
            >
              <img loading="lazy" decoding="async" src={clinicImageUrl} 
                alt="State-of-the-art Clinic Interior" 
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg border border-slate-100"
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-100"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-teal-700">State-of-the-Art Facilities</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our clinic is equipped with the latest medical technology and state-of-the-art operation theaters. We adhere strictly to international sterilization protocols to ensure 100% safety and zero risk of infection. The ambient, relaxing environment ensures a stress-free experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-teal-700">Advanced Techniques</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                We specialize in Advanced FUE (Follicular Unit Extraction) and DHI (Direct Hair Implantation). These minimally invasive techniques involve no stitches, no linear scars, and rapid recovery, ensuring maximum graft survival and unmatched density.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-teal-700">Comprehensive Care</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our journey with you doesn't end after the surgery. We provide extensive post-operative care, including regular follow-ups, PRP (Platelet-Rich Plasma) therapy sessions, and continuous guidance to ensure the best possible growth and long-term hair health.
              </p>
            </div>
          </motion.div>

        </section>

        {/* Doctor Information */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 border border-slate-800 shadow-xl grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-teal-900/20 relative group">
              <img loading="lazy" decoding="async" src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-block px-4 py-1 bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300 font-bold text-sm rounded-full mb-3">
                  {doctor.experience} Experience
                </div>
                <h3 className="text-3xl font-bold">{doctor.name}</h3>
                <p className="text-slate-300">{doctor.qualification}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 prose prose-lg prose-invert"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
              Meet Our Chief Surgeon
            </h2>
            <h3 className="text-2xl font-semibold text-teal-400 mb-6">{doctor.title}</h3>
            
            <p className="text-slate-300 leading-relaxed">
              {doctor.description}
            </p>
            
            <p className="text-slate-300 leading-relaxed mt-4">
              With over a decade of dedicated experience in surgical hair restoration, Dr. Koshle has transformed the lives of thousands of patients. His expertise lies in Advanced FUE (Follicular Unit Extraction) and DHI (Direct Hair Implantation) techniques, emphasizing not just density, but the aesthetic artistry of a natural hairline.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {doctor.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 text-teal-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-200">{bullet.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

      </main>
      
      <Footer />
      <MobileNav />
      <Suspense fallback={null}>
        <AIChatbot />
      </Suspense>
    </div>
  );
}
