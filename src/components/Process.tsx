import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSignature, Syringe, Sparkles, HeartHandshake, X } from 'lucide-react';

const STEPS = [
  { 
    id: 1,
    icon: FileSignature, 
    title: "1. Consultation", 
    desc: "Our journey begins with a comprehensive 3D scalp analysis and medical history review. Dr. Koshle will personally evaluate your donor area density and design a custom hairline.",
    fullDesc: "Our journey begins with a comprehensive 3D scalp analysis and medical history review. Dr. Koshle will personally evaluate your donor area density, calculate the exact number of grafts needed, and design a custom hairline that matches your age, facial proportions, and future hair loss progression. During this in-depth consultation, we also discuss your lifestyle, medical background, and set realistic expectations. You will receive a transparent, step-by-step roadmap for your restoration, detailing the exact techniques to be used and the projected timeline for new growth.",
    animProps: {
      rest: { rotate: 0 },
      hover: { rotate: [0, -10, 10, -10, 0], transition: { duration: 2, repeat: Infinity, repeatDelay: 1 } }
    }
  },
  { 
    id: 2,
    icon: Syringe, 
    title: "2. Preparation", 
    desc: "On the day of surgery, we start with vital checks and final hairline marking. We use a revolutionary Painless Anesthesia Protocol to numb the areas.",
    fullDesc: "On the day of surgery, we start with vital checks and final hairline marking, ensuring you are 100% satisfied with the design before we begin. We use a revolutionary Painless Anesthesia Protocol (without traditional needles) to numb the donor and recipient areas. This advanced method uses high-frequency vibrations and specialized local anesthetic mixtures to ensure you remain completely comfortable, relaxed, and awake. Many of our patients even fall asleep, watch movies, or listen to music during the entire preparation phase.",
    animProps: {
      rest: { y: 0 },
      hover: { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
    }
  },
  { 
    id: 3,
    icon: Sparkles, 
    title: "3. Extraction & Implantation", 
    desc: "Using ultra-refined sapphire punches, individual follicles are meticulously extracted. Then, using the Direct Hair Implantation (DHI) technique, each follicle is implanted.",
    fullDesc: "Using ultra-refined sapphire punches (0.7mm - 0.9mm), individual follicles are meticulously extracted to prevent scarring and protect the donor area's integrity. The grafts are carefully sorted under high-magnification microscopes and preserved in a specialized hypothermosol solution. Finally, using the advanced Direct Hair Implantation (DHI) technique with Choi Implanter Pens, each follicle is implanted at the exact angle, depth, and direction of your natural hair growth. This guarantees maximum density, a completely natural look, and optimal graft survival.",
    animProps: {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: [1, 1.2, 1], rotate: [0, 90, 180], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
    }
  },
  { 
    id: 4,
    icon: HeartHandshake, 
    title: "4. Aftercare", 
    desc: "Post-surgery, you will rest in our premium recovery lounge. We provide a comprehensive aftercare kit, including medications and specialized shampoos.",
    fullDesc: "Post-surgery, you will rest in our premium recovery lounge where our team will brief you on post-op instructions. We provide a comprehensive aftercare kit, including all necessary medications, specialized healing shampoos, and a customized neck pillow for safe sleeping. Our dedicated care team schedules regular mandatory follow-ups (Day 3, Day 10, Month 1, 3, 6, 12) to monitor your progress. We also administer complimentary PRP (Platelet-Rich Plasma) sessions at key intervals to accelerate healing, reduce shedding, and significantly boost hair follicle growth.",
    animProps: {
      rest: { scale: 1 },
      hover: { scale: [1, 1.1, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }
    }
  },
];

export default function Process() {
  const [selectedStep, setSelectedStep] = useState<typeof STEPS[0] | null>(null);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (selectedStep) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedStep]);

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 lg:p-12 overflow-hidden shadow-xl border border-slate-800 relative">
      <div className="max-w-[1440px] mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400 mb-4">Process</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">The Journey to New Hair</h2>
          <p className="text-slate-400 max-w-2xl text-lg">A seamless, transparent, and medically optimized process from day one.</p>
        </motion.div>

        <div className="relative">
          {/* Glowing SVG Z-Line (Desktop only) */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-[10%] left-0 w-full h-[80%] hidden md:block pointer-events-none z-0">
            <path d="M 25 25 L 75 25 L 25 75 L 75 75" fill="none" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="0.5" strokeLinejoin="round" />
            <motion.path 
              d="M 25 25 L 75 25 L 25 75 L 75 75" 
              fill="none" 
              stroke="#14b8a6" 
              strokeWidth="0.8" 
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(20, 184, 166, 0.8))' }} 
              initial={{ pathLength: 0, opacity: 0 }} 
              animate={{ pathLength: 1, opacity: 1 }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} 
            />
          </svg>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-x-24 lg:gap-y-20 relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial="rest"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                variants={{
                  rest: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.15 } }
                }}
                className="flex flex-col items-center text-center group bg-slate-800/80 backdrop-blur-md p-8 lg:p-10 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors shadow-2xl"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-teal-900/10 relative">
                  <div className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <motion.div variants={step.animProps} className="relative z-10">
                    <step.icon size={32} className="text-teal-400 group-hover:text-teal-300 transition-colors" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 max-w-sm">{step.desc}</p>
                <button 
                  onClick={() => setSelectedStep(step)}
                  className="px-6 py-2.5 rounded-xl border border-teal-500/30 text-teal-400 text-sm font-bold hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all shadow-sm active:scale-95"
                >
                  Read More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal Popup */}
      <AnimatePresence>
        {selectedStep && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-3 pb-[100px] sm:p-4"
            onClick={() => setSelectedStep(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-slate-800 w-full sm:w-[500px] max-h-[calc(100vh-120px)] sm:max-h-[85vh] rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col z-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 bg-slate-800/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-slate-700">
                <button 
                  onClick={() => setSelectedStep(null)}
                  className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 min-h-0">
                <div className="p-8 pb-0 flex justify-center pt-12">
                   <div className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/10">
                      <motion.div initial="rest" animate="hover" variants={selectedStep.animProps}>
                         <selectedStep.icon size={32} className="text-teal-400" />
                      </motion.div>
                   </div>
                </div>
                
                <div className="p-8 text-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-2">Step {selectedStep.id}</h3>
                  <h2 className="text-2xl font-extrabold text-white mb-6">{selectedStep.title.replace(/^\d+\.\s/, '')}</h2>
                  <div className="prose prose-invert prose-sm sm:prose-base text-left">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {selectedStep.fullDesc}
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
