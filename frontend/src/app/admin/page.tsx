'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/auth-utils';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in as admin
    if (isAdminAuthenticated()) {
      // Already logged in, redirect to admin dashboard
      router.push('/dashboard/admin');
    } else {
      // Not logged in, redirect to admin login
      router.push('/admin-login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="flex flex-col items-center gap-4"
      >
        <ShieldAlert className="w-16 h-16 text-gold" />
        <p className="text-slate-600 dark:text-slate-400">Redirecting to Admin Panel...</p>
      </motion.div>
    </div>
  );
}
