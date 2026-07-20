import { motion } from 'motion/react';
import { MapPin, Users, Award, Calendar } from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { Link } from 'react-router-dom';


export default function About() {
  const { publicData } = useAdmin();

  // Get all images that have 'clinic' in their key or ID
  const allClinicImages = publicData.generalImages.filter(
    img => img.key.toLowerCase().includes('clinic') || img.id.toLowerCase().includes('clinic')
  );

  // If no dynamic images, fallback to some defaults
  const clinicImagesList = allClinicImages.length > 0 ? allClinicImages : [
    { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=60&w=600", key: "Clinic Interior" },
    { url: "https://res.cloudinary.com/yfn8ptmo/image/upload/v1784215462/clinic-2_jq1ta5.jpg", key: "OT Room" },
    { url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=60&w=600", key: "Consultation" },
    { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=60&w=600", key: "Lounge" },
  ];

  const col1 = clinicImagesList.filter((_, i) => i % 2 === 0);
  const col2 = clinicImagesList.filter((_, i) => i % 2 !== 0);

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-[1440px] mx-auto">
        {/* Images Left */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 order-2 lg:order-1 items-start"
        >
          <div className="space-y-4">
            {col1.map((img, idx) => (
              <img key={idx} src={img.url} className={`w-full ${idx % 2 === 0 ? 'h-48 md:h-64' : 'h-56 md:h-72'} object-cover rounded-2xl shadow-sm border border-slate-100`} alt={img.key || 'Clinic Image'} loading="lazy" decoding="async" />
            ))}
          </div>
          <div className="space-y-4 pt-8 md:pt-12">
            {col2.map((img, idx) => (
              <img key={idx} src={img.url} className={`w-full ${idx % 2 === 0 ? 'h-56 md:h-72' : 'h-48 md:h-64'} object-cover rounded-2xl shadow-sm border border-slate-100`} alt={img.key || 'Clinic Image'} loading="lazy" decoding="async" />
            ))}
          </div>
        </motion.div>

        {/* Text Right */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center order-1 lg:order-2"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-teal-600"></span> About Our Clinic
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Vasu Hair Transplant Clinic</h2>
          
          <p className="text-slate-600 mb-6 leading-relaxed text-base md:text-lg">
            Established in <strong>2015</strong> in the heart of <strong>Raipur, Chhattisgarh</strong>, Vasu Hair Transplant Clinic has grown to become Central India's premier destination for permanent hair restoration. 
          </p>
          <p className="text-slate-600 mb-8 leading-relaxed text-base md:text-lg">
            Under the visionary leadership of <strong>Dr. Vasu Koshle (Chief Surgeon)</strong>, our clinic combines artistic hairline design with state-of-the-art medical technology. We specialize in Advanced FUE, DHI, PRP Therapy, and Facial Hair Transplants, delivering 100% natural and permanent results.
          </p>

          {/* Stats / Achievements Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <motion.div 
              className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow group/stat cursor-default"
              initial="rest"
              whileHover="hover"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover/stat:bg-teal-500 transition-colors">
                <motion.div variants={{
                  rest: { scale: 1 },
                  hover: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
                }}>
                  <Users size={24} className="text-teal-700 group-hover/stat:text-white transition-colors" />
                </motion.div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-slate-900">5,000+</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">Happy Patients</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow group/stat cursor-default"
              initial="rest"
              whileHover="hover"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover/stat:bg-teal-500 transition-colors">
                <motion.div variants={{
                  rest: { scale: 1 },
                  hover: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
                }}>
                  <Calendar size={24} className="text-teal-700 group-hover/stat:text-white transition-colors" />
                </motion.div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-slate-900">2015</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">Established</div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow group/stat cursor-default"
              initial="rest"
              whileHover="hover"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover/stat:bg-teal-500 transition-colors">
                <motion.div variants={{
                  rest: { scale: 1 },
                  hover: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
                }}>
                  <MapPin size={24} className="text-teal-700 group-hover/stat:text-white transition-colors" />
                </motion.div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-slate-900">Raipur</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">Central India</div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow group/stat cursor-default"
              initial="rest"
              whileHover="hover"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover/stat:bg-teal-500 transition-colors">
                <motion.div variants={{
                  rest: { scale: 1 },
                  hover: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }
                }}>
                  <Award size={24} className="text-teal-700 group-hover/stat:text-white transition-colors" />
                </motion.div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-slate-900">Awarded</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">Best Clinic</div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8">
            <Link to="/clinic">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white font-bold rounded-full overflow-hidden shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 hover:bg-teal-700 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Know More About Us
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );

}
