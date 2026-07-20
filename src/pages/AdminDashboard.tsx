import React, { useState } from 'react';
import { useAdmin, Booking, Transformation, Review, GeneralImage } from '../store/AdminContext';
import { Trash2, CheckCircle, XCircle, Clock, Plus, GripVertical, Image as ImageIcon, Video, Save, X, Eye, Settings, Calendar, MessageSquare, Users, Briefcase, Database, ChevronLeft, ChevronRight, Stethoscope, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

function AdminTabs({ active, setActive }: { active: string, setActive: (t: string) => void }) {
  const tabs = [
        { name: 'AI Settings', icon: Bot },
    { name: 'Bookings', icon: Calendar },
    { name: 'Queries', icon: MessageSquare },
    { name: 'Transformations', icon: ImageIcon },
    { name: 'Video Reviews', icon: Video },
    { name: 'General Images', icon: ImageIcon },
    { name: 'Doctors', icon: Users },
    { name: 'Services', icon: Stethoscope }
  ];

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative mb-6 group flex items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 z-10 w-8 h-8 md:w-10 md:h-10 ml-1 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-teal-50 hover:scale-110 transition-all flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide w-full px-8 sm:px-2 scroll-smooth py-1"
      >
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = active === t.name;
          return (
            <motion.button 
              key={t.name}
              onClick={() => setActive(t.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
            >
              <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
              {t.name}
            </motion.button>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 z-10 w-8 h-8 md:w-10 md:h-10 mr-1 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-teal-50 hover:scale-110 transition-all flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  
  let videoId = '';
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0] || '';
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { bookings, updateBookingStatus, deleteBooking, queries, deleteQuery, draftData, setDraftData, publishChanges, discardChanges } = useAdmin();
  const [activeTab, setActiveTab] = useState('Bookings');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Check session storage on mount
  React.useEffect(() => {
    if (sessionStorage.getItem('vasu_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'v@gmail.com' && password === 'vasu') {
      setIsAuthenticated(true);
      sessionStorage.setItem('vasu_admin_auth', 'true');
      toast.success('Login successful');
    } else {
      toast.error('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
              <Save size={32} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 text-sm mt-2">Sign in to manage the clinic</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" 
                required 
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" 
                required 
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => window.location.href = '/'}
              className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Back to Home
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Helpers for Draft Data
  const updateDraft = (key: keyof typeof draftData, val: any) => {
    setDraftData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Manage bookings and website content.</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                sessionStorage.removeItem('vasu_admin_auth');
                toast.success('Logged out successfully');
              }}
              className="px-3 md:px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-xs md:text-sm order-3 md:order-last md:ml-4"
            >
              Logout
            </button>
            <button 
              onClick={discardChanges}
              className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm"
            >
              <X size={16} /> <span className="hidden sm:inline">Discard Draft</span><span className="sm:hidden">Discard</span>
            </button>
            <button 
              onClick={publishChanges}
              className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm shadow-lg shadow-teal-600/20"
            >
              <Save size={16} /> Publish
            </button>
          </div>
        </div>
        <AdminTabs active={activeTab} setActive={setActiveTab} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 min-h-[500px]">
          {activeTab === 'AI Settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">AI Chatbot Settings</h2>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">Gemini API Key</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="password" 
                    value={draftData.aiApiKey || ''}
                    onChange={(e) => setDraftData(prev => ({ ...prev, aiApiKey: e.target.value }))}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    placeholder="Enter your Gemini API Key..."
                    className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setDraftData(prev => ({ ...prev, aiApiKey: '' }));
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Delete
                    </button>
                    <button
                      onClick={publishChanges}
                      className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">Clinic Knowledge Base (Context for AI)</label>
                <textarea
                  value={draftData.clinicContext || ''}
                  onChange={(e) => setDraftData(prev => ({ ...prev, clinicContext: e.target.value }))}
                  placeholder="Enter detailed information about your clinic, services, pricing, FAQs, etc. The AI Chatbot will read this to answer customer questions."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors h-48 resize-y mb-4"
                />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-xs text-slate-500">
                    Write in detail about your clinic so the AI can learn from it and answer customer questions accurately.
                  </p>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setDraftData(prev => ({ ...prev, clinicContext: '' }));
                      }}
                      className="flex-1 sm:flex-none px-6 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Delete
                    </button>
                    <button
                      onClick={publishChanges}
                      className="flex-1 sm:flex-none px-6 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Bookings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Consultation Bookings</h2>
              {bookings.length === 0 ? (
                <div className="text-center text-slate-400 py-12">No bookings yet.</div>
              ) : (
                <div className="grid gap-4">
                  {bookings.map(b => (
                    <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-slate-900">{b.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                          {b.service} - {b.type}
                        </p>
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                          <span>{b.phone}</span>
                          {b.email && <span>{b.email}</span>}
                          <span>{b.date} at {b.time}</span>
                          <span>Requested: {new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {b.status !== 'confirmed' && (
                          <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Confirm">
                            <CheckCircle size={20} />
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Cancel">
                            <XCircle size={20} />
                          </button>
                        )}
                        {b.message && (
                          <button onClick={() => setSelectedMessage(b.message!)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2" title="View Message">
                            <Eye size={20} />
                          </button>
                        )}
                        <button onClick={() => deleteBooking(b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2" title="Delete">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Queries' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Client Queries</h2>
              {queries && queries.length === 0 ? (
                <div className="text-center text-slate-400 py-12">No queries yet.</div>
              ) : (
                <div className="grid gap-4">
                  {queries && queries.map(q => (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900">{q.name}</h3>
                          <a href={`mailto:${q.email}`} className="text-sm text-teal-600 hover:underline">{q.email}</a>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleString()}</span>
                          <button onClick={() => deleteQuery(q.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-100 text-slate-700 text-sm whitespace-pre-wrap">
                        {q.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Transformations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Before & After Images</h2>
                <button 
                  onClick={() => {
                    const newId = Date.now().toString();
                    updateDraft('transformations', [{ id: newId, before: '', after: '' }, ...draftData.transformations]);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {draftData.transformations.map((t, idx) => (
                  <div key={t.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-400 text-sm">Image Pair #{idx + 1}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if(idx > 0) {
                              const arr = [...draftData.transformations];
                              [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
                              updateDraft('transformations', arr);
                            }
                          }}
                          disabled={idx === 0}
                          className="text-slate-400 hover:text-slate-900 disabled:opacity-30"
                        >
                          Up
                        </button>
                        <button 
                          onClick={() => {
                            if(idx < draftData.transformations.length - 1) {
                              const arr = [...draftData.transformations];
                              [arr[idx+1], arr[idx]] = [arr[idx], arr[idx+1]];
                              updateDraft('transformations', arr);
                            }
                          }}
                          disabled={idx === draftData.transformations.length - 1}
                          className="text-slate-400 hover:text-slate-900 disabled:opacity-30"
                        >
                          Down
                        </button>
                        <button onClick={() => {
                          updateDraft('transformations', draftData.transformations.filter(item => item.id !== t.id));
                        }} className="text-red-500 hover:text-red-700 ml-4">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Before Image URL</label>
                          <input 
                            type="text" 
                            value={t.before} 
                            onChange={(e) => {
                              const arr = [...draftData.transformations];
                              arr[idx].before = e.target.value;
                              updateDraft('transformations', arr);
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-teal-500 mb-2" 
                            placeholder="https://..."
                          />
                          {t.before && (
                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={t.before} alt="Before preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} loading="lazy" decoding="async" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">After Image URL</label>
                          <input 
                            type="text" 
                            value={t.after} 
                            onChange={(e) => {
                              const arr = [...draftData.transformations];
                              arr[idx].after = e.target.value;
                              updateDraft('transformations', arr);
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-teal-500 mb-2" 
                            placeholder="https://..."
                          />
                          {t.after && (
                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={t.after} alt="After preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} loading="lazy" decoding="async" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Video Reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Patient Video Reviews</h2>
                <button 
                  onClick={() => {
                    const newId = Date.now().toString();
                    updateDraft('reviews', [{ id: newId, name: 'New Patient', outcome: 'Result', image: '', videoUrl: '' }, ...draftData.reviews]);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800"
                >
                  <Plus size={16} /> Add Video
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {draftData.reviews.map((r, idx) => (
                  <div key={r.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                     <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-400 text-sm">Review #{idx + 1}</span>
                      <div className="flex gap-2">
                        <button onClick={() => {
                            if(idx > 0) {
                              const arr = [...draftData.reviews];
                              [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
                              updateDraft('reviews', arr);
                            }
                          }}
                          disabled={idx === 0}
                          className="text-slate-400 hover:text-slate-900 disabled:opacity-30"
                        >Up</button>
                        <button onClick={() => {
                            if(idx < draftData.reviews.length - 1) {
                              const arr = [...draftData.reviews];
                              [arr[idx+1], arr[idx]] = [arr[idx], arr[idx+1]];
                              updateDraft('reviews', arr);
                            }
                          }}
                          disabled={idx === draftData.reviews.length - 1}
                          className="text-slate-400 hover:text-slate-900 disabled:opacity-30"
                        >Down</button>
                        <button onClick={() => {
                          updateDraft('reviews', draftData.reviews.filter(item => item.id !== r.id));
                        }} className="text-red-500 hover:text-red-700 ml-4">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Patient Name</label>
                          <input type="text" value={r.name} onChange={(e) => {
                            const arr = [...draftData.reviews]; arr[idx].name = e.target.value; updateDraft('reviews', arr);
                          }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Outcome Label</label>
                          <input type="text" value={r.outcome} onChange={(e) => {
                            const arr = [...draftData.reviews]; arr[idx].outcome = e.target.value; updateDraft('reviews', arr);
                          }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">YouTube URL / Short URL</label>
                          <input type="text" value={r.videoUrl || ''} onChange={(e) => {
                            const arr = [...draftData.reviews]; arr[idx].videoUrl = e.target.value; updateDraft('reviews', arr);
                          }} className="w-full p-2 border border-slate-200 rounded-lg text-sm mb-2" placeholder="https://youtube.com/..." />
                          {r.videoUrl && (
                            <div className="w-full max-w-sm aspect-video rounded-lg overflow-hidden bg-slate-900">
                              <iframe 
                                src={getYouTubeEmbedUrl(r.videoUrl)} 
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'General Images' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-900">General Website Images</h2>
               </div>
               <div className="grid gap-6">
                {draftData.generalImages.map((img, idx) => (
                  <div key={img.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col md:flex-row gap-6 items-start relative">
                    {img.url && (
                      <div className="w-full md:w-32 aspect-video md:aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img src={img.url} alt={img.key} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-4 pr-12">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Key / Location</label>
                        <input type="text" value={img.key} readOnly className="w-full p-2 border border-slate-200 bg-slate-100 text-slate-500 font-medium rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Image URL</label>
                        <input type="text" value={img.url} onChange={(e) => {
                          const arr = [...draftData.generalImages]; arr[idx].url = e.target.value; updateDraft('generalImages', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-teal-500" placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                ))}
               </div>
            </div>
          )}

          {activeTab === 'Doctors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Manage Doctors</h2>
                <button 
                  onClick={() => {
                    const newDoctor = {
                      id: Date.now().toString(),
                      name: '',
                      title: '',
                      qualification: '',
                      experience: '',
                      image: '',
                      description: '',
                      bullets: [{ icon: 'Award' as const, text: '' }]
                    };
                    updateDraft('doctors', [...draftData.doctors, newDoctor]);
                  }}
                  className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-teal-700 transition-colors"
                >
                  <Plus size={16} /> Add Doctor
                </button>
              </div>
              
              <div className="grid gap-6">
                {draftData.doctors.map((doctor, idx) => (
                  <div key={doctor.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-slate-800">Doctor Profile {idx + 1}</h3>
                      <button 
                        onClick={() => {
                          const arr = draftData.doctors.filter((_, i) => i !== idx);
                          updateDraft('doctors', arr);
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Name</label>
                        <input type="text" value={doctor.name} onChange={(e) => {
                          const arr = [...draftData.doctors]; arr[idx].name = e.target.value; updateDraft('doctors', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Dr. John Doe" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Title / Role</label>
                        <input type="text" value={doctor.title} onChange={(e) => {
                          const arr = [...draftData.doctors]; arr[idx].title = e.target.value; updateDraft('doctors', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Chief Surgeon" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Qualification</label>
                        <input type="text" value={doctor.qualification} onChange={(e) => {
                          const arr = [...draftData.doctors]; arr[idx].qualification = e.target.value; updateDraft('doctors', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. M.B.B.S, M.D." />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Experience (Years)</label>
                        <input type="text" value={doctor.experience} onChange={(e) => {
                          const arr = [...draftData.doctors]; arr[idx].experience = e.target.value; updateDraft('doctors', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. 15+" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Image URL</label>
                        <div className="flex flex-col gap-3">
                          <input type="text" value={doctor.image} onChange={(e) => {
                            const arr = [...draftData.doctors]; arr[idx].image = e.target.value; updateDraft('doctors', arr);
                          }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="https://..." />
                          {doctor.image && (
                            <div className="w-32 h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img src={doctor.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} loading="lazy" decoding="async" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                        <textarea value={doctor.description} onChange={(e) => {
                          const arr = [...draftData.doctors]; arr[idx].description = e.target.value; updateDraft('doctors', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[80px]" placeholder="Detailed description..." />
                      </div>
                      
                      {/* Bullets */}
                      <div className="md:col-span-2 space-y-3 mt-2 border-t pt-4">
                        <label className="text-xs font-bold text-slate-700 block">Key Highlights / Bullet Points</label>
                        {doctor.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex gap-3 items-center">
                            <select 
                              value={bullet.icon} 
                              onChange={(e) => {
                                const arr = [...draftData.doctors];
                                arr[idx].bullets[bIdx].icon = e.target.value as any;
                                updateDraft('doctors', arr);
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-sm bg-white"
                            >
                              <option value="Award">Award</option>
                              <option value="ShieldCheck">Shield</option>
                              <option value="Star">Star</option>
                            </select>
                            <input type="text" value={bullet.text} onChange={(e) => {
                              const arr = [...draftData.doctors];
                              arr[idx].bullets[bIdx].text = e.target.value;
                              updateDraft('doctors', arr);
                            }} className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Diplomate, ABHRS" />
                            <button 
                              onClick={() => {
                                const arr = [...draftData.doctors];
                                arr[idx].bullets = arr[idx].bullets.filter((_, i) => i !== bIdx);
                                updateDraft('doctors', arr);
                              }}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const arr = [...draftData.doctors];
                            arr[idx].bullets.push({ icon: 'Star', text: '' });
                            updateDraft('doctors', arr);
                          }}
                          className="text-teal-600 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Highlight
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Manage Services</h2>
                <button 
                  onClick={() => {
                    const newService = {
                      id: Date.now().toString(),
                      title: '',
                      description: '',
                      image: ''
                    };
                    updateDraft('services', [...draftData.services, newService]);
                  }}
                  className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-teal-700 transition-colors"
                >
                  <Plus size={16} /> Add Service
                </button>
              </div>
              
              <div className="grid gap-6">
                {draftData.services.map((service, idx) => (
                  <div key={service.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-slate-800">Service {idx + 1}</h3>
                      <button 
                        onClick={() => {
                          const arr = draftData.services.filter((_, i) => i !== idx);
                          updateDraft('services', arr);
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Title</label>
                        <input type="text" value={service.title} onChange={(e) => {
                          const arr = [...draftData.services]; arr[idx].title = e.target.value; updateDraft('services', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Hair Transplant" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Image URL</label>
                        <div className="flex flex-col gap-3">
                          <input type="text" value={service.image} onChange={(e) => {
                            const arr = [...draftData.services]; arr[idx].image = e.target.value; updateDraft('services', arr);
                          }} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="https://..." />
                          {service.image && (
                            <div className="w-48 h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img src={service.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} loading="lazy" decoding="async" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Description</label>
                        <textarea value={service.description} onChange={(e) => {
                          const arr = [...draftData.services]; arr[idx].description = e.target.value; updateDraft('services', arr);
                        }} className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[80px]" placeholder="Detailed description..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


                  </div>
      </div>
      <AnimatePresence>
        {selectedMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Patient Message</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedMessage}</p>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
