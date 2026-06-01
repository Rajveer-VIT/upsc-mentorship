"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { API_BASE_URL } from '@/lib/constants';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  preferredTime: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const STORAGE_KEY = 'freeCallBookings';
const MAX_CALLS = 1; // max free bookings in window
const WINDOW_DAYS = 7; // window in days
const CALL_DURATION_MIN = 8; // free call duration

function getBookings(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function saveBooking(ts: number) {
  try {
    const arr = getBookings();
    arr.push(ts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
}

function withinWindow(ts: number) {
  const ms = WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - ts <= ms;
}

export const FreeCallModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAt, setBookedAt] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CALL_DURATION_MIN * 60);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
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

  useEffect(() => {
    let id: any;
    if (timerRunning) {
      id = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(id);
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(id);
  }, [timerRunning]);

  // Listen for global open event so other components can trigger the modal
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('openFreeCallModal', handler as EventListener);
    return () => window.removeEventListener('openFreeCallModal', handler as EventListener);
  }, []);

  const canBook = () => {
    const bookings = getBookings().filter(withinWindow);
    return bookings.length < MAX_CALLS;
  };

  const onSubmit = async (data: FormValues) => {
    setMessage(null);
    if (!canBook()) {
      setMessage(`Rate limit: only ${MAX_CALLS} free call(s) allowed per ${WINDOW_DAYS} days.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/calls/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.name,
          phone: data.phone,
          email: data.email || null,
          preferredTime: data.preferredTime || null,
          durationMinutes: CALL_DURATION_MIN,
          source: 'FreeCallModal'
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to book call.');
      }

      const now = Date.now();
      saveBooking(now);
      setBookedAt(now);
      reset();
    } catch (err: any) {
      console.error('Call booking error:', err);
      setMessage(err.message || 'Failed to book call. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTimer = () => {
    setSecondsLeft(CALL_DURATION_MIN * 60);
    setTimerRunning(true);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gold px-5 py-3 shadow-lg text-navy font-bold hover:scale-105 transition-transform"
        aria-label="Book a free call"
      >
        Book a Free Call
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-[95%] max-w-xl bg-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book a Free 8-minute Call</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            {message && <p className="text-sm text-red-500 mb-3">{message}</p>}

            {!bookedAt && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold">Full name</label>
                  <input {...register('name')} className="w-full mt-1 px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Phone</label>
                  <input {...register('phone')} className="w-full mt-1 px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Email (optional)</label>
                  <input {...register('email')} className="w-full mt-1 px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Preferred time (optional)</label>
                  <input {...register('preferredTime')} placeholder="e.g. Tomorrow 6pm" className="w-full mt-1 px-3 py-2 border rounded" />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-navy text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
                  >
                    {isSubmitting ? 'Booking...' : 'Book Free Call'}
                  </button>

                  <div className="text-sm text-gray-500">Limit: {MAX_CALLS} per {WINDOW_DAYS} days</div>
                </div>
              </form>
            )}

            {bookedAt && (
              <div className="mt-3">
                <p className="text-sm text-green-700 mb-2">Your free 8-minute call is booked.</p>
                {!timerRunning ? (
                  <div className="flex items-center gap-3">
                    <button onClick={startTimer} className="px-4 py-2 bg-gold rounded font-semibold">Start Call Now</button>
                    <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Close</button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-mono text-navy">{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</p>
                    <p className="text-sm text-gray-500">Call in progress — free period</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default FreeCallModal;
