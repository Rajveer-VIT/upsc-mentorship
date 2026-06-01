import React from 'react';
import { Metadata } from 'next';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { MapPin, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | UPSC with Eshwar',
  description: 'Get in touch with India\'s most premium UPSC mentorship platform.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-black uppercase tracking-[0.2em] text-xs mb-4 block">Support & Enquiries</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-navy mb-6">
            We're here to help you <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-dark to-gold italic">succeed.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Have questions about our mentorship programs? Our academic counselors are ready to guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-navy/5 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-navy mb-2">Call Us</h4>
              <p className="text-gray-500 text-sm mb-1">Mon-Sat from 9am to 6pm.</p>
              <a href="tel:+919160912913" className="font-semibold text-gold hover:text-navy transition-colors">+91 9160 912913</a>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-navy/5 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-navy mb-2">Email Us</h4>
              <p className="text-gray-500 text-sm mb-1">We'll respond within 24 hours.</p>
              <a href="mailto:upscwitheshwar@gmail.com" className="font-semibold text-gold hover:text-navy transition-colors">upscwitheshwar@gmail.com</a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
