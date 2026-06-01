'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { PrimaryButton, Heading } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { useAdminAuth } from '@/store/useAdminAuth';

const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  //const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setAdminAuth } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginValues) => {
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid admin credentials.');
      }

      // Store in admin-specific auth store
      setAdminAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
        adminId: result.data.userId,
        email: result.data.email,
        fullName: result.data.fullName,
        username: data.username,
      });

      // Set admin cookie for middleware
      if (typeof document !== 'undefined') {
        document.cookie = `admin_auth_token=${result.data.accessToken}; path=/; max-age=604800`;
      }

      // Redirect to admin dashboard or callbackUrl
      router.push('/dashboard/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-navy-dark to-slate-900 px-4 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-navy-dark p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10"
      >
        {/* Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gold/20 p-4 rounded-full">
            <ShieldAlert className="w-8 h-8 text-gold" />
          </div>
        </div>

        <div className="text-center mb-10">
          <Heading level={2} className="text-3xl">Admin Console</Heading>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Restricted Access - Admin Only</p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-navy dark:text-cream mb-2">
              Admin Username
            </label>
            <input
              {...register('username')}
              type="text"
              className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all ${errors.username ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              placeholder="Enter admin username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-navy dark:text-cream mb-2">
              Admin Password
            </label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 dark:bg-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-gold outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              placeholder="Enter admin password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Access Admin Dashboard'
            )}
          </PrimaryButton>
        </form>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold mb-2">System Credentials:</p>
          <p>• Username: <span className="text-gold font-mono">admin</span></p>
          <p>• Password: <span className="text-gold font-mono">Admin@123</span></p>
          <p className="text-slate-500 dark:text-slate-500 mt-2 italic">These credentials are secured in the backend.</p>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            User Login?
            <Link href="/login" className="text-gold hover:underline ml-1 font-semibold">
              Click here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
