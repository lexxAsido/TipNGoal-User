import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { Theme } from './Theme';
import { AppContext } from './globalVariables';
import { ThemeContext } from '../Context/ThemeContext';

export function Preloader() {
  const { preloader } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  if (!preloader) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        {
          backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff',
        },
      ]}
    >
      {/* You can use ActivityIndicator or Lottie */}
      <AnimatedLottieView
        style={{ width: 200, height: 200 }}
        source={require('../../assets/loader.json')}
        autoPlay
        loop
        speed={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});
