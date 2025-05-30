import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyStat {
  date: string;
  steps: number;
  caloriesBurned: number;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  birthday?: string;
  profileImage?: string;
  image?: string;
}

interface AppStore {
  // User data
  user: User;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string | null) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Health metrics
  stepsToday: number;
  caloriesToday: number;
  weeklyStats: DailyStat[];
  updateSteps: (steps: number) => void;
  updateCalories: (calories: number) => void;
  setWeeklyStats: (stats: DailyStat[]) => void;

  // Network status
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // User data
      user: {} as User,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Health metrics
      stepsToday: 0,
      caloriesToday: 0,
      weeklyStats: [],
      updateSteps: (steps) => set({ stepsToday: steps }),
      updateCalories: (calories) => set({ caloriesToday: calories }),
      setWeeklyStats: (stats) => set({ weeklyStats: stats }),

      // Network status
      isConnected: true,
      setIsConnected: (status) => set({ isConnected: status }),

      // Onboarding
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'health-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
