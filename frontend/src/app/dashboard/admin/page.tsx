'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  RefreshCw, 
  Search, 
  Loader2, 
  LogOut, 
  ChevronRight, 
  Grid, 
  Database,
  Lock,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import { logoutAdmin } from '@/lib/auth-utils';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  role: string;
  createdAt: string;
}

interface PaymentData {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  planId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: string;
  createdAt: string;
}

interface CallBookingData {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredTime?: string;
  bookedAt: string;
  durationMinutes: number;
  source?: string;
  createdAt: string;
}

interface ContactInquiryData {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface MentorshipApplicationData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  stage: string;
  goals: string;
  status: string;
  createdAt: string;
}

type ActiveSheet = 'USERS' | 'PAYMENTS' | 'CALLS' | 'INQUIRIES' | 'APPLICATIONS' | 'SETTINGS';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>('USERS');
  
  // Data States
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [calls, setCalls] = useState<CallBookingData[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiryData[]>([]);
  const [applications, setApplications] = useState<MentorshipApplicationData[]>([]);
  
  // Loader & Errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Settings Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const handleLogout = () => {
    logoutAdmin(router);
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_accessToken');
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all collections parallelly
      const [usersRes, paymentsRes, callsRes, inquiriesRes, appsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users`, { headers }),
        fetch(`${API_BASE_URL}/admin/payments`, { headers }),
        fetch(`${API_BASE_URL}/admin/call-bookings`, { headers }),
        fetch(`${API_BASE_URL}/admin/contact-inquiries`, { headers }),
        fetch(`${API_BASE_URL}/admin/mentorship-applications`, { headers })
      ]);

      // Safely parse JSON responses
      const parseJsonSafely = async (res: Response) => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : { success: false, data: [] };
      };

      const [usersData, paymentsData, callsData, inquiriesData, appsData] = await Promise.all([
        parseJsonSafely(usersRes),
        parseJsonSafely(paymentsRes),
        parseJsonSafely(callsRes),
        parseJsonSafely(inquiriesRes),
        parseJsonSafely(appsRes)
      ]);

      if (usersData.success) setUsers(usersData.data);
      if (paymentsData.success) setPayments(paymentsData.data);
      if (callsData.success) setCalls(callsData.data);
      if (inquiriesData.success) setInquiries(inquiriesData.data);
      if (appsData.success) setApplications(appsData.data);

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching dashboard data.');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setSettingsError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSettingsError('New passwords do not match.');
      return;
    }

    setSettingsLoading(true);
    try {
      const token = localStorage.getItem('admin_accessToken');
      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to change password.');
      }

      setSettingsSuccess('Password changed successfully! Keep this password safe.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSettingsError(err.message || 'Error occurred while updating password.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdateStatus = async (type: 'applications' | 'inquiries', id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_accessToken');
      const response = await fetch(`${API_BASE_URL}/admin/${type}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update status.');
      }

      // Refresh locally
      if (type === 'applications') {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      } else {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      }
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // CSV Export utility
  const exportToCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = 'spreadsheet.csv';

    switch (activeSheet) {
      case 'USERS':
        headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'City', 'Role', 'Joined At'];
        rows = users.map(u => [u.id, u.firstName, u.lastName, u.email, u.phoneNumber || '', u.city || '', u.role, u.createdAt]);
        filename = 'upsc_users.csv';
        break;
      case 'PAYMENTS':
        headers = ['ID', 'User Email', 'User Name', 'Plan ID', 'Amount', 'Currency', 'Order ID', 'Payment ID', 'Status', 'Date'];
        rows = payments.map(p => [p.id, p.userEmail, p.userFullName, p.planId, p.amount, p.currency, p.razorpayOrderId, p.razorpayPaymentId || '', p.status, p.createdAt]);
        filename = 'upsc_payments.csv';
        break;
      case 'CALLS':
        headers = ['ID', 'Full Name', 'Phone', 'Email', 'Preferred Time', 'Duration (Mins)', 'Source', 'Booked At'];
        rows = calls.map(c => [c.id, c.fullName, c.phone, c.email || '', c.preferredTime || '', c.durationMinutes, c.source || '', c.createdAt]);
        filename = 'upsc_call_bookings.csv';
        break;
      case 'INQUIRIES':
        headers = ['ID', 'Full Name', 'Email', 'Subject', 'Message', 'Status', 'Submitted At'];
        rows = inquiries.map(i => [i.id, i.fullName, i.email, i.subject, i.message, i.status, i.createdAt]);
        filename = 'upsc_contact_inquiries.csv';
        break;
      case 'APPLICATIONS':
        headers = ['ID', 'Name', 'Phone', 'Email', 'Stage', 'Goals', 'Status', 'Applied At'];
        rows = applications.map(a => [a.id, a.name, a.phone, a.email || '', a.stage, a.goals, a.status, a.createdAt]);
        filename = 'upsc_mentorship_applications.csv';
        break;
      default:
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering based on search
  const getFilteredData = () => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) {
      if (activeSheet === 'USERS') return users;
      if (activeSheet === 'PAYMENTS') return payments;
      if (activeSheet === 'CALLS') return calls;
      if (activeSheet === 'INQUIRIES') return inquiries;
      if (activeSheet === 'APPLICATIONS') return applications;
      return [];
    }

    if (activeSheet === 'USERS') {
      return users.filter(u => 
        u.firstName.toLowerCase().includes(query) || 
        u.lastName.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) || 
        (u.phoneNumber && u.phoneNumber.toLowerCase().includes(query))
      );
    }
    if (activeSheet === 'PAYMENTS') {
      return payments.filter(p => 
        p.userFullName.toLowerCase().includes(query) || 
        p.userEmail.toLowerCase().includes(query) || 
        p.planId.toLowerCase().includes(query) || 
        p.status.toLowerCase().includes(query) ||
        p.razorpayOrderId.toLowerCase().includes(query)
      );
    }
    if (activeSheet === 'CALLS') {
      return calls.filter(c => 
        c.fullName.toLowerCase().includes(query) || 
        c.phone.toLowerCase().includes(query) || 
        (c.email && c.email.toLowerCase().includes(query))
      );
    }
    if (activeSheet === 'INQUIRIES') {
      return inquiries.filter(i => 
        i.fullName.toLowerCase().includes(query) || 
        i.email.toLowerCase().includes(query) || 
        i.subject.toLowerCase().includes(query) || 
        i.message.toLowerCase().includes(query)
      );
    }
    if (activeSheet === 'APPLICATIONS') {
      return applications.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.phone.toLowerCase().includes(query) || 
        (a.email && a.email.toLowerCase().includes(query)) ||
        a.stage.toLowerCase().includes(query) ||
        a.goals.toLowerCase().includes(query)
      );
    }
    return [];
  };

  const filteredData = getFilteredData();

  // Excel Columns for active sheet
  const getColumnHeaders = () => {
    switch (activeSheet) {
      case 'USERS':
        return ['NAME', 'EMAIL', 'PHONE', 'CITY', 'ROLE', 'JOINED DATE'];
      case 'PAYMENTS':
        return ['USER NAME', 'EMAIL', 'PLAN', 'AMOUNT', 'ORDER ID', 'PAYMENT ID', 'STATUS', 'DATE'];
      case 'CALLS':
        return ['CLIENT NAME', 'PHONE', 'EMAIL', 'PREFERRED TIME', 'DURATION', 'SOURCE', 'BOOKED DATE'];
      case 'INQUIRIES':
        return ['SENDER NAME', 'EMAIL', 'SUBJECT', 'MESSAGE CONTENT', 'STATUS', 'SUBMITTED DATE'];
      case 'APPLICATIONS':
        return ['APPLICANT NAME', 'PHONE', 'EMAIL', 'STAGE OF PREP', 'STUDY GOALS', 'STATUS', 'APPLIED DATE'];
      default:
        return [];
    }
  };

  const headers = getColumnHeaders();

  // Calculated Stats
  const totalPaidRevenue = payments
    .filter(p => p.status.toLowerCase() === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const successfulPaymentsCount = payments.filter(p => p.status.toLowerCase() === 'success').length;
  const pendingCallsCount = calls.length; 
  const activeApplicationsCount = applications.filter(a => a.status === 'Pending').length;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 font-sans">
      
      {/* 1. TOP MENU / HEADER BAR */}
      <div className="bg-slate-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                Excel Core
              </span>
              <span className="text-xs text-slate-500 font-mono">v1.2.0</span>
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              UPSC_Mentorship_Database.xlsx
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 active:bg-slate-950 rounded-lg text-xs font-semibold font-mono text-slate-300 transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>RECALCULATE</span>
          </button>
          
          {activeSheet !== 'SETTINGS' && (
            <button
              onClick={exportToCSV}
              disabled={loading || filteredData.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-lg text-xs font-bold font-mono text-white transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT_CSV</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-500/30 hover:border-red-500/60 rounded-lg text-xs font-bold font-mono text-red-400 transition-all shadow-md"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* 2. STATS CELLS (Excel Grid style) */}
      <div className="bg-slate-950/50 p-6 grid grid-cols-2 lg:grid-cols-5 gap-3 border-b border-slate-800 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl shadow-inner">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">CELL A1: TOTAL_USERS</div>
          <div className="text-2xl font-black text-white">{users.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Database Registered
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl shadow-inner">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">CELL B1: REVENUE (INR)</div>
          <div className="text-2xl font-black text-emerald-400">₹{totalPaidRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            From {successfulPaymentsCount} Paid Plans
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl shadow-inner">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">CELL C1: FREE_CALLS_BOOKED</div>
          <div className="text-2xl font-black text-amber-400">{pendingCallsCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Diagnostic Scheduled Calls
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl shadow-inner">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">CELL D1: PENDING_APPS</div>
          <div className="text-2xl font-black text-cyan-400">{activeApplicationsCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Mentorship Applications
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl col-span-2 lg:col-span-1 shadow-inner flex flex-col justify-center">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">CELL E1: INQUIRIES_COUNT</div>
          <div className="text-2xl font-black text-indigo-400">{inquiries.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Total Queries Received
          </div>
        </div>
      </div>

      {/* 3. FORMULA BAR (fx) - Styled Search Bar */}
      {activeSheet !== 'SETTINGS' && (
        <div className="bg-slate-950 px-6 py-2.5 flex items-center border-b border-slate-800 gap-3 font-mono text-xs">
          <span className="text-slate-500 font-bold italic select-none">fx</span>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <span className="text-emerald-500 font-bold tracking-wider select-none">SEARCH_FILTER = </span>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder='Enter keywords (e.g. "Rahul", "Success", "Study")...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 pl-9 pr-4 py-1.5 border border-slate-800/80 hover:border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 placeholder-slate-600 outline-none transition-all shadow-inner font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* 4. SPREADSHEET MAIN BODY CONTAINER */}
      <div className="flex-1 min-h-[450px] overflow-auto relative bg-slate-950 p-6 flex flex-col justify-start">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <span className="font-bold">SYSTEM ERROR:</span> {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 flex-1">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <span className="text-xs font-mono text-slate-500 tracking-widest">LOADING SPREADSHEET CELL CELLS...</span>
          </div>
        ) : activeSheet === 'SETTINGS' ? (
          
          /* PASSWORD & ACCOUNT SETTINGS PANEL */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl font-mono text-xs mt-6"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">UPDATE ADMIN PASSWORD</h3>
                <p className="text-[10px] text-slate-500">Modify hardcoded default password credentials</p>
              </div>
            </div>

            {settingsError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-[11px] font-bold">
                {settingsError}
              </div>
            )}

            {settingsSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                {settingsSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-black tracking-wider mb-1">
                  CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password (e.g. Admin@123)"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-black tracking-wider mb-1">
                  NEW SECURE PASSWORD
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new strong password"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-black tracking-wider mb-1">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm the new password"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-white outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={settingsLoading}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 font-bold uppercase tracking-wider text-white text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {settingsLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>SAVING_CHANGES...</span>
                  </>
                ) : (
                  <span>APPLY PASSWORD CHANGE</span>
                )}
              </button>
            </form>
          </motion.div>

        ) : (
          
          /* ACTIVE SPREADSHEET DATA GRID */
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                
                {/* Column Headers (A, B, C... Row + Field Name Row) */}
                <thead>
                  {/* Grid Letter Row */}
                  <tr className="bg-slate-950 border-b border-slate-800">
                    <th className="px-3 py-1.5 text-center text-[10px] font-bold text-slate-600 bg-slate-950 border-r border-slate-800/80 w-12 select-none">
                      #
                    </th>
                    {headers.map((_, i) => (
                      <th key={i} className="px-4 py-1.5 text-left text-[10px] font-bold text-slate-600 border-r border-slate-800/80 uppercase select-none tracking-widest font-mono">
                        {String.fromCharCode(65 + i)}
                      </th>
                    ))}
                  </tr>
                  
                  {/* Data Labels Row */}
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <th className="px-3 py-3 text-center font-bold bg-slate-950 border-r border-slate-800/80 w-12 text-slate-500 select-none">
                      ROW
                    </th>
                    {headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-bold border-r border-slate-800/80 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Spreadsheet Data Cells */}
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={headers.length + 1} className="px-6 py-12 text-center text-slate-500 font-mono italic">
                        No rows found matching formula = FILTER("{searchTerm}")
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row: any, idx) => (
                      <tr 
                        key={row.id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Excel Row Index Label */}
                        <td className="px-3 py-3 text-center bg-slate-950 border-r border-slate-800 text-slate-500 font-bold select-none w-12 group-hover:text-emerald-500">
                          {idx + 2}
                        </td>
                        
                        {/* Render sheet columns specifically */}
                        {activeSheet === 'USERS' && (
                          <>
                            <td className="px-4 py-3 border-r border-slate-800/50 font-bold text-white font-sans text-sm">
                              {row.firstName} {row.lastName}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300">
                              {row.email}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-400">
                              {row.phoneNumber || '-'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-400">
                              {row.city || '-'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                row.role === 'Admin' 
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                  : row.role === 'Mentor'
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {row.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                          </>
                        )}

                        {activeSheet === 'PAYMENTS' && (
                          <>
                            <td className="px-4 py-3 border-r border-slate-800/50 font-bold text-white font-sans text-sm">
                              {row.userFullName}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300">
                              {row.userEmail}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-cyan-400 font-bold">
                              {row.planId.replace('-', ' ').toUpperCase()}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-emerald-400 font-bold">
                              ₹{row.amount}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500 font-mono text-[10px]">
                              {row.razorpayOrderId}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500 font-mono text-[10px]">
                              {row.razorpayPaymentId || '-'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                row.status.toLowerCase() === 'success' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : row.status.toLowerCase() === 'failed'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                          </>
                        )}

                        {activeSheet === 'CALLS' && (
                          <>
                            <td className="px-4 py-3 border-r border-slate-800/50 font-bold text-white font-sans text-sm">
                              {row.fullName}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300 font-bold">
                              {row.phone}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300">
                              {row.email || '-'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-amber-400 font-bold">
                              {row.preferredTime || '-'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-400">
                              {row.durationMinutes} mins
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-400 font-sans">
                              {row.source || 'Website'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                          </>
                        )}

                        {activeSheet === 'INQUIRIES' && (
                          <>
                            <td className="px-4 py-3 border-r border-slate-800/50 font-bold text-white font-sans text-sm">
                              {row.fullName}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300">
                              {row.email}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-cyan-400 font-bold">
                              {row.subject}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-400 max-w-xs truncate font-sans text-xs">
                              {row.message}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50">
                              <select
                                value={row.status}
                                onChange={(e) => handleUpdateStatus('inquiries', row.id, e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-xs px-2 py-0.5 rounded outline-none text-slate-200 cursor-pointer font-mono"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Ignored">Ignored</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                          </>
                        )}

                        {activeSheet === 'APPLICATIONS' && (
                          <>
                            <td className="px-4 py-3 border-r border-slate-800/50 font-bold text-white font-sans text-sm">
                              {row.name}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300 font-bold">
                              {row.phone}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-300">
                              {row.email || '-'}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-cyan-400 font-sans text-xs">
                              {row.stage}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-400 max-w-xs truncate font-sans text-xs">
                              {row.goals}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50">
                              <select
                                value={row.status}
                                onChange={(e) => handleUpdateStatus('applications', row.id, e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-xs px-2 py-0.5 rounded outline-none text-slate-200 cursor-pointer font-mono"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Enrolled">Enrolled</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 border-r border-slate-800/50 text-slate-500">
                              {formatDate(row.createdAt)}
                            </td>
                          </>
                        )}

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Results Count Summary Row */}
            <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 text-[10px] text-slate-500 font-mono tracking-wider flex items-center justify-between select-none">
              <span>
                FILTERED_ROWS = <strong className="text-white">{filteredData.length}</strong> / {
                  activeSheet === 'USERS' ? users.length :
                  activeSheet === 'PAYMENTS' ? payments.length :
                  activeSheet === 'CALLS' ? calls.length :
                  activeSheet === 'INQUIRIES' ? inquiries.length :
                  activeSheet === 'APPLICATIONS' ? applications.length : 0
                }
              </span>
              <span>CALCULATION_MODE = AUTO</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. EXCEL SPREADSHEET BOTTOM SHEETS TABS */}
      <div className="bg-slate-950 border-t border-slate-800 flex flex-wrap items-stretch select-none overflow-x-auto font-mono text-xs min-h-[44px]">
        {/* Navigation Indicator / Scroll controls placeholder */}
        <div className="px-4 flex items-center justify-center border-r border-slate-800 text-slate-600 bg-slate-950/80">
          <Database className="w-3.5 h-3.5" />
        </div>
        
        {/* Users Tab */}
        <button
          onClick={() => { setActiveSheet('USERS'); setSearchTerm(''); }}
          className={`px-5 py-3 border-r border-slate-800 flex items-center gap-2 hover:bg-slate-900 transition-colors ${
            activeSheet === 'USERS'
              ? 'bg-slate-900 text-emerald-400 font-bold border-t-2 border-t-emerald-500'
              : 'text-slate-500 bg-slate-950'
          }`}
        >
          <span>Sheet1: Users 👥</span>
        </button>

        {/* Payments Tab */}
        <button
          onClick={() => { setActiveSheet('PAYMENTS'); setSearchTerm(''); }}
          className={`px-5 py-3 border-r border-slate-800 flex items-center gap-2 hover:bg-slate-900 transition-colors ${
            activeSheet === 'PAYMENTS'
              ? 'bg-slate-900 text-emerald-400 font-bold border-t-2 border-t-emerald-500'
              : 'text-slate-500 bg-slate-950'
          }`}
        >
          <span>Sheet2: Payments 💳</span>
        </button>

        {/* Call Bookings / Free Calls Tab */}
        <button
          onClick={() => { setActiveSheet('CALLS'); setSearchTerm(''); }}
          className={`px-5 py-3 border-r border-slate-800 flex items-center gap-2 hover:bg-slate-900 transition-colors ${
            activeSheet === 'CALLS'
              ? 'bg-slate-900 text-emerald-400 font-bold border-t-2 border-t-emerald-500'
              : 'text-slate-500 bg-slate-950'
          }`}
        >
          <span>Sheet3: Free Calls 📞</span>
        </button>

        {/* Contact Inquiries Tab */}
        <button
          onClick={() => { setActiveSheet('INQUIRIES'); setSearchTerm(''); }}
          className={`px-5 py-3 border-r border-slate-800 flex items-center gap-2 hover:bg-slate-900 transition-colors ${
            activeSheet === 'INQUIRIES'
              ? 'bg-slate-900 text-emerald-400 font-bold border-t-2 border-t-emerald-500'
              : 'text-slate-500 bg-slate-950'
          }`}
        >
          <span>Sheet4: Inquiries ✉️</span>
        </button>

        {/* Mentorship Applications Tab */}
        <button
          onClick={() => { setActiveSheet('APPLICATIONS'); setSearchTerm(''); }}
          className={`px-5 py-3 border-r border-slate-800 flex items-center gap-2 hover:bg-slate-900 transition-colors ${
            activeSheet === 'APPLICATIONS'
              ? 'bg-slate-900 text-emerald-400 font-bold border-t-2 border-t-emerald-500'
              : 'text-slate-500 bg-slate-950'
          }`}
        >
          <span>Sheet5: Mentorship Apps 📝</span>
        </button>

        {/* Password / Settings Tab */}
        <button
          onClick={() => { setActiveSheet('SETTINGS'); setSearchTerm(''); }}
          className={`px-5 py-3 border-r border-slate-800 flex items-center gap-2 hover:bg-slate-900 transition-colors ml-auto ${
            activeSheet === 'SETTINGS'
              ? 'bg-slate-900 text-emerald-400 font-bold border-t-2 border-t-emerald-500'
              : 'text-slate-500 bg-slate-950'
          }`}
        >
          <span>Sheet6: Settings ⚙️</span>
        </button>
      </div>

    </div>
  );
}
