'use client';

import { create } from 'zustand';

export interface AdminAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  adminId: string | null;
  email: string | null;
  fullName: string | null;
  username: string | null;
  isLoading: boolean;

  // Actions
  setAdminAuth: (data: {
    accessToken: string;
    refreshToken: string;
    adminId: string;
    email: string;
    fullName: string;
    username: string;
  }) => void;

  getAdminAuth: () => void;
  clearAdminAuth: () => void;
}

export const useAdminAuth = create<AdminAuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  adminId: null,
  email: null,
  fullName: null,
  username: null,
  isLoading: true,

  setAdminAuth: (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_accessToken', data.accessToken);
      localStorage.setItem('admin_refreshToken', data.refreshToken);
      localStorage.setItem('admin_id', data.adminId);
      localStorage.setItem('admin_email', data.email);
      localStorage.setItem('admin_fullName', data.fullName);
      localStorage.setItem('admin_username', data.username);
    }
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      adminId: data.adminId,
      email: data.email,
      fullName: data.fullName,
      username: data.username,
    });
  },

  getAdminAuth: () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('admin_accessToken');
      const refreshToken = localStorage.getItem('admin_refreshToken');
      const adminId = localStorage.getItem('admin_id');
      const email = localStorage.getItem('admin_email');
      const fullName = localStorage.getItem('admin_fullName');
      const username = localStorage.getItem('admin_username');

      set({
        accessToken,
        refreshToken,
        adminId,
        email,
        fullName,
        username,
        isLoading: false,
      });
    }
  },

  clearAdminAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_accessToken');
      localStorage.removeItem('admin_refreshToken');
      localStorage.removeItem('admin_id');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_fullName');
      localStorage.removeItem('admin_username');
    }
    set({
      accessToken: null,
      refreshToken: null,
      adminId: null,
      email: null,
      fullName: null,
      username: null,
    });
  },
}));
