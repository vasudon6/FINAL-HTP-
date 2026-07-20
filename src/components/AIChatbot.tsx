import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAdmin } from '../store/AdminContext';

export default function AIChatbot() {
  const { publicData, addBooking } = useAdmin();
  
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, isBookingForm?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

        const websiteContext = `
Doctors: ${publicData.doctors?.map(d => d.name + ' - ' + d.title + ' (' + d.experience + ' yrs)').join(', ')}
Services: ${publicData.services?.map(s => s.title + ': ' + s.description).join('\n')}

Custom Clinic Knowledge Base:
${publicData.clinicContext || 'No additional context provided by admin.'}
`;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10), // Send last 10 messages for context
          apiKey: publicData.aiApiKey,
          websiteContext: websiteContext
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', text: data.reply, isBookingForm: data.showBookingForm }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, a technical error occurred.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, there is a connection problem.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed right-4 bottom-[100px] sm:bottom-6 sm:right-6 z-[110] flex-col items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}>
        <div
          className="animate-bounce bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs px-3 py-1.5 lg:text-sm font-bold lg:px-4 lg:py-2 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.5)] whitespace-nowrap border border-white/20 relative"
        >
          Ask anything ✨
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-teal-600 rotate-45 border-r border-b border-white/20"></div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 lg:w-16 lg:h-16 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(13,148,136,0.4)]"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ willChange: "transform, opacity" }}
            className="fixed right-2 left-2 bottom-[100px] sm:right-6 sm:left-auto sm:bottom-6 sm:w-[380px] h-[400px] sm:h-[450px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 z-[110] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-teal-600 px-4 py-3 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="font-bold text-sm tracking-wide">AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-teal-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 text-sm mt-4">
                  Hello! I am the clinic's AI assistant. How can I help you?
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-teal-600 text-white rounded-tr-sm' 
                          : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  {msg.isBookingForm && (
                    <div className="flex justify-start w-full">
                      <div className="w-[90%] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-sm">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const p = formData.get('phone') as string;
                          const email = formData.get('email') as string;
                          let hasErr = false;
                          if (p.length !== 10) {
                            setPhoneError('please enter writte mobile number');
                            hasErr = true;
                          }
                          if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            setEmailError('please enter valid email id');
                            hasErr = true;
                          }
                          if (hasErr) return;
                          
                          setPhoneError('');
                          setEmailError('');
                          
                          const aiBooking = {
                            name: formData.get('name') as string,
                            phone: '+91' + p,
                            email: email,
                            service: formData.get('service') as string,
                            type: formData.get('type') as string,
                            date: formData.get('date') as string,
                            time: formData.get('time') as string,
                            message: formData.get('message') as string,
                          };
                          
                            addBooking(aiBooking);
                            
                            // Let the user know
                            setMessages(prev => {
                              const newMessages = [...prev];
                              // Remove the form flag from the previous message so it doesn't render again
                              if (newMessages.length > 0) {
                                newMessages[newMessages.length - 1].isBookingForm = false;
                              }
                              return [...newMessages, { role: 'user', text: "Booking Details Submitted" }];
                            });
                            setTimeout(() => {
                              setMessages(prev => [...prev, { role: 'model', text: "Your appointment has been successfully booked. We will contact you soon. Thank you!" }]);
                            }, 500);
                          
                        }} className="flex flex-col gap-3">
                          <input required name="name" type="text" placeholder="Full Name *" className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500" />
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-medium">+91</span>
                              <input required name="phone" type="tel" value={phoneInput} onChange={(e) => {setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10)); setPhoneError('');}} placeholder="9876543210" className={`w-full pl-12 pr-3 py-1.5 border ${phoneError ? 'border-red-500 focus:border-red-500 outline-none ring-2 ring-red-500/20' : 'border-slate-200 focus:border-teal-500 outline-none'} rounded-lg`} />
                            </div>
                            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                          </div>
                          <div>
                            <input required name="email" type="email" onChange={() => setEmailError('')} placeholder="Email Address *" className={`w-full px-3 py-1.5 border ${emailError ? 'border-red-500 focus:border-red-500 outline-none ring-2 ring-red-500/20' : 'border-slate-200 focus:border-teal-500 outline-none'} rounded-lg`} />
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                          </div>
                          
                          <select required name="service" className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 bg-white">
                            <option value="">Select Service *</option>
                            {publicData.services?.map((s: any) => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            ))}
                            <option value="General Consultation">General Consultation</option>
                          </select>
                          
                          <select required name="type" className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 bg-white">
                            <option value="In-Clinic">In-Clinic Visit</option>
                            <option value="Video Call">Video Call</option>
                          </select>
                          
                          <input 
                            required 
                            name="date" 
                            type="date" 
                            min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                            onChange={(e) => {
                              const d = new Date(e.target.value);
                              if (d.getDay() === 0) {
                                alert("Sunday is not available for booking. Please select another date.");
                                e.target.value = '';
                              }
                            }}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 text-slate-700" 
                          />
                          
                          <select required name="time" className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 bg-white">
                            <option value="">Select Time *</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="10:30 AM">10:30 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="12:30 PM">12:30 PM</option>
                            <option value="01:00 PM">01:00 PM</option>
                            <option value="01:30 PM">01:30 PM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="02:30 PM">02:30 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="03:30 PM">03:30 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="04:30 PM">04:30 PM</option>
                            <option value="05:00 PM">05:00 PM</option>
                            <option value="05:30 PM">05:30 PM</option>
                            <option value="06:00 PM">06:00 PM</option>
                            <option value="06:30 PM">06:30 PM</option>
                            <option value="07:00 PM">07:00 PM</option>
                          </select>
                          
                          <textarea name="message" placeholder="Problem Details (Optional)" rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 resize-none"></textarea>
                          
                          <button type="submit" className="w-full bg-teal-600 text-white rounded-lg py-2 font-medium hover:bg-teal-700 transition-colors">
                            Book Appointment
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your question..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 shrink-0 bg-teal-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 hover:bg-teal-700 transition-colors"
                >
                  <Send size={16} className="ml-[-2px] mt-[1px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
