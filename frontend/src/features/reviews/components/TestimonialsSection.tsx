'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const stories = [
  {
    id: 1,
    name: 'Arjun Mehta',
    title: 'Software Engineer, Bangalore',
    rating: 5,
    quote: "I was scoring 85/200 in mocks for 6 months straight. One session with Eshwar and he immediately spotted my problem — I was reading everything but revising nothing. He gave me a 3-week revision plan and my next mock was 118. That one session was worth more than 6 months of self-study.",
  },
  {
    id: 2,
    name: 'Sai Charan Reddy',
    title: 'Hyderabad',
    rating: 5,
    quote: "I was nearly giving up on UPSC. After one session with Eshwar — I felt completely different. He didn't just talk about syllabus, he talked about my mindset. Now I study 4 hours daily without feeling burnt out. Thank you anna.",
  },
  {
    id: 3,
    name: 'Ankita Sharma',
    title: 'Delhi',
    rating: 5,
    quote: "I thought PYQ solving was just practice. Eshwar showed me that PYQs are a pattern — a tool to understand what UPSC wants to ask. He gave me a framework for the last 10 years of Prelims PYQs. Now I can see patterns directly. Game changer.",
  },
  {
    id: 4,
    name: 'Vikram Nair',
    title: 'Chennai',
    rating: 5,
    quote: "My Mains answers were long but scoring low. Eshwar reviewed 5 of my answers and showed me exactly why — I was narrating, not analysing. He gave me a structure: Context → Analysis → Multi-dimensional view → Way forward. My next evaluated answers scored 30% better.",
  },
  {
    id: 5,
    name: 'Bhavana Lakshmi',
    title: 'Vijayawada',
    rating: 5,
    quote: "Eshwar taught me Geography shortcuts — how to connect maps, how to link static topics with current affairs. Content I used to forget in 2 hours now I retain in 30 minutes. His techniques are practical, not bookish.",
  },
  {
    id: 6,
    name: 'Rohan Desai',
    title: 'Product Manager, Pune',
    rating: 5,
    quote: "I work 9 hours a day. Eshwar didn't give me a generic plan — he built one around my actual schedule. 6am current affairs, lunch break revision, 10pm static GS. Three months in and I've covered more syllabus than the previous one year.",
  },
  {
    id: 7,
    name: 'Ritu Pandey',
    title: 'Lucknow',
    rating: 5,
    quote: "Sociology optional confused me — thinkers, theories, all seemed the same. Eshwar gave me a mind-map framework — connect thinker to their era, link theory to real-life examples. I don't memorize anymore, I actually understand it.",
  },
  {
    id: 8,
    name: 'Kiran Babu',
    title: 'Tirupati',
    rating: 5,
    quote: "I've known Eshwar personally for years. I was skeptical at first — could a friend really teach me? After our first session, I stopped being skeptical. The depth of his UPSC knowledge is real. He knows this exam inside out. Best decision I made.",
  },
  {
    id: 9,
    name: 'Deepak Mishra',
    title: 'Bhopal',
    rating: 5,
    quote: "Polity was my weakest subject. Eshwar gave me a trick — remember Constitution articles through news events. When SC judgment comes out, the article automatically comes to mind. In 3 weeks my Polity became strong. Such practical tips aren't in any coaching.",
  },
  {
    id: 10,
    name: 'Naveen Kumar',
    title: 'Warangal',
    rating: 5,
    quote: "I didn't know how to prepare for GS Mains. Eshwar showed me PYQ trends — which topics repeat, which angles UPSC asks from. He taught me how to view a topic from 360 degrees. Now I study with UPSC's mindset, not just the syllabus. Big difference.",
  },
  {
    id: 11,
    name: 'Sneha Iyer',
    title: 'Kochi',
    rating: 5,
    quote: "I was in my third year and completely burnt out. I almost quit. A friend suggested I talk to Eshwar. He spent the first 20 minutes just listening. Then helped me restructure — smaller goals, realistic targets, rest built in. I'm preparing again with genuine motivation. He saved my journey.",
  },
  {
    id: 12,
    name: 'Kavita Singh',
    title: 'Kanpur',
    rating: 5,
    quote: "I read newspapers 2 hours daily but still got current affairs questions wrong. Eshwar taught me — don't just read, understand UPSC's angle. He gave me a filter system — which news for Prelims, which for Mains, which to skip. Now 45 minutes suffice. Life changing.",
  },
  {
    id: 13,
    name: 'Rahul Krishnan',
    title: 'Hyderabad',
    rating: 5,
    quote: "Eshwar taught me something nobody else did — don't just solve PYQs, reverse engineer them. Why did UPSC ask this? Which syllabus part? What concept is being tested? My Prelims elimination technique became razor sharp. Went from 60% accuracy to 78% in mocks.",
  },
  {
    id: 14,
    name: 'Padmavathi Rao',
    title: 'Guntur',
    rating: 5,
    quote: "I took Eshwar's monthly mentorship package. Every session I learn something new. He tracks my progress, corrects mistakes, reminds me why I started. Big institutes treat you as a roll number. Here I'm Padmavathi — he knows exactly where I stand every week. That personal attention is priceless.",
  }
];

export const TestimonialsSection = () => {
  const [showAll, setShowAll] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="proven-results">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 max-w-3xl"
        >
          <span className="text-gold font-black uppercase tracking-[0.2em] text-xs mb-4 block">Proven Results</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-navy mb-6 leading-tight">
            Success Leaves <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-dark to-gold italic">Clues</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-xl">
            Learn from aspirants who transformed their preparation with UPSC with Eshwar. These aren't just testimonials; they are blueprints of perseverance.
          </p>
        </motion.div>

        {/* Testimonials Grid - 5 or All Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showAll ? 'all' : 'initial'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 md:grid-cols-2 ${showAll ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-6`}
          >
            {stories.slice(0, showAll ? stories.length : 5).map((story) => (
              <motion.div
                key={story.id}
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-lg shadow-navy/10 border border-gray-100 p-6 hover:shadow-xl hover:shadow-navy/15 transition-all duration-300 flex flex-col"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">
                  "{story.quote}"
                </p>

                {/* Author Info */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-bold text-navy text-sm">{story.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{story.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-16"
        >
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-gold text-white font-bold rounded-full hover:bg-gold-dark transition-colors duration-300"
          >
            {showAll ? 'Show Less' : `See All ${stories.length} Testimonials`}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
