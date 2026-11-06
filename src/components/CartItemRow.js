import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius, shadow } from '../constants/theme';
import { MAX_QTY_PER_ITEM } from '../constants/config';
import { formatCurrency, getDiscountedPrice } from '../utils/pricing';
import QuantityStepper from './QuantityStepper';

function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const { product, quantity } = item;
  const unit = getDiscountedPrice(product);
  const max = Math.min(
    MAX_QTY_PER_ITEM,
    product.stock > 0 ? product.stock : MAX_QTY_PER_ITEM,
  );

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Pressable
            onPress={() => onRemove(product.id)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.removeBtn,
              pressed && styles.removeBtnPressed,
            ]}
            accessibilityLabel="Remove item"
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={responsiveFontSize(2)}
              color={colors.danger}
            />
          </Pressable>
        </View>

        <Text style={styles.unit}>{formatCurrency(unit)} each</Text>

        <View style={styles.bottom}>
          <QuantityStepper
            quantity={quantity}
            canIncrease={quantity < max}
            onIncrease={() => onIncrease(product.id)}
            onDecrease={() => onDecrease(product.id)}
          />
          <Text style={styles.total}>{formatCurrency(unit * quantity)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    borderWidth: 1,
    borderColor: '#F1F3F7',
    ...shadow,
  },
  imageWrap: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveWidth(1.5),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    marginLeft: responsiveWidth(3.5),
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: responsiveFontSize(1.5),
    fontWeight: '700',
    color: colors.text,
    lineHeight: responsiveFontSize(2),
    marginRight: responsiveWidth(2),
  },
  removeBtn: {
    width: responsiveFontSize(3),
    height: responsiveFontSize(3),
    borderRadius: responsiveFontSize(1.5),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnPressed: {
    backgroundColor: '#FEE2E2',
    transform: [{ scale: 0.9 }],
  },
  unit: {
    fontSize: responsiveFontSize(1.25),
    color: colors.textMuted,
    marginTop: responsiveHeight(0.2),
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.2),
  },
  total: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '800',
    color: colors.primary,
  },
});

export default React.memo(CartItemRow);