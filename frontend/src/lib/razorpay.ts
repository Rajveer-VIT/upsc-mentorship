/* eslint-disable @typescript-eslint/no-explicit-any */
export const loadRazorpay = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const openRazorpay = (options: Record<string, unknown>) => {
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
  return rzp;
};
