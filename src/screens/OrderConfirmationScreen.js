import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, } from '../constants/theme';
import { useAppSelector } from '../store/hooks';
import { formatCurrency } from '../utils/pricing';

export default function OrderConfirmationScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const order = useAppSelector((s) =>
    s.orders.orders.find((o) => o.id === params.orderId)
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.bgDecor1} />
      <View style={styles.bgDecor2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <View style={styles.badgeContainer}>
            <View style={styles.badgeRingOuter} />
            <View style={styles.badgeRingInner} />
            <View style={styles.badgeIcon}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={responsiveFontSize(5.5)}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.sub}>
            Thank you for shopping with us. Your order is being prepared and will be delivered soon.
          </Text>

          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <MaterialCommunityIcons name="receipt" size={responsiveFontSize(2)} color="#FFFFFF" />
              <Text style={styles.ticketHeaderTitle}>Payment Receipt</Text>
            </View>

            <View style={styles.ticketBody}>
              <View style={styles.dashedLine} />

              <View style={styles.ticketRow}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={responsiveFontSize(2)}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.label}>Order ID</Text>
                  <Text style={styles.id} selectable>
                    {params.orderId}
                  </Text>
                </View>
              </View>

              {!!order && (
                <View style={styles.ticketRow}>
                  <View style={[styles.iconBox, styles.iconBoxSuccess]}>
                    <MaterialCommunityIcons
                      name="cash-check"
                      size={responsiveFontSize(2)}
                      color={colors.success}
                    />
                  </View>
                  <View style={styles.textCol}>
                    <Text style={styles.label}>Total Paid</Text>
                    <Text style={styles.amount}>
                      {formatCurrency(order.total)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate('Tabs', { screen: 'Orders' })}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>View my orders</Text>
            <View style={styles.btnIconCircle}>
              <MaterialCommunityIcons
                name="arrow-right"
                size={responsiveFontSize(1.8)}
                color={colors.primary}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="shopping-outline"
              size={responsiveFontSize(2)}
              color={colors.primary}
            />
            <Text style={styles.secondaryBtnText}>Continue shopping</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgDecor1: {
    position: 'absolute',
    top: -responsiveWidth(20),
    right: -responsiveWidth(20),
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    borderRadius: responsiveWidth(30),
    backgroundColor: `${colors.primary}0A`,
  },
  bgDecor2: {
    position: 'absolute',
    bottom: -responsiveWidth(10),
    left: -responsiveWidth(10),
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    backgroundColor: `${colors.success}0A`,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(2),
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(4),
  },
  badgeRingOuter: {
    position: 'absolute',
    width: responsiveWidth(38),
    height: responsiveWidth(38),
    borderRadius: responsiveWidth(19),
    backgroundColor: `${colors.success}10`,
  },
  badgeRingInner: {
    position: 'absolute',
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    borderRadius: responsiveWidth(14),
    backgroundColor: `${colors.success}20`,
  },
  badgeIcon: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: responsiveFontSize(1.5),
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: responsiveHeight(1.5),
    lineHeight: responsiveFontSize(2.2),
    paddingHorizontal: responsiveWidth(4),
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    alignSelf: 'stretch',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    overflow: 'hidden',
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: responsiveHeight(1.5),
    gap: responsiveWidth(2),
  },
  ticketHeaderTitle: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ticketBody: {
    padding: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginBottom: responsiveHeight(2),
    borderRadius: 1,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  iconBox: {
    width: responsiveFontSize(4.5),
    height: responsiveFontSize(4.5),
    borderRadius: responsiveFontSize(1.2),
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(3.5),
  },
  iconBoxSuccess: {
    backgroundColor: `${colors.success}12`,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontSize: responsiveFontSize(1.15),
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  id: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    color: colors.text,
  },
  amount: {
    fontSize: responsiveFontSize(2),
    fontWeight: '900',
    color: colors.text,
  },
  actions: {
    marginTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(2),
    gap: responsiveHeight(1.5),
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(5),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnIconCircle: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    borderRadius: responsiveFontSize(1.6),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1.8),
    gap: responsiveWidth(2.5),
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});