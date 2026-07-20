import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c-3.31 0-6 2.69-6 6v14" />
                  <path d="M16 6c-2.21 0-4 1.79-4 4v12" />
                  <path d="M8 10c-1.1 0-2 .9-2 2v10" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Vasu Hair <span className="text-teal-500">Clinic</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Central India's premier hair restoration center. We deliver permanent, natural-looking results using advanced medical techniques.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Treatments</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Advanced FUE Hair Transplant</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">DHI Hair Implantation</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">PRP Therapy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Beard & Eyebrow Transplant</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Female Hair Loss Treatment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">About the Surgeon</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Patient Results</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Cost Calculator</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact Us</a></li>
              <li><a href="/admin" className="text-teal-400 font-bold hover:text-teal-300 transition-colors">Admin Panel</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Details</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-teal-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">123 Healthcare Avenue, Civil Lines, Raipur, Chhattisgarh 492001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-teal-500 shrink-0" />
                <span>care@vasuhairclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Vasu Hair Transplant Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
