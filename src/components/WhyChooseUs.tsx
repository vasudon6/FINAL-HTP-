import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Activity, Shield, Sparkles, Clock, HeartHandshake, X } from 'lucide-react';

const USPS = [
  { icon: Activity, title: "Painless Procedure", desc: "Advanced local anesthesia protocols ensuring a completely comfortable experience.", fullDesc: "Our advanced local anesthesia protocols ensure a completely comfortable experience. We utilize specially formulated anesthetic mixtures and vibratory devices to minimize discomfort during the initial numbing phase. Throughout the entire procedure, patients report feeling relaxed and pain-free, often watching movies or listening to music while we work." },
  { icon: Microscope, title: "Latest Technology", desc: "Utilizing sapphire blades and high-mag microscopes for pristine graft handling.", fullDesc: "Utilizing sapphire blades and high-mag microscopes for pristine graft handling. Sapphire blades create smaller, more precise incisions compared to traditional steel, leading to faster healing and less scarring. Our high-magnification microscopes ensure every single graft is inspected and handled with the utmost care to maximize survival rates." },
  { icon: Sparkles, title: "100% Natural Look", desc: "Artistic hairline design matched precisely to your facial proportions and age.", fullDesc: "Artistic hairline design matched precisely to your facial proportions and age. We do not use a 'one-size-fits-all' approach. Your surgeon will meticulously design a hairline that complements your bone structure, muscle tone, and future aging pattern, using single-hair grafts at the very front for an undetectable, natural transition." },
  { icon: Shield, title: "Guaranteed Results", desc: "Written guarantee of graft survival with lifetime post-operative support.", fullDesc: "Written guarantee of graft survival with lifetime post-operative support. We stand behind our work. Our meticulous techniques ensure exceptional graft survival. Should the results fall short of our rigorous standards due to surgical factors, we provide corrective procedures. You also receive ongoing, lifetime support to help maintain your results." },
  { icon: HeartHandshake, title: "Dedicated Care", desc: "One-on-one attention from the chief surgeon from consultation to recovery.", fullDesc: "One-on-one attention from the chief surgeon from consultation to recovery. Unlike clinics that rely heavily on technicians, our chief surgeon is intimately involved in every critical step of your procedure, from the initial hairline design and extractions to the final graft placement, ensuring the highest medical standards." },
  { icon: Clock, title: "Fast Recovery", desc: "Minimally invasive techniques allowing you to return to work in 3-5 days.", fullDesc: "Minimally invasive techniques allowing you to return to work in 3-5 days. Our advanced FUE extraction and refined implantation methods cause minimal trauma to the scalp. This translates to significantly reduced swelling and redness, allowing most of our patients to resume their normal daily activities and work within just a few days." },
];

export default function WhyChooseUs() {
  const [selectedUsp, setSelectedUsp] = useState<typeof USPS[0] | null>(null);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (selectedUsp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedUsp]);

  return (
    <section className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Why Choose Us</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Excellence in Hair Restoration</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">We set the benchmark for clinical excellence and patient satisfaction.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {USPS.map((usp, idx) => (
            <motion.div
              key={idx}
              initial="rest"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              variants={{
                rest: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1 } },
                hover: { y: -5, boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.2)" }
              }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all duration-300 group/usp flex flex-col relative overflow-hidden cursor-pointer"
              
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 opacity-0 group-hover/usp:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover/usp:scale-110 transition-transform duration-300 shadow-sm group-hover/usp:bg-teal-500 group-hover/usp:border-teal-500 group-hover/usp:shadow-teal-200/50">
                  <motion.div
                    variants={{
                      rest: { y: 0 },
                      visible: { y: 0 },
                      hover: { y: [0, -4, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
                    }}
                  >
                    <usp.icon size={24} className="text-slate-400 group-hover/usp:text-white transition-colors" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover/usp:text-teal-800 transition-colors">{usp.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{usp.fullDesc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedUsp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-[200] flex items-end sm:items-center justify-center p-3 pb-[100px] sm:p-4"
            onClick={() => setSelectedUsp(null)}
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
                  onClick={() => setSelectedUsp(null)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors bg-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 min-h-0 p-6 sm:p-8 pt-12">
                <div className="w-16 h-16 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-6">
                  <selectedUsp.icon size={32} className="text-teal-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{selectedUsp.title}</h2>
                <div className="prose prose-slate prose-sm sm:prose-base">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedUsp.fullDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
