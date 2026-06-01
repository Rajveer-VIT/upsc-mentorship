'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { PrimaryButton, Heading } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { useUserAuth } from '@/store/useUserAuth';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setUserAuth } = useUserAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupValues) => {
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
password: data.password,
fullName: data.fullName,
phone: data.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed.');
      }

      // Store in user-specific auth store
      setUserAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
        userId: result.data.userId,
        email: result.data.email,
        fullName: result.data.fullName,
        role: result.data.role,
      });

      // Set user cookie for middleware
      if (typeof document !== 'undefined') {
        document.cookie = `user_auth_token=${result.data.accessToken}; path=/; max-age=604800`;
      }

      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-navy-dark p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <Heading level={2} className="text-3xl">Join the Elite</Heading>
          <p className="text-slate-500 mt-2">Start your journey to the IAS today</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 text-sm font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-navy dark:text-cream mb-2">Full Name</label>
            <input 
              {...register('fullName')}
              type="text" 
              className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all ${
                errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="Arjun Kumar"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-navy dark:text-cream mb-2">Email Address</label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="arjun@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-navy dark:text-cream mb-2">Phone Number</label>
            <input 
              {...register('phone')}
              type="text" 
              className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all ${
                errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-navy dark:text-cream mb-2">Password</label>
            <input 
              {...register('password')}
              type="password" 
              className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <PrimaryButton type="submit" disabled={isSubmitting} className="w-full py-4 text-lg flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </PrimaryButton>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-gold font-bold hover:underline">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
}
