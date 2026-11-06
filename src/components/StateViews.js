import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors } from '../constants/theme';
import Button from './Button';

const getIconName = (emoji) => {
  switch (emoji) {
    case '🛒':
      return 'cart-outline';
    case '🧾':
      return 'receipt-text-outline';
    case '🛍️':
      return 'shopping-outline';
    case '♡':
      return 'heart-outline';
    default:
      return 'alert-circle-outline';
  }
};

export const LoadingView = React.memo(function LoadingView({
  label = 'Loading…',
}) {
  return (
    <View style={styles.center}>
      <View style={styles.loadingRing}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
});

export const EmptyView = React.memo(function EmptyView({
  icon = '🛍️',
  title,
  message,
  actionLabel,
  onAction,
}) {
  const iconName = getIconName(icon);

  return (
    <View style={styles.center}>
      <View style={styles.iconContainer}>
        <View style={styles.ringOuter} />
        <View style={styles.ringInner} />
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name={iconName}
            size={responsiveFontSize(4.5)}
            color="#FFFFFF"
          />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.muted}>{message}</Text>}

      {!!actionLabel && !!onAction && (
        <Button title={actionLabel} onPress={onAction} style={styles.action} />
      )}
    </View>
  );
});

export const ErrorView = React.memo(function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <View style={styles.iconContainer}>
        <View style={[styles.ringOuter, styles.ringOuterError]} />
        <View style={[styles.ringInner, styles.ringInnerError]} />
        <View style={[styles.iconWrap, styles.iconWrapError]}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={responsiveFontSize(4.5)}
            color="#FFFFFF"
          />
        </View>
      </View>

      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      <Button title="Retry" onPress={onRetry} style={styles.action} />
    </View>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(8),
  },
  loadingRing: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(3),
  },
  ringOuter: {
    position: 'absolute',
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
    backgroundColor: `${colors.primary}10`,
  },
  ringOuterError: {
    backgroundColor: `${colors.danger}10`,
  },
  ringInner: {
    position: 'absolute',
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    backgroundColor: `${colors.primary}20`,
  },
  ringInnerError: {
    backgroundColor: `${colors.danger}20`,
  },
  iconWrap: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: responsiveWidth(8),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  iconWrapError: {
    backgroundColor: colors.danger,
    shadowColor: colors.danger,
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '900',
    color: colors.text,
    marginBottom: responsiveHeight(0.8),
    textAlign: 'center',
    letterSpacing: -0.5,
    paddingTop:responsiveHeight(2)
  },
  muted: {
    fontSize: responsiveFontSize(1.4),
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: responsiveFontSize(2.1),
    paddingHorizontal: responsiveWidth(2),
  },
  action: {
    marginTop: responsiveHeight(4),
    minWidth: responsiveWidth(45),
  },
});