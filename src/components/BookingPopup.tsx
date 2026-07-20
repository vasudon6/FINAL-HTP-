import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Booking from './Booking';

export default function BookingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAndShowPopup = () => {
      const hasBooked = localStorage.getItem('has_booked_consultation') === 'true';
      if (!hasBooked) {
        setIsOpen(true);
      }
    };

    // Show popup after 2 minutes initially
    timeoutRef.current = setTimeout(checkAndShowPopup, 120000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    
    // Check again after 2 minutes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const hasBooked = localStorage.getItem('has_booked_consultation') === 'true';
      if (!hasBooked) {
        setIsOpen(true);
      }
    }, 120000);
  };

  // Do not render anything if closed to save resources
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl relative my-auto"
          >
            <div className="absolute right-2 top-2 md:right-4 md:top-4 z-50">
              <button 
                onClick={handleClose}
                className="bg-white/80 backdrop-blur p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm border border-slate-200 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* 
              Booking component has its own bg-white and rounding. 
              We can just render it. Since it's a section, it might look fine inside a modal. 
            */}
            <div className="max-h-[90vh] overflow-y-auto rounded-3xl scrollbar-hide shadow-2xl">
              <Booking isPopup={true} onComplete={handleClose} />
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
