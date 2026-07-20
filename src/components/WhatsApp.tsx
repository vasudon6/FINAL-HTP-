import { motion } from 'motion/react';
import { PhoneIcon } from 'lucide-react'; 

export default function WhatsApp() {
  return (
    <motion.a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 left-4 sm:left-auto sm:right-6 lg:bottom-6 lg:left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(34, 197, 94, 0.4)",
          "0 0 0 15px rgba(34, 197, 94, 0)",
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    >
      <PhoneIcon size={24} className="fill-white" />
    </motion.a>
  );
}
