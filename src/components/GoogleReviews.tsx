import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const GOOGLE_REVIEWS = [
  {
    id: 1,
    name: "Rahul Verma",
    date: "2 months ago",
    rating: 5,
    text: "Excellent experience at Vasu Hair Transplant Clinic. Dr. Koshle is very professional and the staff is extremely supportive. The procedure was painless, and I am already seeing great results after 4 months. Highly recommended for anyone looking for a reliable hair transplant clinic.",
    avatar: "R"
  },
  {
    id: 2,
    name: "Sanjay Kumar",
    date: "5 months ago",
    rating: 5,
    text: "I had my DHI hair transplant here. The clinic is very hygienic, and the team made me feel comfortable throughout the process. Best hair transplant clinic in Raipur without a doubt.",
    avatar: "S"
  },
  {
    id: 3,
    name: "Amit Sharma",
    date: "8 months ago",
    rating: 5,
    text: "Very satisfied with my beard transplant. The density is amazing and it looks completely natural. Thank you Dr. Vasu and team for the wonderful job.",
    avatar: "A"
  },
  {
    id: 4,
    name: "Manoj Singh",
    date: "1 year ago",
    rating: 5,
    text: "I was losing hair rapidly and tried many treatments before coming here. PRP sessions at Vasu clinic helped me stop hair fall completely. Genuine advice and great results.",
    avatar: "M"
  },
  {
    id: 5,
    name: "Vikash Tiwari",
    date: "1 month ago",
    rating: 5,
    text: "State-of-the-art facility and very humble doctors. They explain everything in detail during the consultation. My FUE surgery went very smooth.",
    avatar: "V"
  },
  {
    id: 6,
    name: "Prakash Jain",
    date: "3 months ago",
    rating: 5,
    text: "Value for money. The transparency in pricing and the post-surgery care is what makes them different. They regularly follow up on my progress.",
    avatar: "P"
  }
];

export default function GoogleReviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(GOOGLE_REVIEWS.length / reviewsPerPage);

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleReviews = GOOGLE_REVIEWS.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex bg-blue-50 px-3 py-1.5 rounded-full items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-bold text-slate-800">Google Reviews</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Trusted by 5000+ Patients
            </h2>
            <div className="flex items-center gap-4 text-slate-600">
              <div className="text-3xl font-black text-slate-900">4.9</div>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm font-medium">Based on 450+ reviews</span>
              </div>
            </div>
          </motion.div>
          
          <div className="flex gap-2">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <motion.div 
            className="flex gap-6"
            animate={{ x: `-${currentPage * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Create 3 groups for pagination */}
            {[0, 1, 2].map((pageIndex) => (
              <div key={pageIndex} className="min-w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GOOGLE_REVIEWS.slice(pageIndex * reviewsPerPage, (pageIndex + 1) * reviewsPerPage).map((review) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative group hover:border-teal-100 hover:shadow-md transition-all duration-300"
                  >
                    <Quote className="absolute top-6 right-6 text-slate-200 group-hover:text-teal-100 transition-colors" size={40} />
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{review.name}</div>
                        <div className="text-xs text-slate-500">{review.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex text-amber-400 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                      "{review.text}"
                    </p>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
