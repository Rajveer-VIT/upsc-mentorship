'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { PrimaryButton, Heading } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { useAdminAuth } from '@/store/useAdminAuth';

const adminSignupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  adminCode: z.string().min(1, 'Admin verification code is required'),
});

type AdminSignupValues = z.infer<typeof adminSignupSchema>;

export default function AdminSignupPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { setAdminAuth } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupValues>({
    resolver: zodResolver(adminSignupSchema),
  });

  const onSubmit = async (data: AdminSignupValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          adminCode: data.adminCode
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed.');
      }

      setSuccessMsg('Admin registration successful! Initializing session...');

      // Store in admin-specific auth store
      setAdminAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
        adminId: result.data.userId,
        email: result.data.email,
        fullName: result.data.fullName,
        username: result.data.email,
      });

      // Set admin cookie for middleware
      if (typeof document !== 'undefined') {
        document.cookie = `admin_auth_token=${result.data.accessToken}; path=/; max-age=604800`;
      }

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 1500);

    } catch (err: any) {
      console.error('Admin registration error:', err);
      setErrorMsg(err.message || 'An error occurred during registration. Please check details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-navy-dark to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white dark:bg-navy-dark p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10 my-8"
      >
        {/* Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-full text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <Heading level={2} className="text-3xl">Admin Registration</Heading>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Initialize a secured system administrator account</p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-800"
          >
            {errorMsg}
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800"
          >
            {successMsg}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy dark:text-cream mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input 
                {...register('fullName')}
                type="text" 
                className={`w-full px-4.5 py-3.5 rounded-xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all text-sm ${
                  errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="e.g. John Doe"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-navy dark:text-cream mb-1.5 uppercase tracking-wider">
                Phone Number
              </label>
              <input 
                {...register('phone')}
                type="tel" 
                className={`w-full px-4.5 py-3.5 rounded-xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all text-sm ${
                  errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="10-digit number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy dark:text-cream mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full px-4.5 py-3.5 rounded-xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all text-sm ${
                errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy dark:text-cream mb-1.5 uppercase tracking-wider">
              Admin Secure Password
            </label>
            <input 
              {...register('password')}
              type="password" 
              className={`w-full px-4.5 py-3.5 rounded-xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all text-sm ${
                errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gold mb-1.5 uppercase tracking-wider flex items-center gap-1">
              Admin Verification Code
            </label>
            <input 
              {...register('adminCode')}
              type="text" 
              className={`w-full px-4.5 py-3.5 rounded-xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all text-sm ${
                errors.adminCode ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="Enter registration validation code"
            />
            {errors.adminCode && <p className="text-red-500 text-xs mt-1">{errors.adminCode.message}</p>}
          </div>

          <PrimaryButton 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Administrator...</span>
              </>
            ) : (
              <span>Create Admin Account</span>
            )}
          </PrimaryButton>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
          <p>
            Already an Admin? 
            <Link href="/admin-login" className="text-gold hover:underline ml-1 font-semibold">
              Login to Admin Console
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
