/* -------------------------------------------------------------------------- */
/*  hooks/useProfile.ts                                                       */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, useCallback, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { useAppStore } from '@/store';
import { getProfile } from '@/services/auth';

export function useProfile() {
  const token = useAppStore((s) => s.token);
  const setUserStore = useAppStore((s) => s.setUser);
  const currentUser = useAppStore((s) => s.user);

  const [isLoading, setLoad] = useState(true);

  /* --------- real fetch ------------------------------------------------- */
  const doFetch = useCallback(async () => {
    if (!token) {
      setLoad(false);
      return;
    }
    try {
      setLoad(true);
      const res = await getProfile(token);
      setUserStore(res.user);
    } catch (err) {
      console.error('profile fetch', err);
      Toast.show({ type: 'error', text1: 'Failed to load profile' });
    } finally {
      setLoad(false);
    }
  }, [token, setUserStore]);

  /* --------- stable wrapper (never changes) ----------------------------- */
  const fetchRef = useRef(doFetch);
  useEffect(() => {
    fetchRef.current = doFetch;
  }, [doFetch]);
  const refresh = useCallback(() => fetchRef.current(), []);

  /* --------- first load ------------------------------------------------- */
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user: currentUser, isLoading, refresh };
}
