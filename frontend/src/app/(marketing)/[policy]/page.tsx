import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const EMAIL = 'upscwitheshwar@gmail.com';
const UPDATED = '4 November 2026';

type Section = [heading: string, body: string];
const POLICIES: Record<string, { title: string; sections: Section[] }> = {
  terms: {
    title: 'Terms of Service',
    sections: [
      ['Acceptance', 'By using upscwitheshwar.com ("UPSC with Eshwar") you agree to these terms. If you do not agree, please do not use the website.'],
      ['Services', 'We provide UPSC mentorship programs, study plans, resources and a book store. Mentorship outcomes depend on your own effort; we do not guarantee selection in any examination.'],
      ['Accounts', 'You are responsible for keeping your login credentials confidential and for all activity under your account. Provide accurate name, email, phone and delivery details.'],
      ['Payments', 'All prices are in Indian Rupees (INR). Payments are processed securely by Razorpay. We never store your card or UPI details.'],
      ['Content', 'Study material, videos and documents shared in mentorship programs are for your personal use only and may not be copied, resold or redistributed.'],
      ['Changes', 'We may update these terms from time to time. Continued use of the website after changes means you accept the updated terms.'],
      ['Governing law', 'These terms are governed by the laws of India. Disputes are subject to the jurisdiction of courts in Hyderabad, Telangana.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['What we collect', 'Name, email, phone number, delivery address, and order/payment references needed to provide mentorship and deliver books. Payment details are collected directly by Razorpay, not by us.'],
      ['How we use it', 'To create your account, deliver services and books, send order confirmations, invoices and important updates, and respond to your queries.'],
      ['Sharing', 'We share data only with service providers needed to run the service (Razorpay for payments, courier partners for delivery, email providers). We never sell your data.'],
      ['Security', 'Passwords are stored hashed, connections are encrypted, and access to data is restricted to authorised staff.'],
      ['Your rights', `You can ask us to access, correct or delete your personal data by writing to ${EMAIL}.`],
    ],
  },
  refund: {
    title: 'Cancellation & Refund Policy',
    sections: [
      ['Books — before shipping', 'You can cancel a book order from My Orders any time before it is shipped. A full refund is initiated immediately to the original payment method.'],
      ['Books — damaged or wrong item', `If you receive a damaged, defective or wrong book, email ${EMAIL} within 7 days of delivery with photos and your order number. We will send a replacement or issue a full refund.`],
      ['Mentorship plans', `Mentorship plans and study blueprints are digital services. Refund requests made within 48 hours of purchase, before any session or material is delivered, are fully refunded. After that, plans are non-refundable.`],
      ['Duplicate or failed payments', 'If money was debited but your order or plan was not confirmed, the amount is refunded automatically.'],
      ['Refund timeline', 'Approved refunds are credited to the original payment method within 5–7 working days, depending on your bank.'],
    ],
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    sections: [
      ['Coverage', 'We deliver across India through trusted courier partners and India Post.'],
      ['Dispatch & delivery time', 'Orders are dispatched within 1–2 working days. Delivery usually takes 3–7 working days depending on your location.'],
      ['Shipping charges', 'Free delivery on orders of ₹499 and above. A flat ₹49 delivery charge applies to smaller orders.'],
      ['Tracking', 'Once shipped, you receive the courier name and tracking number by email and in My Orders.'],
      ['Invoice', 'A GST invoice (books are GST-exempt under HSN 4901) is available in My Orders after payment and is emailed on delivery.'],
    ],
  },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }): Promise<Metadata> {
  const { policy } = await params;
  return { title: `${POLICIES[policy]?.title ?? 'Policy'} | UPSC with Eshwar` };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const p = POLICIES[policy];
  if (!p) notFound();

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-32 pb-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy">{p.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {UPDATED}</p>
        <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
          {p.sections.map(([h, body]) => (
            <section key={h}>
              <h2 className="text-lg font-bold text-navy">{h}</h2>
              <p className="mt-1.5 text-slate-600 leading-relaxed">{body}</p>
            </section>
          ))}
          <p className="border-t border-slate-100 pt-6 text-sm text-slate-500">
            Questions? Email <a href={`mailto:${EMAIL}`} className="text-gold font-semibold">{EMAIL}</a>.
          </p>
        </div>
      </article>
    </div>
  );
}
