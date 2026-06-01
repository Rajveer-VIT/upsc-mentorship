'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heading, PrimaryButton } from '@/components/ui';
import { BookOpen, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';

export default function PracticeQuestionsPage() {
  const [activeTab, setActiveTab] = useState<'prelims' | 'mains'>('prelims');

  const prelimsQuestions = [
    {
      id: 1,
      subject: 'Polity',
      year: '2024 Predictor',
      question: 'With reference to the Parliament of India, consider the following statements:\n1. A bill pending in the Lok Sabha lapses on its prorogation.\n2. A bill pending in the Rajya Sabha, which has not been passed by the Lok Sabha, shall not lapse on dissolution of the Lok Sabha.\nWhich of the statements given above is/are correct?',
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      correctAnswer: 1, // index of option '2 only'
      explanation: 'Statement 1 is incorrect: A bill pending in the Lok Sabha lapses on its dissolution, not prorogation. Statement 2 is correct: Rajya Sabha is a permanent body and bills pending in it do not lapse on Lok Sabha\'s dissolution.'
    },
    {
      id: 2,
      subject: 'Economy',
      year: '2024 Predictor',
      question: 'Which of the following measures is/are likely to reduce the Fiscal Deficit of a government?\n1. Reducing subsidies\n2. Increasing direct tax rates\n3. Implementing developmental welfare schemes\nSelect the correct answer using the code given below:',
      options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
      correctAnswer: 0,
      explanation: 'Reducing subsidies (reduces expenditure) and increasing tax rates (increases revenue) both reduce fiscal deficit. Implementing new welfare schemes increases government spending, increasing the deficit.'
    }
  ];

  const mainsQuestions = [
    {
      id: 1,
      subject: 'History & Culture (GS1)',
      question: 'Assess the impact of the Bhakti movement on the social structure of medieval India, highlighting its role in promoting inclusivity and regional languages.',
      wordLimit: '150 Words',
      marks: '10 Marks',
      modelPoints: [
        'Decentralization of spiritual authority away from orthodox priest class.',
        'Spurred growth of regional vernacular literatures (Marathi, Bengali, Tamil, Hindi).',
        'Emphasis on direct personal devotion, bridging caste and gender divides.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Section */}
      <div className="bg-navy pt-32 pb-20 rounded-b-[3rem] relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-6">
            <Link href="/resources/pyqs" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Resources
            </Link>
            <span>/</span>
            <span className="text-white">Practice Questions</span>
          </div>

          <div className="text-center md:text-left text-white">
            <span className="text-gold font-black uppercase tracking-[0.2em] text-xs mb-4 block">UPSC Predictor series</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Daily Practice Questions (DPQs)
            </h1>
            <p className="text-lg text-white/70 font-medium max-w-2xl">
              Elevate your decision-making and answer-writing accuracy with curated questions designed strictly according to the latest UPSC patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('prelims')}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'prelims'
                ? 'bg-navy text-white shadow-lg'
                : 'bg-white border border-gray-200 text-navy/60 hover:text-navy hover:border-navy'
            }`}
          >
            Prelims (MCQs)
          </button>
          <button
            onClick={() => setActiveTab('mains')}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'mains'
                ? 'bg-navy text-white shadow-lg'
                : 'bg-white border border-gray-200 text-navy/60 hover:text-navy hover:border-navy'
            }`}
          >
            Mains (Descriptive)
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'prelims' ? (
          <div className="space-y-8">
            {prelimsQuestions.map((q) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={q.id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-navy/5 p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-gold/10 text-gold font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                    {q.subject}
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {q.year}
                  </span>
                </div>

                <p className="text-navy font-bold leading-relaxed mb-6 whitespace-pre-line">
                  {q.question}
                </p>

                <div className="space-y-3 mb-8">
                  {q.options.map((option, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-gold hover:bg-gold/5 transition-all text-sm font-medium text-navy flex items-center justify-between group"
                    >
                      <span>
                        <strong className="mr-2">{String.fromCharCode(65 + idx)}.</strong> {option}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Show Answer / Explanation (Simulated interactive/reveal state) */}
                <details className="group border-t border-gray-100 pt-6">
                  <summary className="list-none flex items-center justify-between cursor-pointer text-xs font-black uppercase tracking-widest text-gold hover:text-navy transition-colors select-none">
                    <span>View Detailed Explanation</span>
                    <span className="transition-transform group-open:rotate-180">↓</span>
                  </summary>
                  <div className="mt-4 bg-gray-50 rounded-2xl p-6 text-sm text-gray-600 border border-gray-100">
                    <p className="font-bold text-navy mb-2 flex items-center gap-2">
                      <CheckCircle className="text-emerald-500 w-4 h-4" />
                      Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)}
                    </p>
                    <p className="leading-relaxed font-medium">{q.explanation}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {mainsQuestions.map((q) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={q.id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-navy/5 p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-gold/10 text-gold font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                    {q.subject}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-navy/5 text-navy font-bold px-3 py-1 rounded-full uppercase">
                      {q.wordLimit}
                    </span>
                    <span className="text-[10px] bg-navy/5 text-navy font-bold px-3 py-1 rounded-full uppercase">
                      {q.marks}
                    </span>
                  </div>
                </div>

                <p className="text-navy font-bold text-lg leading-relaxed mb-8">
                  {q.question}
                </p>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-gold text-gold" /> Model Answer Framework
                  </h4>
                  <ul className="space-y-3">
                    {q.modelPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-600 font-medium leading-relaxed">
                        <span className="text-gold font-bold">{idx + 1}.</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA section */}
        <div className="mt-16 bg-gradient-to-br from-navy to-[#112240] rounded-[2rem] p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-2xl font-serif font-bold text-white mb-4">Want personalized evaluations?</h3>
            <p className="text-sm text-gray-300 max-w-md mb-8">
              Get your daily answers reviewed by ex-IAS officers and highly experienced rankers with actionable improvements.
            </p>
            <Link 
              href="/pricing"
              className="bg-gold text-navy font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-white hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              Explore Mentorship Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
