import React, { useCallback } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Button from '../components/Button';
import ImageGallery from '../components/ImageGallery';
import OfflineBanner from '../components/OfflineBanner';
import ProductCard from '../components/ProductCard';
import { ErrorView, LoadingView } from '../components/StateViews';
import { colors, radius } from '../constants/theme';
import { useProductDetails, useSimilarProducts } from '../hooks/useProductDetails';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { selectWishlistMap, toggleWishlist } from '../store/slices/wishlistSlice';
import { formatCurrency, getDiscountedPrice } from '../utils/pricing';
import { formatCategory, toSnapshot } from '../utils/product';
import { showToast } from '../utils/toast';

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { params } = useRoute();
  const productId = params.productId;

  const fromList = useAppSelector((s) =>
    s.products.items.find((p) => p.id === productId),
  );
  const { product, loading, error, offline, reload } = useProductDetails(
    productId,
    fromList,
  );
  const pool = useAppSelector((s) => s.products.items);
  const wishlistMap = useAppSelector(selectWishlistMap);

  const similar = useSimilarProducts(product, pool);

  const handleAdd = useCallback(
    (p) => {
      if (p.stock <= 0) {
        return;
      }
      dispatch(addToCart({ product: toSnapshot(p) }));
      showToast('Added to cart');
    },
    [dispatch],
  );

  const handleToggle = useCallback(
    (p) => dispatch(toggleWishlist(toSnapshot(p))),
    [dispatch],
  );

  const handleOpen = useCallback(
    (id) => navigation.push('ProductDetails', { productId: id }),
    [navigation],
  );

  const renderSimilar = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        isWishlisted={!!wishlistMap[item.id]}
        onPress={handleOpen}
        onToggleWishlist={handleToggle}
        onAddToCart={handleAdd}
        style={styles.similarCard}
      />
    ),
    [wishlistMap, handleOpen, handleToggle, handleAdd],
  );

  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {loading ? (
          <LoadingView />
        ) : (
          <ErrorView message={error ?? 'Product unavailable.'} onRetry={reload} />
        )}
      </SafeAreaView>
    );
  }

  const wished = !!wishlistMap[product.id];
  const hasDiscount = product.discountPercentage >= 1;
  const inStock = product.stock > 0;

  const availability = inStock
    ? `${product.availabilityStatus ?? 'In Stock'} · ${product.stock} available`
    : 'Out of stock';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <OfflineBanner
        message={offline ? 'Showing saved product details.' : undefined}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageGallery
          images={product.images?.length ? product.images : [product.thumbnail]}
        />

        <View style={styles.content}>
          <View style={styles.categoryPill}>
            <Text style={styles.category}>
              {formatCategory(product.category)}
              {product.brand ? ` · ${product.brand}` : ''}
            </Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <MaterialCommunityIcons
                name="star"
                size={responsiveFontSize(1.6)}
                color={colors.star}
              />
              <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            </View>

            <View style={styles.stockBox}>
              <MaterialCommunityIcons
                name={inStock ? 'check-circle' : 'alert-circle'}
                size={responsiveFontSize(1.5)}
                color={inStock ? colors.success : colors.danger}
              />
              <Text
                style={[
                  styles.stock,
                  { color: inStock ? colors.success : colors.danger },
                ]}
              >
                {availability}
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {formatCurrency(getDiscountedPrice(product))}
            </Text>
            {hasDiscount && (
              <>
                <Text style={styles.oldPrice}>
                  {formatCurrency(product.price)}
                </Text>
                <View style={styles.badge}>
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={responsiveFontSize(1.3)}
                    color="#FFFFFF"
                  />
                  <Text style={styles.badgeText}>
                    {Math.round(product.discountPercentage)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>

          {similar.length > 0 && (
            <>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.accentBar} />
                <Text style={styles.sectionTitle}>Similar products</Text>
              </View>
              <FlatList
                horizontal
                data={similar}
                extraData={wishlistMap}
                renderItem={renderSimilar}
                keyExtractor={(p) => String(p.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarList}
                initialNumToRender={3}
                windowSize={5}
              />
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.bar}>
        <Button
          title={wished ? '♥ Saved' : '♡ Wishlist'}
          variant="outline"
          onPress={() => handleToggle(product)}
          style={styles.btnWishlist}
        />
        <Button
          title={inStock ? 'Add to Cart' : 'Out of stock'}
          disabled={!inStock}
          onPress={() => handleAdd(product)}
          style={styles.btnCart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: responsiveHeight(1),
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: responsiveWidth(8),
    borderTopRightRadius: responsiveWidth(8),
    marginTop: -responsiveWidth(8),
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(3),
    minHeight: 400,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: radius.pill,
    marginBottom: responsiveHeight(1),
  },
  category: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '800',
    color: colors.text,
    lineHeight: responsiveFontSize(3.2),
    letterSpacing: -0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.5),
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: radius.sm,
  },
  rating: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
    color: colors.text,
  },
  stockBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stock: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  price: {
    fontSize: responsiveFontSize(3),
    fontWeight: '800',
    color: colors.text,
  },
  oldPrice: {
    fontSize: responsiveFontSize(1.8),
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: responsiveWidth(2.5),
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.4),
    marginLeft: responsiveWidth(2.5),
    gap: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.2),
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: responsiveHeight(2.5),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
  },
  accentBar: {
    width: responsiveWidth(1.2),
    height: responsiveFontSize(2),
    backgroundColor: colors.primary,
    borderRadius: responsiveWidth(0.6),
    marginRight: responsiveWidth(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    fontSize: responsiveFontSize(1.5),
    lineHeight: responsiveFontSize(2.4),
    color: colors.textMuted,
    marginBottom: responsiveHeight(1),
  },
  similarList: {
    paddingVertical: responsiveHeight(1),
    paddingBottom: responsiveHeight(2),
  },
  similarCard: {
    width: responsiveWidth(42),
    marginRight: responsiveWidth(3),
  },
  bar: {
    position: 'absolute',
    bottom: responsiveHeight(1.5),
    left: responsiveWidth(4),
    right: responsiveWidth(4),
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(2.5),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    gap: responsiveWidth(3),
  },
  btnWishlist: {
    flex: 1,
  },
  btnCart: {
    flex: 1.6,
  },
});