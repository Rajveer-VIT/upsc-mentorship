'use client';

import React, { useState, useMemo } from 'react';
import { PyqFilterBar } from '@/features/resources/components/PyqFilterBar';
import { PyqCard } from '@/features/resources/components/PyqCard';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import Link from 'next/link';

// Mock Data Structure
const mockPyqs = [
  {
    id: '1',
    year: 2023,
    subject: 'General Studies',
    examType: 'Prelims' as const,
    title: 'UPSC CSE Prelims GS Paper 1',
    file: '/documents/2025 prelims paper 1.pdf',
  },
  {
    id: '2',
    year: 2023,
    subject: 'CSAT',
    examType: 'Prelims' as const,
    title: 'UPSC CSE Prelims GS Paper 2 (CSAT)',
    file: '/documents/2026 prelims key.pdf',
  },
  {
    id: '3',
    year: 2023,
    subject: 'Essay',
    examType: 'Mains' as const,
    title: 'UPSC CSE Mains Essay Paper',
    file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf',
  },
  {
    id: '4',
    year: 2023,
    subject: 'General Studies',
    examType: 'Mains' as const,
    title: 'UPSC CSE Mains GS Paper 1',
    file: '/documents/Paper 1.pdf',
  },
  {
    id: '5',
    year: 2023,
    subject: 'General Studies',
    examType: 'Mains' as const,
    title: 'UPSC CSE Mains GS Paper 2',
    file: '/documents/Paper 2.pdf',
  },
  {
    id: '6',
    year: 2023,
    subject: 'Public Administration',
    examType: 'Optional' as const,
    title: 'Public Administration Paper I',
    file: '/documents/Public_Ad_I_de70568d1f.pdf',
  },
  {
    id: '7',
    year: 2022,
    subject: 'Public Administration',
    examType: 'Optional' as const,
    title: 'Public Administration Paper II',
    file: '/documents/Public_Ad_II_09425cde01.pdf',
  },
  {
    id: '8',
    year: 2022,
    subject: 'General Studies',
    examType: 'Mains' as const,
    title: 'UPSC CSE Mains GS Paper 3',
    file: '/documents/Paper 1 (1).pdf',
  },
  {
    id: '9',
    year: 2021,
    subject: 'PSIR',
    examType: 'Optional' as const,
    title: 'PSIR Paper 1',
    file: '/documents/upsc-ias-previous-year-paper-2016-mains-psir-paper-1-db2db77d.pdf',
  },
  {
    id: '10',
    year: 2021,
    subject: 'Sociology',
    examType: 'Optional' as const,
    title: 'Sociology Paper 2',
    file: '/documents/upsc-ias-previous-year-paper-2016-mains-sociology-paper-2-e3be1096.pdf',
  },
  {
    id: '11',
    year: 2021,
    subject: 'Geography',
    examType: 'Optional' as const,
    title: 'Geography Paper 2',
    file: '/documents/upsc-ias-previous-year-paper-2016-mains-geography-paper-2-92809ffd.pdf',
  },
  {
    id: '12',
    year: 2021,
    subject: 'Commerce',
    examType: 'Optional' as const,
    title: 'Commerce & Accountancy Paper 1',
    file: '/documents/upsc-ias-previous-year-paper-2016-mains-commerce-accountancy-paper-1-09bf08f7.pdf',
  },
];

export default function PyqsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredPyqs = useMemo(() => {
    return mockPyqs.filter((pyq) => {
      const matchesSearch = pyq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pyq.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = selectedYear === 'All' || pyq.year.toString() === selectedYear;
      const matchesType = selectedType === 'All' || pyq.examType === selectedType;
      const matchesSubject = selectedSubject === 'All' || pyq.subject === selectedSubject;

      return matchesSearch && matchesYear && matchesType && matchesSubject;
    });
  }, [searchQuery, selectedYear, selectedType, selectedSubject]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Section */}
      <div className="bg-navy pt-32 pb-20 rounded-b-[3rem] relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left text-white">
            <span className="text-gold font-black uppercase tracking-[0.2em] text-xs mb-4 block">Free Resources</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
              UPSC Previous Year Questions
            </h1>
            <p className="text-lg text-white/70 font-medium max-w-2xl">
              Access, view, and download year-wise UPSC CSE Prelims, Mains, and Optional question papers to supercharge your preparation.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/*  1. Featured PYQ Card Section 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-navy/10 border border-gray-100 p-6 sm:p-10 mb-20 overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10 transition-transform group-hover:scale-110 duration-700" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block bg-gold/10 text-gold font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-4">
                Featured Resource
              </div>
              <h2 className="text-3xl font-serif font-bold text-navy mb-4">
                Prelims Mastery PYQs Sample
              </h2>
              <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
                A curated selection of the most repeated and conceptually dense Prelims questions from the past 10 years. Complete with detailed explanations and elimination strategies.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-navy text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gold hover:shadow-lg transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Get Free Sample
                </button>
                <button className="bg-white border-2 border-gray-200 text-navy px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:border-navy transition-all flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Preview
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative rounded-2xl overflow-hidden shadow-xl aspect-video border-4 border-gray-50 group-hover:shadow-2xl transition-all">
              <img
                src="https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&q=80&w=1000&h=600"
                alt="Prelims Mastery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay styling for premium feel 
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 text-white">
          <span className="font-bold block">10-Year Compilation</span>
          <span className="text-xs text-white/80">With Explanations</span>
        </div>
      </div>
    </div>
        </motion.div >*/}


        {/* 2. Main PYQs Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-navy mb-2">Paper Archive</h2>
          <p className="text-gray-500">download papers.</p>
        </div>

        <PyqFilterBar />

        {
          filteredPyqs.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
            >
              {filteredPyqs.map((pyq) => (
                <PyqCard key={pyq.id} {...pyq} />
              ))}
            </motion.div>
          ) : (
            <div className="bg-white p-16 rounded-[2rem] text-center shadow-lg border border-gray-100 mb-24">
              <h3 className="text-2xl font-serif font-bold text-navy mb-2">No Papers Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchQuery(''); setSelectedYear('All'); setSelectedType('All'); setSelectedSubject('All');
                }}
                className="mt-6 text-gold font-bold uppercase tracking-widest text-sm hover:text-navy transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )
        }

        {/* 3. Practice Questions Redirect Section 
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden group shadow-2xl shadow-navy/20"
        >
          {/* Premium Gradient Background 
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#112240] to-navy z-0" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl z-0 transition-transform group-hover:scale-110 duration-1000" />

          <div className="relative z-10 p-12 md:p-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold mb-8">
              <BookOpen className="w-8 h-8" />
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight max-w-3xl">
              Ready to test your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">knowledge?</span>
            </h2>

            <p className="text-lg text-gray-300 font-medium max-w-2xl mb-10">
              Access all PYQs and our curated, strictly UPSC-level practice question bank in one place. Simulate the real exam environment today.
            </p>

            <Link
              href="/resources/practice-questions"
              className="inline-flex items-center gap-3 bg-gold text-navy px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] transition-all"
            >
              Practice More Questions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>*/}

      </div >
    </div >
  );
}
