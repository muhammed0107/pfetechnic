import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  actualTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemTheme = useColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeMode>('system');

  // Determine the actual theme based on the selected theme mode
  const actualTheme = theme === 'system' ? systemTheme : theme;

  // Load saved theme from storage on initial render
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@health_app_theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes
  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('@health_app_theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = actualTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, actualTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
