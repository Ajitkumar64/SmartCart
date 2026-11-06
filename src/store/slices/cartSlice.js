import { createSelector, createSlice } from '@reduxjs/toolkit';
import { calculateCartTotals, clampQuantity } from '../../utils/pricing';
import { hydrateApp } from '../hydrate';

export const initialCartState = { items: [], hydrated: false };

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addToCart(state, action) {
            const { product, quantity = 1 } = action.payload;
            if (product.stock <= 0) {
                return;
            }
            const existing = state.items.find(i => i.product.id === product.id);
            if (existing) {
                existing.quantity = clampQuantity(existing.quantity + quantity, product.stock);
            }
            else {
                state.items.push({
                    product,
                    quantity: clampQuantity(quantity, product.stock),
                });
            }
        },
        removeFromCart(state, action) {
            state.items = state.items.filter(i => i.product.id !== action.payload);
        },
        incrementQuantity(state, action) {
            const item = state.items.find(i => i.product.id === action.payload);
            if (item) {
                item.quantity = clampQuantity(item.quantity + 1, item.product.stock);
            }
        },
        decrementQuantity(state, action) {
            const item = state.items.find(i => i.product.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        setQuantity(state, action) {
            const item = state.items.find(i => i.product.id === action.payload.id);
            if (item) {
                item.quantity = clampQuantity(action.payload.quantity, item.product.stock);
            }
        },
        clearCart(state) {
            state.items = [];
        },
    },
    extraReducers: builder => {
        builder.addCase(hydrateApp.fulfilled, (state, action) => {
            state.items = action.payload.cart.filter(i => i?.product && Number.isFinite(i.quantity) && i.quantity > 0);
            state.hydrated = true;
        });
    },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, setQuantity, clearCart, } = cartSlice.actions;
export default cartSlice.reducer;
export const selectCartItems = (s) => s.cart.items;
export const selectCartTotals = createSelector([selectCartItems], items => calculateCartTotals(items));
export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.quantity, 0);