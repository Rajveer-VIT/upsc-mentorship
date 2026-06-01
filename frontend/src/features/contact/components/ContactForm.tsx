'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(5, 'Please enter a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_fullName') || localStorage.getItem('userName') || '';
      const storedEmail = localStorage.getItem('user_email') || localStorage.getItem('userEmail') || '';
      
      if (storedName || storedEmail) {
        reset({
          fullName: storedName,
          email: storedEmail,
        });
      }
    }
  }, [reset]);

  const onSubmit = async (data: ContactFormValues) => {
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit contact inquiry');
      }

      console.log('Contact form submitted successfully');
      setIsSuccess(true);
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setErrorMsg(error.message || 'Something went wrong. Please check your connection and try again.');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-2xl shadow-navy/5 border border-gray-100 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center py-12 min-h-[400px]"
          >
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-navy mb-4">Message Sent!</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Thank you for reaching out. Our support team will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-gold font-bold uppercase tracking-widest text-sm hover:text-gold-dark transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-10">
              <h3 className="text-3xl font-serif font-bold text-navy mb-3">Get in Touch</h3>
              <p className="text-gray-500 mb-2">Fill out the form below and we'll be in contact shortly.</p>
              <p className="text-gold font-semibold">📧 upscwitheshwar@gmail.com</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    {...register('fullName')}
                    className={`w-full px-5 py-4 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-2">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                    Email Address <span className="text-[#c0392b] ml-1 text-sm font-black">*</span>
                  </label>
                  <input
                    {...register('email')}
                    className={`w-full px-5 py-4 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Subject</label>
                <input
                  {...register('subject')}
                  className={`w-full px-5 py-4 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none ${errors.subject ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="How can we help you?"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-2">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Message</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={`w-full px-5 py-4 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Write your message here..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-xl bg-navy text-white font-bold uppercase tracking-widest shadow-xl shadow-navy/20 transition-all hover:bg-gold hover:shadow-gold/30 disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
