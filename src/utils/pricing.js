import { MAX_QTY_PER_ITEM } from '../constants/config';
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
export const getDiscountedPrice = (p) => round2(p.price * (1 - (p.discountPercentage || 0) / 100));
export const formatCurrency = (n) => `$${n.toFixed(2)}`;
export function calculateCartTotals(items) {
    let itemCount = 0;
    let subtotal = 0;
    let discounted = 0;
    for (const { product, quantity } of items) {
        itemCount += quantity;
        subtotal += product.price * quantity;
        discounted += getDiscountedPrice(product) * quantity;
    }
    return {
        itemCount,
        subtotal: round2(subtotal),
        discount: round2(subtotal - discounted),
        grandTotal: round2(discounted),
    };
}

export function clampQuantity(quantity, stock) {
    const max = stock > 0 ? Math.min(MAX_QTY_PER_ITEM, stock) : MAX_QTY_PER_ITEM;
    if (!Number.isFinite(quantity)) {
        return 1;
    }
    return Math.min(Math.max(Math.floor(quantity), 1), max);
}
