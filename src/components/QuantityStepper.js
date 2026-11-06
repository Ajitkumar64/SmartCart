import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors } from '../constants/theme';

function QuantityStepper({ quantity, canIncrease, onIncrease, onDecrease }) {
  const isMinDisabled = quantity <= 1;
  const isMaxDisabled = !canIncrease;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDecrease}
        disabled={isMinDisabled}
        style={({ pressed }) => [
          styles.btn,
          isMinDisabled && styles.disabled,
          pressed && !isMinDisabled && styles.pressed,
        ]}
        accessibilityLabel="Decrease quantity"
      >
        <MaterialCommunityIcons
          name="minus"
          size={responsiveFontSize(1.8)}
          color={isMinDisabled ? colors.textMuted : colors.primary}
        />
      </Pressable>

      <Text style={styles.qty}>{quantity}</Text>

      <Pressable
        onPress={onIncrease}
        disabled={isMaxDisabled}
        style={({ pressed }) => [
          styles.btn,
          isMaxDisabled && styles.disabled,
          pressed && !isMaxDisabled && styles.pressed,
        ]}
        accessibilityLabel="Increase quantity"
      >
        <MaterialCommunityIcons
          name="plus"
          size={responsiveFontSize(1.8)}
          color={isMaxDisabled ? colors.textMuted : colors.primary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(0.4),
  },
  btn: {
    width: responsiveWidth(7.5),
    height: responsiveWidth(7.5),
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    transform: [{ scale: 0.9 }],
    backgroundColor: '#F8FAFC',
  },
  qty: {
    minWidth: responsiveWidth(8),
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '800',
    color: colors.text,
  },
});

export default React.memo(QuantityStepper);