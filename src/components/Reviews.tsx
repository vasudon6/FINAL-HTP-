import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin, Review } from '../store/AdminContext';

// Helper to convert standard youtube link or short to embed link
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/embed/')) return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('youtube.com/shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
       const id = url.split('youtu.be/')[1].split('?')[0];
       return `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (url.includes('youtube.com/watch')) {
       const urlParams = new URL(url).searchParams;
       return `https://www.youtube.com/embed/${urlParams.get('v')}?autoplay=1`;
    }
  } catch(e) {}
  return url; // fallback
};

const getYoutubeThumbnail = (url: string) => {
  if (!url) return '';
  try {
    let id = '';
    if (url.includes('youtube.com/embed/')) id = url.split('youtube.com/embed/')[1].split('?')[0];
    else if (url.includes('youtube.com/shorts/')) id = url.split('youtube.com/shorts/')[1].split('?')[0];
    else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('youtube.com/watch')) id = new URL(url).searchParams.get('v') || '';
    
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch(e) {}
  return ''; 
};

const ReviewRow: React.FC<{ idPrefix: string, reviews: Review[], activeVideoId: string | null, onPlay: (id: string | null) => void }> = ({ idPrefix, reviews, activeVideoId, onPlay }) => {
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

  if (!reviews || reviews.length === 0) return null;

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
        {reviews.map((review, idx) => {
          const uniqueId = `${idPrefix}-${review.id}-${idx}`;
          const isPlaying = activeVideoId === uniqueId;
          const thumbnail = getYoutubeThumbnail(review.videoUrl || '') || review.image;

          return (
            <motion.div 
              key={uniqueId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(20, 184, 166, 0.4)" }}
              className="relative aspect-[9/16] w-[60vw] sm:w-[220px] md:w-[260px] shrink-0 rounded-3xl overflow-hidden group/review border border-slate-200 snap-center bg-slate-900 cursor-pointer"
            >
              {isPlaying && review.videoUrl ? (
                <iframe 
                  src={getEmbedUrl(review.videoUrl)} 
                  title="Video Review"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div 
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => review.videoUrl && onPlay(uniqueId)}
                >
                  {thumbnail && <img src={thumbnail} alt={review.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/review:scale-110" loading="lazy" decoding="async" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-80 group-hover/review:opacity-90 transition-opacity duration-300"></div>
                  
                  <div className="absolute inset-0 bg-teal-900/20 opacity-0 group-hover/review:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover/review:bg-teal-500/80 group-hover/review:border-teal-400 group-hover/review:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all duration-300"
                    >
                      <Play size={26} className="ml-1 fill-white group-hover/review:scale-110 transition-transform duration-300" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex justify-between items-end transform transition-transform duration-300 group-hover/review:-translate-y-2">
                    <div>
                      <h3 className="text-white font-bold text-base md:text-lg drop-shadow-md">{review.name}</h3>
                      <p className="text-teal-300 text-[10px] md:text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                        {review.outcome}
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/20 shadow-sm group-hover/review:bg-teal-500/80 group-hover/review:border-teal-400 transition-colors duration-300">
                      VIDEO
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
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

export default function Reviews() {
  const { publicData } = useAdmin();
  const reviews = publicData.reviews || [];
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Reviews</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Patient Stories</h2>
          <p className="text-slate-500 max-w-2xl text-lg">Watch our patients share their life-changing hair restoration journeys.</p>
        </motion.div>

        <div className="flex flex-col gap-2">
          {reviews.length > 0 ? (
            reviews.reduce((resultArray, item, index) => {
              const chunkIndex = Math.floor(index / 6);
              if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
              }
              resultArray[chunkIndex].push(item);
              return resultArray;
            }, [] as Review[][]).map((chunk, idx) => (
              <ReviewRow key={`row-${idx}`} idPrefix={`row-${idx}`} reviews={chunk} activeVideoId={activeVideoId} onPlay={setActiveVideoId} />
            ))
          ) : (
             <div className="text-center py-10 text-slate-400">No reviews added yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
