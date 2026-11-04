import { API_BASE_URL } from './constants';

export interface OrderDto {
  id: string; orderNumber: string; status: string; subtotal: number; shippingFee: number; total: number;
  createdAt: string; paidAt?: string; cancelledAt?: string; cancelReason?: string; refundId?: string; shippedAt?: string; deliveredAt?: string; courier?: string; trackingNumber?: string;
  customer: string; customerEmail: string;
  address: { shipName: string; shipPhone: string; shipLine1: string; shipLine2?: string; shipCity: string; shipState: string; shipPincode: string };
  items: { bookId: string; title: string; unitPrice: number; quantity: number; imageUrl: string }[];
}

/** Opens the server-rendered invoice in a new tab (user can print / save as PDF). */
export async function openInvoice(orderId: string, auth: 'user' | 'admin' = 'user') {
  const win = window.open('', '_blank');
  const token = localStorage.getItem(auth === 'admin' ? 'admin_accessToken' : 'user_accessToken');
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, { headers: { Authorization: `Bearer ${token}` } });
  const html = await res.text();
  if (!win) return;
  win.document.open();
  win.document.write(res.ok ? html : `<p style="font-family:sans-serif">${JSON.parse(html || '{}').message ?? 'Invoice unavailable'}</p>`);
  win.document.close();
}

