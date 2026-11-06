import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors } from '../constants/theme';

export default function SplashScreen({ onFinish, duration = 3200 }) {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(18)).current;
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(textSlide, {
          toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]),
    ]).start();

    const pulses = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 380, useNativeDriver: true }),
          Animated.delay((2 - i) * 180),
        ]),
      ),
    );
    pulses.forEach(p => p.start());

    const timer = setTimeout(() => onFinish && onFinish(), duration);
    return () => {
      clearTimeout(timer);
      pulses.forEach(p => p.stop());
    };
  }, [dots, duration, logoOpacity, logoScale, onFinish, textOpacity, textSlide]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <Animated.View
        style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Text style={styles.logoIcon}>🛒</Text>
      </Animated.View>

      <Animated.View
        style={{ opacity: textOpacity, transform: [{ translateY: textSlide }], alignItems: 'center' }}>
        <Text style={styles.title}>SmartCart</Text>
        <Text style={styles.tagline}>Shop smart. Shop easy.</Text>
      </Animated.View>

      <View style={styles.dots}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
        ))}
      </View>

      <Text style={styles.footer}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleTop: {
    position: 'absolute',
    top: -responsiveHeight(14.2),
    right: -responsiveWidth(25.6),
    width: responsiveWidth(76.9),
    height: responsiveWidth(76.9),
    borderRadius: responsiveWidth(38.45),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -responsiveHeight(16.6),
    left: -responsiveWidth(28.2),
    width: responsiveWidth(87.2),
    height: responsiveWidth(87.2),
    borderRadius: responsiveWidth(43.6),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  logo: {
    width: responsiveWidth(30.8),
    height: responsiveWidth(30.8),
    borderRadius: responsiveWidth(9.2),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(3.3),
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: responsiveHeight(0.95) },
    elevation: 12,
  },
  logoIcon: { fontSize: responsiveFontSize(6.9) },
  title: {
    fontSize: responsiveFontSize(4.3),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: responsiveFontSize(1.8),
    color: 'rgba(255,255,255,0.8)',
    marginTop: responsiveHeight(0.7),
  },
  dots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: responsiveHeight(10.7),
  },
  dot: {
    width: responsiveWidth(2.6),
    height: responsiveWidth(2.6),
    borderRadius: responsiveWidth(1.3),
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsiveWidth(1.3),
  },
  footer: {
    position: 'absolute',
    bottom: responsiveHeight(4.3),
    color: 'rgba(255,255,255,0.6)',
    fontSize: responsiveFontSize(1.4),
  },
});