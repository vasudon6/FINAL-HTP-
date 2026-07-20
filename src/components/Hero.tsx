import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAdmin } from '../store/AdminContext';

export default function Hero() {
  const { publicData } = useAdmin();
  const heroImage = publicData.generalImages.find(img => img.id === 'hero-bg')?.url || "https://res.cloudinary.com/yfn8ptmo/image/upload/v1784274462/Gemini_Generated_Image_bokkn8bokkn8bokk_bqdmq8.png";

  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm overflow-hidden relative group/hero">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-stretch relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full border border-teal-100 italic mb-6 shadow-sm hover:shadow-teal-100/50 transition-all cursor-default"
            >
              <Sparkles size={12} className="mr-1 inline-block animate-pulse text-teal-500" />
              Trusted by 5000+ Patients
            </motion.span>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Raipur No. 1 Hair{" "}
              <motion.span 
                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500"
                whileHover={{ scale: 1.02, textShadow: "0px 0px 15px rgba(20, 184, 166, 0.4)" }}
                transition={{ duration: 0.2 }}
              >
                Transplant Clinic
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
                  style={{ originX: 0 }}
                />
              </motion.span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
              Regrow your confidence with our FUE technology. Permanent results, naturally high density, and painless recovery.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.a 
                href="#booking" 
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px -5px rgba(20, 184, 166, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Free Consultation
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_5s_infinite]"
                />
              </motion.a>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-default"
              >
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden hover:z-10 transition-transform hover:scale-110 duration-200"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=60" alt="Patient" loading="lazy" decoding="async" /></div>
                  <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white overflow-hidden hover:z-10 transition-transform hover:scale-110 duration-200"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=60" alt="Patient"  /></div>
                  <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white overflow-hidden flex items-center justify-center text-xs font-bold text-white bg-teal-600 hover:z-10 transition-transform hover:scale-110 duration-200">5k+</div>
                </div>
                <span className="text-xs font-bold text-slate-500 flex flex-col">
                  <span>Recent</span>
                  <span className="text-teal-600">Success</span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative min-h-[400px] h-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 group"
        >
          <img fetchPriority="high" decoding="async" src={heroImage} 
            alt="Hair Transplant Clinic" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-transparent group-hover:from-teal-600/30 transition-colors duration-500"></div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 left-4 right-4 p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/50 flex justify-between items-center hover:bg-white/80 transition-colors duration-300 cursor-default"
          >
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Dr. Vasu Koshle
            </span>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded shadow-sm">Chief Surgeon</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
