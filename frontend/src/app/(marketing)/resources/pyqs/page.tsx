'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const prelimsData = [
  { year: 2026, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2025, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2024, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2023, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2022, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2021, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2020, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2019, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2018, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2017, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2016, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
  { year: 2015, gs: '/documents/2025 prelims paper 1.pdf', csat: '/documents/2026 prelims key.pdf' },
];

const mainsData = [
  {
    year: 2025,
    papers: [
      { label: 'UPSC Mains GS Paper 1', file: '/documents/Paper 1.pdf' },
      { label: 'UPSC Mains GS Paper 2', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains GS Paper 3', file: '/documents/Paper 1 (1).pdf' },
      { label: 'UPSC Mains GS Paper 4', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains Essay Paper', file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf' },
    ],
  },
  {
    year: 2024,
    papers: [
      { label: 'UPSC Mains GS Paper 1', file: '/documents/Paper 1.pdf' },
      { label: 'UPSC Mains GS Paper 2', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains GS Paper 3', file: '/documents/Paper 1 (1).pdf' },
      { label: 'UPSC Mains GS Paper 4', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains Essay Paper', file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf' },
    ],
  },
  {
    year: 2023,
    papers: [
      { label: 'UPSC Mains GS Paper 1', file: '/documents/Paper 1.pdf' },
      { label: 'UPSC Mains GS Paper 2', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains GS Paper 3', file: '/documents/Paper 1 (1).pdf' },
      { label: 'UPSC Mains GS Paper 4', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains Essay Paper', file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf' },
    ],
  },
  {
    year: 2022,
    papers: [
      { label: 'UPSC Mains GS Paper 1', file: '/documents/Paper 1.pdf' },
      { label: 'UPSC Mains GS Paper 2', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains GS Paper 3', file: '/documents/Paper 1 (1).pdf' },
      { label: 'UPSC Mains GS Paper 4', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains Essay Paper', file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf' },
    ],
  },
  {
    year: 2021,
    papers: [
      { label: 'UPSC Mains GS Paper 1', file: '/documents/Paper 1.pdf' },
      { label: 'UPSC Mains GS Paper 2', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains GS Paper 3', file: '/documents/Paper 1 (1).pdf' },
      { label: 'UPSC Mains GS Paper 4', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains Essay Paper', file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf' },
    ],
  },
  {
    year: 2020,
    papers: [
      { label: 'UPSC Mains GS Paper 1', file: '/documents/Paper 1.pdf' },
      { label: 'UPSC Mains GS Paper 2', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains GS Paper 3', file: '/documents/Paper 1 (1).pdf' },
      { label: 'UPSC Mains GS Paper 4', file: '/documents/Paper 2.pdf' },
      { label: 'UPSC Mains Essay Paper', file: '/documents/UPSC_Essay_Paper_2021_57078e238c.pdf' },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single PDF download card */
const PdfCard = ({ label, file }: { label: string; file: string }) => (
  <a
    href={file}
    download
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10
               rounded-xl px-4 py-3 hover:border-gold/50 hover:shadow-md hover:shadow-gold/10
               transition-all duration-200 group flex-1 min-w-[200px]"
  >
    {/* PDF Icon */}
    <div className="flex-shrink-0 w-9 h-10 bg-red-500 rounded-md flex flex-col items-center justify-center shadow-sm">
      <span className="text-white font-black text-[8px] leading-none">PDF</span>
      <FileText className="w-3.5 h-3.5 text-white/80 mt-0.5" />
    </div>

    {/* Label */}
    <span className="flex-1 text-sm font-semibold text-navy dark:text-white/90 leading-tight">
      {label}
    </span>

    {/* Download Button */}
    <div className="flex-shrink-0 w-9 h-9 bg-gold rounded-lg flex items-center justify-center
                    shadow-md shadow-gold/20 group-hover:scale-110 transition-transform duration-200">
      <Download className="w-4 h-4 text-navy" strokeWidth={2.5} />
    </div>
  </a>
);

/** One year row for Prelims table */
const PrelimRow = ({
  year,
  gs,
  csat,
  index,
}: {
  year: number;
  gs: string;
  csat: string;
  index: number;
}) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-slate-200 dark:border-white/10 last:border-0"
  >
    {/* Year cell */}
    <td className="py-4 px-6 w-24 align-middle">
      <span className="text-2xl font-black text-navy dark:text-white">{year}</span>
    </td>

    {/* Papers cell */}
    <td className="py-4 px-4">
      <div className="flex flex-wrap gap-3">
        <PdfCard label="GS Paper" file={gs} />
        <PdfCard label="CSAT" file={csat} />
      </div>
    </td>
  </motion.tr>
);

/** One year block for Mains table */
const MainsRow = ({
  year,
  papers,
  index,
}: {
  year: number;
  papers: { label: string; file: string }[];
  index: number;
}) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-slate-200 dark:border-white/10 last:border-0"
  >
    <td className="py-5 px-6 w-24 align-top">
      <span className="text-2xl font-black text-navy dark:text-white">{year}</span>
    </td>
    <td className="py-5 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {papers.map((p) => (
          <PdfCard key={p.label} label={p.label} file={p.file} />
        ))}
      </div>
    </td>
  </motion.tr>
);

/** Collapsible section wrapper */
const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-14">
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-6 group text-left"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy dark:text-white group-hover:text-gold transition-colors">
            {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-cream/50 mt-1">{subtitle}</p>
        </div>
        <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-cream/50 group-hover:border-gold group-hover:text-gold transition-all flex-shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm"
        >
          <table className="w-full border-collapse">{children}</table>
        </motion.div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PyqsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy pb-24">
      {/* Hero Header */}
      <div className="bg-navy pt-32 pb-20 rounded-b-[3rem] relative overflow-hidden mb-14">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-gold font-black uppercase tracking-[0.25em] text-[10px] mb-4 block">
            Free Resources
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            UPSC Previous Year{' '}
            <span className="text-gold italic">Question Papers</span>
          </h1>
          <p className="text-white/60 text-lg font-light max-w-2xl mx-auto">
            Download year-wise Prelims & Mains PYQs — free, fast, and organised.
            Last 10+ years covered.
          </p>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { value: '12+', label: 'Years Covered' },
              { value: '100+', label: 'Papers Available' },
              { value: 'Free', label: 'No Sign-up Needed' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-center"
              >
                <p className="text-gold font-black text-xl">{stat.value}</p>
                <p className="text-white/50 text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── PRELIMS SECTION ── */}
        <Section
          title="Last 10+ Years UPSC Prelims Question Papers PDF"
          subtitle="General Studies Paper 1 (GS) & Paper 2 (CSAT) — year-wise download"
        >
          <tbody>
            {prelimsData.map((row, i) => (
              <PrelimRow key={row.year} {...row} index={i} />
            ))}
          </tbody>
        </Section>

        {/* ── MAINS SECTION ── */}
        <Section
          title="UPSC Mains Previous Year Question Papers"
          subtitle="GS Paper 1–4 & Essay — year-wise download"
        >
          <tbody>
            {mainsData.map((row, i) => (
              <MainsRow key={row.year} {...row} index={i} />
            ))}
          </tbody>
        </Section>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-navy rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-3">
              Want More?
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
              Practice with Live Mock Questions
            </h3>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-8">
              Test yourself with our curated UPSC-level practice bank — detailed explanations included.
            </p>
            <Link
              href="/resources/practice-questions"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-gold/30"
            >
              Start Practicing Free
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
