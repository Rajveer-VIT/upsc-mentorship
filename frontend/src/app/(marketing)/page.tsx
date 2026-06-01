import React from 'react';
import { HeroSection } from '@/features/home/components/HeroSection';
import { TrustedBySection } from '@/features/home/components/TrustedBySection';
import { FeaturesSection } from '@/features/home/components/FeaturesSection';
import { PlatformDescriptionSection } from '@/features/home/components/PlatformDescriptionSection';
import { TestimonialsSection } from '@/features/reviews/components/TestimonialsSection';
import { PricingSection } from '@/features/pricing/components/PricingSection';
import { CtaSection } from '@/features/home/components/CtaSection';

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <PlatformDescriptionSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
    </>
  );
}
