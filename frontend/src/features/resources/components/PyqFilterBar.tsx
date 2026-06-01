'use client';

import React from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';

export const PyqFilterBar = () => {
  return (
    <div className="space-y-10 mb-12">

      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-bold text-navy">
            Important Links of UPSC Resources
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://lotusarise.com/upsc/upsc-optional-subjects/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl border border-gray-100 hover:border-gold hover:shadow-lg transition-all"
          >
            <h3 className="font-bold text-lg text-navy">
              UPSC Optional Subjects
            </h3>
          </a>

          <a
            href="https://primusias.com/sociology-pyq-and-topic-wise-analysis/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl border border-gray-100 hover:border-gold hover:shadow-lg transition-all"
          >
            <h3 className="font-bold text-lg text-navy">
              Sociology PYQ Analysis
            </h3>
          </a>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-[2rem] p-8 text-center">
        <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />

        <h2 className="text-3xl font-bold text-navy mb-3">
          Follow For More Resources
        </h2>

        <p className="text-gray-700 mb-6">
          Join UPSC WITH ESHWAR WhatsApp Channel
        </p>

        <a
          href="https://whatsapp.com/channel/0029VbCyspNEKyZ85dyVHw1Q"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Join WhatsApp Channel
        </a>
      </div>
    </div>
  );
};