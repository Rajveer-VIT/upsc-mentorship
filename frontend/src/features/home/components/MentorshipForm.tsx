'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMentorshipStore } from '@/store/useMentorshipStore';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required').or(z.literal('')).optional(),
  stage: z.string().min(1, 'Please select your preparation stage'),
  goals: z.string().min(10, 'Please briefly describe your goals (min 10 chars)'),
});

type FormValues = z.infer<typeof formSchema>;

export const MentorshipForm = () => {
  const { isSubmitting, isSuccess, setSubmitting, setSuccess } = useMentorshipStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_fullName') || localStorage.getItem('userName') || '';
      const storedEmail = localStorage.getItem('user_email') || localStorage.getItem('userEmail') || '';
      const storedPhone = localStorage.getItem('user_phone') || localStorage.getItem('userPhone') || '';
      
      if (storedName || storedEmail || storedPhone) {
        reset({
          name: storedName,
          email: storedEmail,
          phone: storedPhone,
        });
      }
    }
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/mentorship/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit application');
      }

      console.log('Mentorship Form Submitted successfully');
      setSuccess(true);
      reset();

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting mentorship application:', error);
      setErrorMsg(error.message || 'Failed to submit application. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
      >
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-navy mb-3">Application Received!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for applying to India's most exclusive UPSC mentorship. Our academic expert will contact you within 24 hours.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-gold font-semibold uppercase tracking-widest text-sm hover:text-gold-dark"
        >
          Submit Another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-navy/10 border border-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -z-10" />
      
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-2">Apply for Mentorship</h3>
        <p className="text-sm text-gray-500">Only 50 seats available per batch. Apply now for the upcoming intake.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Full Name</label>
          <input
            {...register('name')}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="E.g. Arjun Kumar"
          />
          
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">
              Phone Number <span className="text-[#c0392b] ml-1 text-sm font-black">*</span>
            </label>
            <input
              {...register('phone')}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              {...register('email')}
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">UPSC Preparation Stage</label>
          <select
            {...register('stage')}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none appearance-none ${errors.stage ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Select your current stage...</option>
            <option value="beginner">Just starting out (Beginner)</option>
            <option value="intermediate">Given attempts, didn't clear Prelims</option>
            <option value="advanced">Cleared Prelims, preparing for Mains</option>
            <option value="interview">Appeared for Interview</option>
            <option value="working">Working Professional</option>
          </select>
          {errors.stage && <p className="text-red-500 text-xs mt-1">{errors.stage.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-2">Your Primary Goal</label>
          <textarea
            {...register('goals')}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-gold focus:border-transparent transition-all outline-none resize-none ${errors.goals ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Tell us what you are struggling with..."
          />
          {errors.goals && <p className="text-red-500 text-xs mt-1">{errors.goals.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-navy text-white font-bold uppercase tracking-widest shadow-lg shadow-navy/20 transition-all hover:bg-gold hover:shadow-gold/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Apply for Mentorship'
          )}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-5">By applying, you agree to our terms and privacy policy.</p>
    </div>
  );
};
