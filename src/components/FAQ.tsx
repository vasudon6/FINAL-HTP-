import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const FAQS = [
  {
    question: "Is the hair transplant procedure painful?",
    answer: "No, the procedure is virtually painless. We use a revolutionary Painless Anesthesia Protocol (without traditional needles) to numb the scalp. Most of our patients comfortably watch movies, listen to music, or even fall asleep during the surgery."
  },
  {
    question: "How long does a hair transplant take?",
    answer: "A typical hair transplant session takes between 6 to 8 hours depending on the number of grafts required. It is an outpatient procedure, meaning you can go home the same day."
  },
  {
    question: "When will I see the final results?",
    answer: "You will start noticing new hair growth around 3 to 4 months after the procedure. Significant density is visible by 6 to 8 months, and the final, fully matured results are seen between 12 to 15 months."
  },
  {
    question: "Are the results permanent?",
    answer: "Yes, the results are permanent. The transplanted hair follicles are extracted from the 'safe donor zone' at the back of the head, which is genetically resistant to the DHT hormone that causes baldness. Therefore, the transplanted hair will continue to grow for a lifetime."
  },
  {
    question: "How many days of rest do I need after the surgery?",
    answer: "We recommend taking 3 to 5 days of rest after the surgery to allow the initial healing phase to complete. After that, you can return to your normal daily activities, though strenuous exercise should be avoided for a few weeks."
  },
  {
    question: "Can I wear a cap or helmet after the procedure?",
    answer: "You can wear a loose-fitting cap provided by the clinic after 3 days. However, you must avoid wearing a tight helmet for at least 3 to 4 weeks to prevent any friction or damage to the newly implanted grafts."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600 mb-4 flex items-center justify-center gap-2">
            <MessageCircleQuestion size={18} />
            Common Questions
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
            Everything you need to know about the hair transplant procedure, recovery, and results.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                openIndex === index ? 'border-teal-300 bg-teal-50/30' : 'border-slate-200 bg-white hover:border-teal-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
              >
                <span className={`text-base md:text-lg font-bold pr-4 transition-colors ${
                  openIndex === index ? 'text-teal-800' : 'text-slate-800'
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'bg-teal-100 text-teal-600 rotate-180' : 'bg-slate-100 text-slate-500'
                }`}>
                  <ChevronDown size={18} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 text-slate-600 leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
