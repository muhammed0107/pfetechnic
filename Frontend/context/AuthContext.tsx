/* -------------------------------------------------------------------------- */
/*  context/AuthContext.tsx                                                   */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  logoutUser,
} from '@/services/auth';
import { mainApi } from '@/services/api';
import { useAppStore } from '@/store';

/* ------------------------- Types ----------------------------------------- */
export interface User {
  _id: string;
  email: string;
  fullName: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  birthday?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (e: string, p: string) => Promise<void>;
  signup: (u: any) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (e: string) => Promise<void>;
  verifyOtp: (e: string, otp: string) => Promise<void>;
  resetPassword: (e: string, newPassword: string) => Promise<void>;
  updateUserData: (u: Partial<User>) => void;
}

/* ------------------------- Context --------------------------------------- */
const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

/* ----------------------- Provider Component ------------------------------ */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /* ------- Local state -------------------------------------------------- */
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ------- Navigation helpers ------------------------------------------- */
  const router = useRouter();
  const segments = useSegments();

  /* ------- Zustand setters ---------------------------------------------- */
  const setAppUser = useAppStore((s) => s.setUser);
  const setAppToken = useAppStore((s) => s.setToken);

  /* --------------------- Load user from storage -------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@health_app_user');
        const storedToken = await AsyncStorage.getItem('@health_app_token');

        if (storedUser && storedToken) {
          const u = JSON.parse(storedUser) as User;
          setUser(u);
          setToken(storedToken);
          setAppUser(u);
          setAppToken(storedToken);
        }
      } catch (e) {
        console.error('Load user error', e);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  /* --------------------- Auth navigation guard -------------------------- */
  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!user && !inAuthGroup && !inOnboarding) {
      router.replace('/onboarding');
    } else if (user && (inAuthGroup || inOnboarding)) {
      router.replace('/(drawer)/(tabs)');
    }
  }, [user, segments, isLoading]);

  /* --------------------- Helpers ---------------------------------------- */
  const persist = async (u: User, t: string) => {
    await AsyncStorage.setItem('@health_app_user', JSON.stringify(u));
    await AsyncStorage.setItem('@health_app_token', t);
  };

  /* --------------------- Actions ---------------------------------------- */
  const login = async (email: string, password: string) => {
    setLoad(true);
    setError(null);
    try {
      const res = await loginUser(email, password);
      setUser(res.user);
      setToken(res.token);
      setAppUser(res.user);
      setAppToken(res.token);
      await persist(res.user, res.token);
      router.replace('/(drawer)/(tabs)/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      Alert.alert('Login Error', err.message || 'Login failed');
    } finally {
      setLoad(false);
    }
  };

  const signup = async (data: any) => {
    setLoad(true);
    setError(null);
    try {
      await registerUser(data);
      Alert.alert('Signup Success', 'Your account has been created.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      Alert.alert('Signup Error', err.message || 'Signup failed');
    } finally {
      setLoad(false);
    }
  };

  const logout = async () => {
    setLoad(true);
    try {
      if (token) await logoutUser(token);
      await AsyncStorage.multiRemove(['@health_app_user', '@health_app_token']);
      setUser(null);
      setToken(null);
      setAppUser({} as any);
      setAppToken(null);
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setLoad(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoad(true);
    setError(null);
    try {
      await requestPasswordReset(email);
    } catch (err: any) {
      if (err.message.includes('User not found')) {
        setError("You don't have an account with that email");
      } else if (err.message.includes('Missing credentials')) {
        setError('Email service is temporarily unavailable');
      } else {
        setError(err.message);
      }
      throw err;
    } finally {
      setLoad(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setLoad(true);
    setError(null);
    try {
      await mainApi.post('/verify-otp', { email, otp });
    } catch (err: any) {
      setError(err.response?.data?.error || 'OTP verification failed');
      throw err;
    } finally {
      setLoad(false);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    setLoad(true);
    setError(null);
    try {
      await mainApi.post('/reset-password', { email, newPassword });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Password reset failed');
      throw err;
    } finally {
      setLoad(false);
    }
  };

  const updateUserData = (data: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...data };
    setUser(merged);
    setAppUser(merged);
    persist(merged, token || '');
  };

  /* --------------------- Context value ---------------------------------- */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
