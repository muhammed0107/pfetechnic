import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAppStore } from '@/store';

export function useNetworkStatus() {
  const { isConnected, setIsConnected } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Web implementation
    if (Platform.OS === 'web') {
      const updateOnlineStatus = () => {
        setIsConnected(navigator.onLine);
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      
      // Initial status
      updateOnlineStatus();
      setIsInitialized(true);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    } 
    // Native implementation would use NetInfo
    else {
      // For the scope of this example, we'll simulate connectivity on native
      // In a real app, you would use NetInfo from @react-native-community/netinfo
      setIsConnected(true);
      setIsInitialized(true);
    }
  }, []);

  return { isConnected, isInitialized };
}