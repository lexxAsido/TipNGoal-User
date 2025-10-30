import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null); // Start as null to avoid flicker

  useEffect(() => {
    let isMounted = true;

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        const systemTheme = Appearance.getColorScheme() || 'light';
        if (isMounted) setTheme(savedTheme || systemTheme);
      } catch (error) {
        console.warn('Error loading theme:', error);
        if (isMounted) setTheme('light');
      }
    };

    loadTheme();

    // Optional: sync with system theme in real time
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(prev => prev === 'system' ? colorScheme : prev);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (error) {
      console.warn('Error saving theme:', error);
    }
  };

  // ✅ Memoize context value to prevent re-renders in all consumers
  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  // ⏳ Wait until theme is loaded to render UI
  if (!theme) return null; // or <Splashscreen />

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
