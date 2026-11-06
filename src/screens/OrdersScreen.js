import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ScreenHeader from '../components/ScreenHeader';
import { colors, radius, shadow } from '../constants/theme';
import { useAppSelector } from '../store/hooks';
import { selectOrders } from '../store/slices/ordersSlice';
import { formatCurrency } from '../utils/pricing';

const OrderCard = React.memo(function OrderCard({ order }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.card}>
      <View style={styles.cardAccent} />

      <View style={styles.head}>
        <View style={styles.idWrap}>
          <View style={styles.idIcon}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={responsiveFontSize(1.7)}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.idCol}>
            <Text style={styles.idLabel}>Order</Text>
            <Text style={styles.id} numberOfLines={1}>
              {order.id}
            </Text>
          </View>
        </View>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.statusPill}>
          <MaterialCommunityIcons
            name="check-circle"
            size={responsiveFontSize(1.3)}
            color={colors.success}
          />
          <Text style={styles.statusText}>Completed</Text>
        </View>

        <View style={styles.metaItem}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={responsiveFontSize(1.3)}
            color={colors.textMuted}
          />
          <Text style={styles.date} numberOfLines={1}>
            {new Date(order.date).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsHeader}>
        <Text style={styles.itemsHeaderText}>Items</Text>
        <View style={styles.countChip}>
          <Text style={styles.countChipText}>{itemCount}</Text>
        </View>
      </View>

      {order.items.map((i) => (
        <View key={i.product.id} style={styles.line}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={responsiveFontSize(1.4)}
            color={colors.textMuted}
            style={styles.lineIcon}
          />
          <Text style={styles.lineTitle} numberOfLines={1}>
            {i.product.title}
          </Text>
          <View style={styles.qtyPill}>
            <Text style={styles.lineQty}>× {i.quantity}</Text>
          </View>
        </View>
      ))}
    </View>
  );
});

export default function OrdersScreen() {
  const orders = useAppSelector(selectOrders);
  const navigation = useNavigation();

  const renderItem = useCallback(({ item }) => <OrderCard order={item} />, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.hero}>
        <ScreenHeader
          title="Orders"
          subtitle={`${orders.length} order${orders.length === 1 ? '' : 's'}`}
        />
      </View>

      <View style={styles.body}>
        {orders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />

            <View style={styles.emptyContent}>
              <View style={styles.iconBadgeContainer}>
                <View style={styles.ringOuter} />
                <View style={styles.ringInner} />
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons
                    name="clipboard-text-outline"
                    size={responsiveFontSize(4.5)}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySub}>
                You haven't placed any orders yet. When you do, they will appear here.
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
                style={({ pressed }) => [
                  styles.shopBtn,
                  pressed && styles.shopBtnPressed,
                ]}
              >
                <Text style={styles.shopBtnText}>Start Shopping</Text>

              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order history</Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{orders.length}</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(o) => o.id}
                style={styles.flatList}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  hero: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: responsiveWidth(6),
    borderBottomRightRadius: responsiveWidth(6),
    paddingBottom: responsiveHeight(1.2),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    zIndex: 10,

  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: responsiveWidth(4),
    borderTopRightRadius: responsiveWidth(4),
    marginTop: -responsiveWidth(2),

  },
  list: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(0.5),
    paddingBottom: responsiveHeight(12),
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(0.6),
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
  flatList: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.lg,
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(1.5),
    overflow: 'hidden',
    ...shadow,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: responsiveWidth(2),
  },
  idIcon: {
    width: responsiveFontSize(3.4),
    height: responsiveFontSize(3.4),
    borderRadius: responsiveFontSize(1.1),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2.5),
  },
  idCol: {
    flex: 1,
  },
  idLabel: {
    fontSize: responsiveFontSize(1.1),
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  id: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '800',
    color: colors.text,
  },
  total: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '800',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1),
    gap: responsiveWidth(2),
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: responsiveHeight(0.4),
    paddingHorizontal: responsiveWidth(2.4),
    borderRadius: radius.pill,
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    fontSize: responsiveFontSize(1.15),
    fontWeight: '700',
    color: colors.success,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  date: {
    fontSize: responsiveFontSize(1.15),
    color: colors.textMuted,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: responsiveHeight(1.2),
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(0.6),
  },
  itemsHeaderText: {
    fontSize: responsiveFontSize(1.25),
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  countChip: {
    minWidth: responsiveWidth(6),
    height: responsiveHeight(2.2),
    borderRadius: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(1.8),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countChipText: {
    fontSize: responsiveFontSize(1.15),
    fontWeight: '700',
    color: colors.primary,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.5),
  },
  lineIcon: {
    marginRight: 6,
  },
  lineTitle: {
    flex: 1,
    fontSize: responsiveFontSize(1.35),
    color: colors.text,
    marginRight: 8,
  },
  qtyPill: {
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.25),
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
  },
  lineQty: {
    fontSize: responsiveFontSize(1.2),
    color: colors.textMuted,
    fontWeight: '700',
  },

  /* Attractive Empty State Styles */
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
  iconBadgeContainer: {
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
  ringInner: {
    position: 'absolute',
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    backgroundColor: `${colors.primary}20`,
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
  shopBtn: {
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
  shopBtnPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  shopIconCircle: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    borderRadius: responsiveFontSize(1.6),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});