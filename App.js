import { enableScreens } from 'react-native-screens';
enableScreens();

import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import * as Font from 'expo-font';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Fonts
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';

// Components
import { Theme } from './Framework/Components/Theme';
import { AppProvider } from './Framework/Components/globalVariables';
import { StackNavigator } from './Framework/Navigation/Stack';
import Splashscreen from './Framework/Components/Splashscreen';
import { ThemeProvider, ThemeContext } from './Framework/Context/ThemeContext';
import {Preloader} from './Framework/Components/Preloader'

// Suppress deprecated warnings
LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native, along with all other PropTypes.",
]);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Pacifico_400Regular,
          Montserrat_100Thin,
          Montserrat_200ExtraLight,
          Montserrat_300Light,
          Montserrat_400Regular,
          Montserrat_500Medium,
          Montserrat_600SemiBold,
          Montserrat_700Bold,
          Montserrat_800ExtraBold,
          Montserrat_900Black,
        });

        // Optional: small artificial delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const memoizedAppContent = useMemo(() => <AppContent />, []);

  return (
    <ThemeProvider>
      {!appIsReady || showSplash ? <Splashscreen /> : memoizedAppContent}
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff' }}>
    <AppProvider style={styles.container}>

      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme === 'dark' ? '#000' : '#fff'}
        />
      <StackNavigator />
      <Preloader/>
    </AppProvider>
        </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.lightGreen },
});
