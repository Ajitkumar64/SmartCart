import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Button from '../components/Button';
import CartItemRow from '../components/CartItemRow';
import ScreenHeader from '../components/ScreenHeader';
import { colors, radius, shadow } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotals,
} from '../store/slices/cartSlice';
import { formatCurrency } from '../utils/pricing';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const onInc = useCallback((id) => dispatch(incrementQuantity(id)), [dispatch]);
  const onDec = useCallback((id) => dispatch(decrementQuantity(id)), [dispatch]);
  const onRemove = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);

  const renderItem = useCallback(
    ({ item }) => (
      <CartItemRow
        item={item}
        onIncrease={onInc}
        onDecrease={onDec}
        onRemove={onRemove}
      />
    ),
    [onInc, onDec, onRemove],
  );

  const TAB_BAR_HEIGHT = responsiveHeight(7.6) + insets.bottom + responsiveHeight(2);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Cart" />
        <View style={styles.body}>
          <View style={styles.emptyWrap}>
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />

            <View style={styles.emptyContent}>
              <View style={styles.cartBadgeContainer}>
                <View style={styles.cartRingOuter} />
                <View style={styles.cartRingInner} />
                <View style={styles.cartIconWrap}>
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={responsiveFontSize(4.5)}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySub}>
                Browse products and add your favourites to see them here.
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
                style={({ pressed }) => [
                  styles.exploreBtn,
                  pressed && styles.exploreBtnPressed,
                ]}
              >
                <Text style={styles.exploreBtnText}>Start shopping</Text>

              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.hero}>
        <ScreenHeader
          title="Cart"
          subtitle={`${totals.itemCount} item${totals.itemCount === 1 ? '' : 's'}`}
        />

        <View style={styles.badgeRow}>
          <View style={styles.countBadge}>
            <View style={styles.countBadgeIcon}>
              <MaterialCommunityIcons
                name="cart"
                size={responsiveFontSize(1.6)}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.badgeValue}>{totals.itemCount}</Text>
              <Text style={styles.badgeLabel}>In your cart</Text>
            </View>
          </View>

          <View style={styles.countBadge}>
            <View style={[styles.countBadgeIcon, styles.countBadgeIconAlt]}>
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={responsiveFontSize(1.6)}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.badgeValue}>Ready</Text>
              <Text style={styles.badgeLabel}>To checkout</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your items</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{items.length}</Text>
          </View>
        </View>

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(i) => String(i.product.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListFooterComponent={
            <View style={styles.clearWrap}>
              <Button
                title="Clear cart"
                variant="ghost"
                onPress={() => dispatch(clearCart())}
              />
            </View>
          }
        />

        <View style={[styles.summary, { marginBottom: TAB_BAR_HEIGHT }]}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={responsiveFontSize(2)}
              color={colors.primary}
            />
            <Text style={styles.summaryTitle}>Order Summary</Text>
          </View>

          <Row
            icon="cart-outline"
            label="Subtotal"
            value={formatCurrency(totals.subtotal)}
          />
          <Row
            icon="tag-outline"
            label="Discount"
            value={`-${formatCurrency(totals.discount)}`}
            valueColor={colors.success}
          />

          <View style={styles.divider} />

          <Row
            icon="cash-multiple"
            label="Grand total"
            value={formatCurrency(totals.grandTotal)}
            bold
          />

          <Pressable
            onPress={() => navigation.navigate('Checkout')}
            style={({ pressed }) => [
              styles.checkoutBtn,
              pressed && styles.checkoutBtnPressed,
            ]}
          >
            <Text style={styles.checkoutBtnText}>Proceed to checkout</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={responsiveFontSize(2)}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ icon, label, value, bold, valueColor }) {
  return (
    <View style={[styles.row, bold && styles.rowBold]}>
      <View style={styles.rowLeft}>
        {!!icon && (
          <MaterialCommunityIcons
            name={icon}
            size={responsiveFontSize(1.6)}
            color={bold ? colors.primary : colors.textMuted}
            style={styles.rowIcon}
          />
        )}
        <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      </View>
      <Text
        style={[
          styles.rowValue,
          bold && styles.bold,
          !!valueColor && { color: valueColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  hero: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: responsiveWidth(6),
    borderBottomRightRadius: responsiveWidth(6),
    paddingBottom: responsiveHeight(1.6),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveWidth(3),
    marginTop: responsiveHeight(0.8),
  },
  countBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(4),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF1F6',
    gap: responsiveWidth(2.5),
  },
  countBadgeIcon: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    borderRadius: responsiveFontSize(1.1),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeIconAlt: {
    backgroundColor: '#EEF2FF',
  },
  badgeValue: {
    fontSize: responsiveFontSize(1.55),
    fontWeight: '800',
    color: colors.text,
  },
  badgeLabel: {
    fontSize: responsiveFontSize(1.15),
    color: colors.textMuted,
    marginTop: 1,
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: responsiveWidth(4),
    borderTopRightRadius: responsiveWidth(4),
    marginTop: -responsiveWidth(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(0.4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  countPill: {
    minWidth: responsiveWidth(7),
    height: responsiveHeight(2.6),
    borderRadius: responsiveWidth(3.5),
    paddingHorizontal: responsiveWidth(2.2),
    backgroundColor: '#EEF1F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveHeight(2),
  },
  clearWrap: {
    paddingVertical: responsiveHeight(1.5),
  },
  summary: {
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2.5),
    borderTopLeftRadius: responsiveWidth(8),
    borderTopRightRadius: responsiveWidth(8),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 16,
    ...shadow,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: responsiveHeight(1.5),
  },
  summaryTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.6),
  },
  rowBold: {
    paddingVertical: responsiveHeight(0.9),
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 6,
  },
  rowLabel: {
    fontSize: responsiveFontSize(1.45),
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: responsiveFontSize(1.45),
    color: colors.text,
    fontWeight: '600',
  },
  bold: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '800',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: responsiveHeight(0.8),
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.8),
    marginTop: responsiveHeight(1.5),
    gap: responsiveWidth(2),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(6),
    overflow: 'hidden',
  },
  bgDecor1: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: -responsiveWidth(15),
    width: responsiveWidth(50),
    height: responsiveWidth(50),
    borderRadius: responsiveWidth(25),
    backgroundColor: `${colors.primary}0A`,
  },
  bgDecor2: {
    position: 'absolute',
    bottom: responsiveHeight(10),
    left: -responsiveWidth(10),
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    backgroundColor: `${colors.primary}0A`,
  },
  emptyContent: {
    alignItems: 'center',
    marginTop: -responsiveHeight(5),
  },
  cartBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(3),
  },
  cartRingOuter: {
    position: 'absolute',
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
    backgroundColor: `${colors.primary}10`,
  },
  cartRingInner: {
    position: 'absolute',
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    backgroundColor: `${colors.primary}20`,
  },
  cartIconWrap: {
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
  emptyTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    paddingTop: responsiveHeight(2)

  },
  emptySub: {
    fontSize: responsiveFontSize(1.4),
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: responsiveHeight(1.5),
    lineHeight: responsiveFontSize(2.1),
    paddingHorizontal: responsiveWidth(4),
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1.6),
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: responsiveWidth(70),
  },
  exploreBtnPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  exploreIconCircle: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    borderRadius: responsiveFontSize(1.6),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});