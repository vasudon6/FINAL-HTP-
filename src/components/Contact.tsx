import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import toast from 'react-hot-toast';

export default function Contact() {
  const { addQuery } = useAdmin();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    addQuery(formData);
    toast.success('Your message has been sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden mt-6 mb-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-[1440px] mx-auto items-start">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Get In Touch</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Visit Our Clinic</h2>
          <p className="text-slate-500 mb-10 text-lg">
            We are conveniently located in the heart of Raipur. Drop by for a visit or reach out to us via phone or email.
          </p>
          
          <div className="space-y-6">
            {[
              { icon: MapPin, title: "Clinic Address", text: "123 Healthcare Avenue, Civil Lines, Raipur, Chhattisgarh 492001" },
              { icon: Phone, title: "Phone Number", text: "+91 98765 43210 \n+91 98765 43211" },
              { icon: Mail, title: "Email Address", text: "care@vasuhairclinic.com" },
              { icon: Clock, title: "Working Hours", text: "Mon - Sat: 10:00 AM - 8:00 PM \nSunday: Closed" },
            ].map((contact, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100 mt-1">
                  <contact.icon size={20} className="text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{contact.title}</h4>
                  <p className="text-slate-500 text-sm whitespace-pre-line leading-relaxed">{contact.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-slate-50 rounded-[2rem] p-6 lg:p-8 border border-slate-200 shadow-inner"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-600 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
