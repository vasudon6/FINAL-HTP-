import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Calculator as CalculatorIcon, CalendarCheck } from 'lucide-react';

export default function Calculator() {
  const [grafts, setGrafts] = useState(2500);
  const [technique, setTechnique] = useState<'FUE' | 'DHI'>('FUE');
  const [showInfo, setShowInfo] = useState(false);
  const [showAltText, setShowAltText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAltText(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const PRICE_PER_GRAFT_FUE = 35;
  const PRICE_PER_GRAFT_DHI = 55;
  
  const pricePerGraft = technique === 'FUE' ? PRICE_PER_GRAFT_FUE : PRICE_PER_GRAFT_DHI;
  const estimatedPrice = grafts * pricePerGraft;

  const handleBookNow = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-6 md:p-8 lg:p-12 shadow-xl relative overflow-hidden border border-teal-500">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

      <div className="max-w-[1440px] mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-teal-200 text-center sm:text-left">Hair Transplant Cost</h3>
                <button 
                  onClick={() => setShowInfo(true)}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-teal-900 hover:bg-slate-50 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all text-[11px] sm:text-xs font-black uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 border-2 border-white/80 overflow-hidden"
                >
                  <Info size={16} className="text-teal-600 shrink-0" />
                  <div className="relative grid items-center text-center">
                    <span className={`col-start-1 row-start-1 transition-all duration-500 ease-in-out whitespace-nowrap ${showAltText ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
                      How is it calculated?
                    </span>
                    <span className={`col-start-1 row-start-1 transition-all duration-500 ease-in-out whitespace-nowrap text-teal-600 ${showAltText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
                      Click To Know 👆
                    </span>
                  </div>
                </button>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-center lg:text-left">Calculate Your Estimate</h2>
            </div>

            <div className="space-y-6">
              {/* Technique Selector */}
              <div>
                <label className="text-sm font-bold text-white/90 mb-3 block">Select Technique</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setTechnique('FUE')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${technique === 'FUE' ? 'border-white bg-white text-teal-700 shadow-lg' : 'border-white/30 text-white hover:bg-white/10'}`}
                  >
                    Advanced FUE
                  </button>
                  <button 
                    onClick={() => setTechnique('DHI')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${technique === 'DHI' ? 'border-white bg-white text-teal-700 shadow-lg' : 'border-white/30 text-white hover:bg-white/10'}`}
                  >
                    DHI Implantation
                  </button>
                </div>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between items-end mb-4 text-white">
                  <span className="text-sm font-bold text-white/90">Select Number of Grafts</span>
                  <span className="text-4xl font-black">{grafts.toLocaleString()}</span>
                </div>

                <input 
                  type="range" 
                  min="500" 
                  max="5000" 
                  step="100"
                  value={grafts}
                  onChange={(e) => setGrafts(Number(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-xs font-medium text-white/60 mt-3">
                  <span>Mild (500)</span>
                  <span>Severe (5,000)</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial="rest"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            variants={{
              rest: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 }
            }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 flex flex-col items-center text-center cursor-pointer group/calc"
          >
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-teal-100 group-hover/calc:bg-teal-500 group-hover/calc:border-teal-500 transition-colors">
              <motion.div
                variants={{
                  rest: { rotate: 0 },
                  hover: { rotate: [0, 15, -15, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
                }}
              >
                <CalculatorIcon size={32} className="text-teal-600 group-hover/calc:text-white transition-colors" />
              </motion.div>
            </div>
            
            <div className="text-[10px] text-teal-600 uppercase font-black mb-2 tracking-widest bg-teal-50 px-2 py-1 rounded">Estimated Investment</div>
            
            <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
              ₹{estimatedPrice.toLocaleString()} 
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">*GST & Medications Extra</p>
            
            <button 
              onClick={handleBookNow}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck size={18} /> Book Free Consultation
            </button>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Final cost is determined after medical assessment by the surgeon.</p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowInfo(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col z-10 p-6 md:p-8"
            >
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors z-10"
              >
                <X size={18} />
              </button>
              
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">How is pricing calculated?</h2>
              
              <div className="space-y-6 text-slate-600 text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">What is a Graft?</h4>
                  <p className="leading-relaxed">A "graft" is a single follicular unit extracted from your donor area. One graft naturally contains 1 to 4 hair strands. Pricing is strictly calculated per graft, not per hair strand.</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">Technique Differences</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <span className="font-bold text-teal-600 shrink-0">FUE (₹{PRICE_PER_GRAFT_FUE}/graft):</span>
                      <span>Follicles are implanted using traditional forceps into pre-made slits.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-teal-600 shrink-0">DHI (₹{PRICE_PER_GRAFT_DHI}/graft):</span>
                      <span>Follicles are implanted using a Choi Implanter Pen for maximum density, precise angle control, and faster healing.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
