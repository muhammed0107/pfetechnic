import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTheme } from '@/context/ThemeContext';

export default function NetworkStatus() {
  const { isConnected, isInitialized } = useNetworkStatus();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  // Animation for the status indicator
  const [animation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    if (!isInitialized) return;
    
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Auto-hide after 3 seconds if connected
    let timeout: NodeJS.Timeout;
    if (isConnected) {
      timeout = setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
    
    return () => clearTimeout(timeout);
  }, [isConnected, isInitialized]);
  
  if (!isInitialized) return null;
  
  const statusColor = isConnected ? '#4CAF50' : '#F44336';
  const statusText = isConnected ? 'Online' : 'Offline';
  
  const opacity = isConnected 
    ? animation 
    : 1; // Always show if offline

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity,
          backgroundColor: isDark ? '#222' : '#fff',
          borderColor: isDark ? '#444' : '#ddd',
        }
      ]}
    >
      {isConnected ? (
        <Wifi size={16} color={statusColor} />
      ) : (
        <WifiOff size={16} color={statusColor} />
      )}
      <Text style={[styles.text, { color: statusColor }]}>{statusText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  }
});