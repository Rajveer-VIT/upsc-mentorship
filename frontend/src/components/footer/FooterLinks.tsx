'use client';

import React from 'react';
import Link from 'next/link';

export const FooterLinks = () => {
  const sections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Mentorship', href: '/#mentorship' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'UPSC PYQs', href: '/resources/pyqs' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Refund Policy', href: '/refund' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6 opacity-60">
            {section.title}
          </h4>
          <ul className="space-y-4">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-gold transition-colors text-sm font-medium inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
