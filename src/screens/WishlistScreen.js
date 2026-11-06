import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ProductCard, { ROW_HEIGHT } from '../components/ProductCard';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { removeFromWishlist, selectWishlistItems } from '../store/slices/wishlistSlice';
import { toSnapshot } from '../utils/product';
import { showToast } from '../utils/toast';

export default function WishlistScreen() {
  const items = useAppSelector(selectWishlistItems);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const onPress = useCallback(
    (id) => navigation.navigate('ProductDetails', { productId: id }),
    [navigation],
  );

  const onToggle = useCallback(
    (p) => dispatch(removeFromWishlist(p.id)),
    [dispatch],
  );

  const onAdd = useCallback(
    (p) => {
      if (p.stock <= 0) {
        return;
      }
      dispatch(addToCart({ product: toSnapshot(p) }));
      showToast('Added to cart');
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        isWishlisted
        onPress={onPress}
        onToggleWishlist={onToggle}
        onAddToCart={onAdd}
      />
    ),
    [onPress, onToggle, onAdd],
  );

  const getItemLayout = useCallback(
    (_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index }),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.hero}>
        <ScreenHeader title="Wishlist" subtitle={`${items.length} saved`} />

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons
                name="heart"
                size={responsiveFontSize(1.6)}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.statValue}>{items.length}</Text>
              <Text style={styles.statLabel}>Items saved</Text>
            </View>
          </View>

          <View style={styles.statChip}>
            <View style={[styles.statIcon, styles.statIconSecondary]}>
              <MaterialCommunityIcons
                name="hand-heart-outline"
                size={responsiveFontSize(1.6)}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.statValue}>Yours</Text>
              <Text style={styles.statLabel}>Curated picks</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />

            <View style={styles.emptyContent}>
              <View style={styles.heartBadgeContainer}>
                <View style={styles.heartRingOuter} />
                <View style={styles.heartRingInner} />
                <View style={styles.heartIconWrap}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={responsiveFontSize(4.5)}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
              <Text style={styles.emptySub}>
                Save your favorite items to keep track of them and buy them later.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved items</Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{items.length}</Text>
              </View>
            </View>

            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(p) => String(p.id)}
              getItemLayout={getItemLayout}
              numColumns={2}
              columnWrapperStyle={styles.column}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              initialNumToRender={6}
              windowSize={7}
              removeClippedSubviews
            />
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
    paddingBottom: responsiveHeight(1.6),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    zIndex: 10,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveWidth(3),
    marginTop: responsiveHeight(1),
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(4),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF1F6',
    gap: responsiveWidth(2.5),
  },
  statIcon: {
    width: responsiveFontSize(3.4),
    height: responsiveFontSize(3.4),
    borderRadius: responsiveFontSize(1.2),
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconSecondary: {
    backgroundColor: '#EEF2FF',
  },
  statValue: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
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
    paddingTop: responsiveHeight(0.5),
    paddingBottom: responsiveHeight(3),
  },
  column: {
    justifyContent: 'space-between',
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
    backgroundColor: `${colors.danger}0A`,
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
  heartBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(3),
  },
  heartRingOuter: {
    position: 'absolute',
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
    backgroundColor: `${colors.danger}10`,
  },
  heartRingInner: {
    position: 'absolute',
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    backgroundColor: `${colors.danger}20`,
  },
  heartIconWrap: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: responsiveWidth(8),
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.danger,
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
    paddingTop:responsiveHeight(2)
  },
  emptySub: {
    fontSize: responsiveFontSize(1.4),
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: responsiveHeight(1.5),
    lineHeight: responsiveFontSize(2.1),
    paddingHorizontal: responsiveWidth(4),
  },
});