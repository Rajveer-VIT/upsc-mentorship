/**
 * src/lib/auth-utils.ts
 * Separate logout utilities for users and admins
 */

import { useUserAuth } from '@/store/useUserAuth';
import { useAdminAuth } from '@/store/useAdminAuth';

/**
 * Logout user - only clears user auth
 */
export const logoutUser = (router?: any) => {
  const { clearUserAuth } = useUserAuth.getState();
  clearUserAuth();

  // Clear user-specific cookies
  if (typeof document !== 'undefined') {
    document.cookie = 'user_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }

  if (router) {
    router.push('/login');
  }
};

/**
 * Logout admin - only clears admin auth
 */
export const logoutAdmin = (router?: any) => {
  const { clearAdminAuth } = useAdminAuth.getState();
  clearAdminAuth();

  // Clear admin-specific cookies
  if (typeof document !== 'undefined') {
    document.cookie = 'admin_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }

  if (router) {
    router.push('/admin-login');
  }
};

/**
 * Get user auth token from localStorage
 */
export const getUserToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_accessToken');
  }
  return null;
};

/**
 * Get admin auth token from localStorage
 */
export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_accessToken');
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('user_accessToken');
  }
  return false;
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('admin_accessToken');
  }
  return false;
};
