import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import Services from '../components/Services';
import Transformation from '../components/Transformation';
import Reviews from '../components/Reviews';
import Doctor from '../components/Doctor';
import WhyChooseUs from '../components/WhyChooseUs';
import Process from '../components/Process';
import Calculator from '../components/Calculator';
import About from '../components/About';
import Booking from '../components/Booking';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';
import GoogleReviews from '../components/GoogleReviews';

const AIChatbot = React.lazy(() => import('../components/AIChatbot'));

export default function PublicSite() {
  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden flex flex-col pb-24 sm:pb-0">
      <div className="bg-amber-100 text-amber-900 text-center py-2 text-sm font-bold tracking-wide relative z-[200]">
        This website is developed for demo purpose
      </div>
      <Navbar />
      <main className="flex flex-col gap-6 px-4 py-6 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full flex-grow">
        <Hero />
        <div id="services">
          <Services />
        </div>
        <div id="results">
          <Transformation />
        </div>
        <div id="reviews">
          <Reviews />
        </div>
        <div id="doctor">
          <Doctor />
        </div>
        <div id="why-choose-us">
          <WhyChooseUs />
        </div>
        <div id="process">
          <Process />
        </div>
        <div id="calculator">
          <Calculator />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="booking">
          <Booking />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <div id="google-reviews">
          <GoogleReviews />
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Suspense fallback={null}>
        <AIChatbot />
      </Suspense>
    </div>
  );
}
