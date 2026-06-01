"use client";

import React from "react";
import { motion } from "framer-motion";
import { MentorshipForm } from "./MentorshipForm";
import FreeCallModal from "./FreeCallModal";

const MissionCard = ({
  title,
  subtitle,
  description,
  tagline,
  delay,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8 }}
    className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <p className="text-xs uppercase tracking-[0.25em] text-amber-500 font-bold mb-4">
      {tagline}
    </p>

    <h3 className="text-3xl font-bold text-slate-900 mb-2">
      {title}
    </h3>

    <h4 className="text-xl font-semibold text-slate-700 mb-4">
      {subtitle}
    </h4>

    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export const HeroSection = () => {
  return (
    <section className="relative py-20 bg-[#F8F6F1] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-10 gap-12 items-start">

          {/* Left Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <MentorshipForm />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6">

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-14"
            >
              <p className="uppercase tracking-[0.3em] text-amber-500 font-bold text-sm mb-6">
                PRIVATE UPSC MENTORSHIP
              </p>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 mb-6">
                UPSC with{" "}
                <span className="text-amber-500">
                  Eshwar
                </span>
              </h1>

              <p className="text-2xl md:text-3xl italic text-slate-700 font-semibold mb-8">
                "Clarity Over Confusion. Strategy Over Struggle."
              </p>

              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                A premium one-to-one UPSC mentorship program designed for
                serious aspirants who want clarity, accountability, and a
                proven strategy to crack the Civil Services Examination.
              </p>
            </motion.div>

            {/* Mission Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <MissionCard
                tagline="OUR MISSION"
                title="Empower"
                subtitle="Every Aspirant"
                description="Empower every serious aspirant with a clear roadmap, focused preparation and expert guidance."
                delay={0}
              />

              <MissionCard
                tagline="OUR VISION"
                title="No One"
                subtitle="Should Lose Years"
                description="No aspirant should waste valuable years because of poor strategy or lack of mentorship."
                delay={0.15}
              />

              <MissionCard
                tagline="OUR PROMISE"
                title="Personalised"
                subtitle="Honest & Real"
                description="Personal mentorship tailored to your strengths, weaknesses and preparation stage."
                delay={0.3}
              />
            </div>

            {/* Bottom Features */}
            <div className="border-t border-slate-200 pt-12">
              <div className="grid md:grid-cols-3 gap-8">

                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    No Shortcuts
                  </h4>
                  <p className="text-slate-600">
                    Only proven strategies that work.
                  </p>
                </div>

                <div className="text-center">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    No Noise
                  </h4>
                  <p className="text-slate-600">
                    Focus only on what truly matters.
                  </p>
                </div>

                <div className="md:text-right">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Complete Clarity
                  </h4>
                  <p className="text-slate-600">
                    Every step of your UPSC journey.
                  </p>
                </div>

              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-500 font-medium">
                upscwitheshwar.com
              </p>
            </div>

          </div>
        </div>
      </div>

      <FreeCallModal />
    </section>
  );
};