import { create } from 'zustand';

type MentorshipState = {
  isSubmitting: boolean;
  isSuccess: boolean;
  setSubmitting: (status: boolean) => void;
  setSuccess: (status: boolean) => void;
  reset: () => void;
};

export const useMentorshipStore = create<MentorshipState>((set) => ({
  isSubmitting: false,
  isSuccess: false,
  setSubmitting: (status) => set({ isSubmitting: status }),
  setSuccess: (status) => set({ isSuccess: status }),
  reset: () => set({ isSubmitting: false, isSuccess: false }),
}));
