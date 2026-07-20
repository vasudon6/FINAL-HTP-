import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAdmin, Service } from '../store/AdminContext';

const ServiceCard: React.FC<{ service: Service; onClick: () => void }> = ({ service, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.2)" }}
      className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden w-[85vw] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] shrink-0 snap-center group/card cursor-pointer transition-colors hover:border-teal-200"
      onClick={onClick}
    >
      <div className="h-40 w-full overflow-hidden shrink-0 relative">
        <img src={service.image} loading="lazy" decoding="async" alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
          loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 flex flex-col flex-1 relative bg-white">
        <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-teal-500/0 via-teal-500/30 to-teal-500/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 transform -translate-y-px"></div>
        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover/card:text-teal-700 transition-colors">{service.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 transition-all duration-300 leading-relaxed">
          {service.description}
        </p>
        <div className="mt-4 flex items-center text-teal-600 text-xs font-bold uppercase tracking-wider group/btn">
          <span>Read More</span>
          <ChevronRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Services() {
  const { publicData } = useAdmin();
  const services = publicData.services || [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  if (services.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 relative">
        <div className="flex justify-between items-end mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Treatments</h3>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Our Services</h2>
          </motion.div>
        </div>

        <div className="relative mb-10 w-full group/slider">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 lg:-ml-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors md:opacity-0 md:group-hover/slider:opacity-100"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => setSelectedService(service)} 
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

      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-[200] flex items-end sm:items-center justify-center p-3 pb-[100px] sm:p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:w-[600px] max-h-[calc(100vh-120px)] sm:max-h-[85vh] rounded-2xl shadow-xl overflow-hidden flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-slate-200">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors bg-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 min-h-0">
                <div className="h-48 sm:h-64 relative shrink-0">
                  <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover"  loading="lazy" decoding="async" />
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{selectedService.title}</h2>
                  <div className="prose prose-slate prose-sm sm:prose-base">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedService.description}
                    </p>
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
