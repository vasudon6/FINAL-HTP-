import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin, Transformation as TransformationType } from '../store/AdminContext';

function BeforeAfterCard({ before, after }: { before: string, after: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.2)" }}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-shrink-0 group/ba bg-slate-100 cursor-pointer"
    >
      <div className="w-1/2 relative h-full overflow-hidden">
        {before && <img src={before} alt="Before" className="w-full h-full object-cover grayscale-[30%] transition-transform duration-700 group-hover/ba:scale-110" loading="lazy" decoding="async" />}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-slate-500 tracking-wider shadow-sm z-10 transition-transform duration-300 group-hover/ba:-translate-y-1">BEFORE</div>
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/ba:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="w-1/2 relative h-full border-l-2 border-white overflow-hidden">
        {after && <img src={after} alt="After" className="w-full h-full object-cover transition-transform duration-700 group-hover/ba:scale-110" loading="lazy" decoding="async" />}
        <div className="absolute top-3 right-3 bg-teal-500/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-wider shadow-sm z-10 transition-transform duration-300 group-hover/ba:-translate-y-1">AFTER</div>
        <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover/ba:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 bg-white rounded-full flex items-center justify-center shadow-lg z-20 group-hover/ba:scale-110 transition-transform duration-300 group-hover/ba:shadow-teal-200/50">
        <div className="flex gap-[2px]">
          <div className="w-0.5 h-3 bg-slate-400 rounded-full"></div>
          <div className="w-0.5 h-3 bg-teal-500 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}

const SliderRow: React.FC<{ idPrefix: string, cases: TransformationType[] }> = ({ idPrefix, cases }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  if (!cases || cases.length === 0) return null;

  return (
    <div className="relative mb-10 w-full group/slider">
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
        {cases.map((item, idx) => (
          <div key={`${idPrefix}-${item.id}-${idx}`} className="snap-center w-[80vw] sm:w-[280px] md:w-[320px] shrink-0">
            <BeforeAfterCard before={item.before} after={item.after} />
          </div>
        ))}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 lg:-mr-6 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors md:opacity-0 md:group-hover/slider:opacity-100"
      >
        <ChevronRight size={24} className="text-slate-700" />
      </button>
    </div>
  );
}

export default function Transformation() {
  const { publicData } = useAdmin();
  const cases = publicData.transformations || [];

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Transformation</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Real Results. Real Confidence.</h2>
          <p className="text-slate-500 max-w-2xl text-lg">Swipe to see incredible transformations achieved with our advanced FUE technique.</p>
        </motion.div>

        <div className="flex flex-col gap-2">
          {cases.length > 0 ? (
            cases.reduce((resultArray, item, index) => {
              const chunkIndex = Math.floor(index / 5);
              if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
              }
              resultArray[chunkIndex].push(item);
              return resultArray;
            }, [] as TransformationType[][]).map((chunk, idx) => (
              <SliderRow key={`row-${idx}`} idPrefix={`row-${idx}`} cases={chunk} />
            ))
          ) : ( 
             <div className="text-center py-10 text-slate-400">No transformations added yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
