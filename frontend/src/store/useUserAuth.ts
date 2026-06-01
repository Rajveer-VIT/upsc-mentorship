'use client';

import { create } from 'zustand';

export interface UserAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  role: string | null;
  isLoading: boolean;

  // Actions
  setUserAuth: (data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    fullName: string;
    role: string;
  }) => void;

  getUserAuth: () => void;
  clearUserAuth: () => void;
}

export const useUserAuth = create<UserAuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,
  email: null,
  fullName: null,
  role: null,
  isLoading: true,

  setUserAuth: (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_accessToken', data.accessToken);
      localStorage.setItem('user_refreshToken', data.refreshToken);
      localStorage.setItem('user_id', data.userId);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_fullName', data.fullName);
      localStorage.setItem('user_role', data.role);
    }
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    });
  },

  getUserAuth: () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('user_accessToken');
      const refreshToken = localStorage.getItem('user_refreshToken');
      const userId = localStorage.getItem('user_id');
      const email = localStorage.getItem('user_email');
      const fullName = localStorage.getItem('user_fullName');
      const role = localStorage.getItem('user_role');

      set({
        accessToken,
        refreshToken,
        userId,
        email,
        fullName,
        role,
        isLoading: false,
      });
    }
  },

  clearUserAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_accessToken');
      localStorage.removeItem('user_refreshToken');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_fullName');
      localStorage.removeItem('user_role');
    }
    set({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      fullName: null,
      role: null,
    });
  },
}));
