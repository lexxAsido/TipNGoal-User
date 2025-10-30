import React, { useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../Context/ThemeContext';

const Splashscreen = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const { theme } = useContext(ThemeContext);

  // 🔁 Rotate animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []); // run once

  // Interpolated rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.inner}>
        <Image
          source={require('../../assets/splash.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: textColor }]}>
            TIP<Text style={{ color: 'green' }}>N</Text>G
          </Text>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome name="soccer-ball-o" size={26} color="green" />
          </Animated.View>
          <Text style={[styles.title, { color: textColor }]}>AL</Text>
        </View>

        <Text style={[styles.subtitle, { color: textColor }]}>
          Your home of Football Predictions
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Splashscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
