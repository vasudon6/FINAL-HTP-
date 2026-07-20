import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Star, ShieldCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAdmin, Doctor as DoctorType } from '../store/AdminContext';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Award': return Award;
    case 'ShieldCheck': return ShieldCheck;
    case 'Star': return Star;
    default: return Award;
  }
};

const DoctorCard: React.FC<{ doctor: DoctorType, onKnowMore: (d: DoctorType) => void, image: string }> = ({ doctor, onKnowMore, image }) => {
  return (
    <div className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden w-[80vw] sm:w-[320px] md:w-[400px] shrink-0 snap-center group">
      <div className="relative aspect-[4/5] md:aspect-auto md:h-64 overflow-hidden bg-slate-200 flex items-center justify-center">
        <img src={image} loading="lazy" decoding="async" alt={doctor.name} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
           />
        <div className="absolute bottom-4 right-4 bg-teal-600 text-white px-3 py-2 rounded-xl shadow-lg border-2 border-white flex flex-col items-center">
          <span className="text-xl font-black leading-none">{doctor.experience}</span>
          <span className="text-[8px] font-bold uppercase tracking-wider">Years</span>
        </div>
      </div>
      
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">{doctor.title}</h3>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mb-2 leading-tight">{doctor.name}</h2>
        <div className="inline-flex self-start text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded mb-4 border border-teal-100">{doctor.qualification}</div>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {doctor.description}
        </p>

        <div className="mt-auto pt-4">
          <button 
            onClick={() => onKnowMore(doctor)}
            className="text-teal-600 text-xs font-bold uppercase tracking-wider self-start hover:text-teal-700"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Doctor() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { publicData } = useAdmin();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);

  useEffect(() => {
    if (selectedDoctor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDoctor]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const getDoctorImage = (id: string) => {
    return publicData.generalImages.find(img => img.id === id)?.url || '';
  };

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Our Experts</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Meet Our Specialist Team</h2>
          <p className="text-slate-500 max-w-2xl text-lg">Central India's most experienced hair transplant surgeons dedicated to your care.</p>
        </motion.div>

        <div className="relative w-full group/slider">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 lg:-ml-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors md:opacity-0 md:group-hover/slider:opacity-100"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {publicData.doctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                image={doctor.image}
                onKnowMore={setSelectedDoctor} 
              />
            ))}
          </div>

          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 lg:-mr-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors md:opacity-0 md:group-hover/slider:opacity-100"
          >
            <ChevronRight size={24} className="text-slate-700" />
          </button>
        </div>
      </div>

      {/* Modal for all screens */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-[200] flex items-end sm:items-center justify-center p-3 pb-[100px] sm:p-4"
            onClick={() => setSelectedDoctor(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:w-[500px] max-h-[calc(100vh-120px)] sm:max-h-[85vh] rounded-2xl shadow-xl overflow-hidden flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-slate-200">
                <button 
                  onClick={() => setSelectedDoctor(null)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors bg-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 min-h-0">
                <div className="h-64 relative shrink-0 bg-slate-200 flex items-center justify-center">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-contain"  loading="lazy" decoding="async" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">{selectedDoctor.title}</h3>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">{selectedDoctor.name}</h2>
                  <div className="inline-flex text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded mb-4 border border-teal-100">{selectedDoctor.qualification}</div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    {selectedDoctor.description}
                  </p>
                  <div className="space-y-3">
                    {selectedDoctor.bullets.map((item, i) => {
                      const IconComp = getIcon(item.icon);
                      return (
                        <motion.div 
                          key={i} 
                          className="flex items-start gap-3 text-slate-700 group/item cursor-pointer"
                          initial="rest"
                          whileHover="hover"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 border border-teal-100 mt-0.5 group-hover/item:bg-teal-500 transition-colors">
                            <motion.div
                              variants={{
                                rest: { scale: 1 },
                                hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
                              }}
                            >
                              <IconComp size={14} className="text-teal-600 group-hover/item:text-white transition-colors" />
                            </motion.div>
                          </div>
                          <span className="font-bold text-xs text-slate-800">{item.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

