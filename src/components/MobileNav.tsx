import { Home, Image, Calculator, CalendarCheck, Video, Stethoscope, Building2, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function MobileNav() {
  const leftItems = [
    { icon: Home, label: 'Home', href: '/#top' },
    { icon: Building2, label: 'Clinic', href: '/#about' },
    { icon: BookOpen, label: 'Blog', href: '/blog' },
    { icon: Image, label: 'Results', href: '/#results' },
  ];
  
  const rightItems = [
    { icon: Video, label: 'Reviews', href: '/#reviews' },
    { icon: Calculator, label: 'Cost', href: '/#calculator' },
    { icon: HelpCircle, label: 'FAQ', href: '/#faq' },
    { icon: Stethoscope, label: 'Doctor', href: '/#doctor' },
  ];

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 w-[96%] max-w-[420px] bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[100] sm:hidden" 
      style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-between items-end h-[68px] px-2 relative pb-2 w-full">
        
        {leftItems.map((item, i) => (
          <Link
            key={i} to={item.href}
            className="flex flex-col items-center justify-end h-full pb-1 text-slate-500 hover:text-teal-600 transition-colors active:text-teal-700 relative w-full group"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <item.icon size={20} className="mb-1 group-hover:text-teal-600 transition-colors" />
            </motion.div>
            <span className="text-[8px] font-bold tracking-wide">{item.label}</span>
          </Link>
        ))}

        {/* Center Booking Button */}
        <Link to="/#booking"
          className="flex flex-col items-center justify-end h-full text-slate-500 pb-1 relative group w-full"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              y: [0, -4, 0],
              boxShadow: [
                "0 4px 15px rgba(13, 148, 136, 0.4)",
                "0 4px 25px rgba(13, 148, 136, 0.7)",
                "0 4px 15px rgba(13, 148, 136, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 w-[52px] h-[52px] bg-teal-600 rounded-full flex items-center justify-center text-white border-[3px] border-white z-10"
          >
            <CalendarCheck size={24} className="text-white" />
          </motion.div>
          <span className="text-[8px] font-bold tracking-wide text-teal-700 mt-6 relative top-[2px]">Book</span>
        </Link>

        {rightItems.map((item, i) => (
          <Link
            key={i} to={item.href}
            className="flex flex-col items-center justify-end h-full pb-1 text-slate-500 hover:text-teal-600 transition-colors active:text-teal-700 relative w-full group"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <item.icon size={20} className="mb-1 group-hover:text-teal-600 transition-colors" />
            </motion.div>
            <span className="text-[8px] font-bold tracking-wide whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
