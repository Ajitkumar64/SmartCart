import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius, shadow } from '../constants/theme';
import { formatCurrency, getDiscountedPrice } from '../utils/pricing';

export const CARD_HEIGHT = 272;
export const CARD_MARGIN = 12;
export const ROW_HEIGHT = CARD_HEIGHT + CARD_MARGIN;

function ProductCard({
  product,
  isWishlisted,
  onPress,
  onToggleWishlist,
  onAddToCart,
  style,
}) {
  const hasDiscount = product.discountPercentage >= 1;
  const outOfStock = product.stock <= 0;

  return (
    <Pressable
      onPress={() => onPress(product.id)}
      style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={product.title}
    >
      <View style={styles.imageWrap}>
        <View style={styles.imageTint} />
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />

        {hasDiscount && (
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={responsiveFontSize(1.25)}
              color="#FFFFFF"
            />
            <Text style={styles.badgeText}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        )}

        <Pressable
          hitSlop={8}
          onPress={() => onToggleWishlist(product)}
          style={({ pressed }) => [
            styles.heart,
            isWishlisted && styles.heartActive,
            pressed && styles.heartPressed,
          ]}
          accessibilityLabel={
            isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <MaterialCommunityIcons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={responsiveFontSize(1.9)}
            color={isWishlisted ? colors.danger : colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons
              name="star"
              size={responsiveFontSize(1.35)}
              color={colors.star}
            />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price} numberOfLines={1}>
            {formatCurrency(getDiscountedPrice(product))}
          </Text>
          {hasDiscount && (
            <Text style={styles.oldPrice} numberOfLines={1}>
              {formatCurrency(product.price)}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => onAddToCart(product)}
          disabled={outOfStock}
          style={({ pressed }) => [
            styles.addBtn,
            outOfStock && styles.addBtnDisabled,
            pressed && !outOfStock && styles.addBtnPressed,
          ]}
        >
          <MaterialCommunityIcons
            name={outOfStock ? 'close-circle-outline' : 'cart-plus'}
            size={responsiveFontSize(1.6)}
            color="#FFFFFF"
          />
          <Text style={styles.addText}>
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: CARD_HEIGHT,
    marginBottom: CARD_MARGIN,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow,
    marginBottom: responsiveHeight(2)
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.96,
  },
  imageWrap: {
    height: 140,
    padding: 10,
    backgroundColor: '#F3F4F6',
  },
  imageTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.05,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.pill,
    paddingHorizontal: responsiveWidth(1.6),
    paddingVertical: responsiveHeight(0.35),
    gap: 2,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.2),
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  heart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: responsiveFontSize(3.4),
    height: responsiveFontSize(3.4),
    borderRadius: responsiveFontSize(1.7),
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  heartPressed: {
    transform: [{ scale: 0.86 }],
  },
  body: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: responsiveFontSize(1.55),
    lineHeight: responsiveFontSize(1.95),
    fontWeight: '700',
    color: colors.text,
    height: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    marginLeft: 3,
    fontSize: responsiveFontSize(1.3),
    fontWeight: '700',
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: responsiveFontSize(1.85),
    fontWeight: '800',
    color: colors.text,
  },
  oldPrice: {
    fontSize: responsiveFontSize(1.25),
    color: colors.textMuted,
    marginLeft: 6,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: responsiveHeight(0.9),
  },
  addBtnPressed: {
    opacity: 0.88,
  },
  addBtnDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.75,
  },
  addText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
  },
});

export default React.memo(ProductCard);