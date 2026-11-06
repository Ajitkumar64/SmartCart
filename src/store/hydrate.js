import { createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../constants/config';
import { getJSON } from '../services/storage';

export const hydrateApp = createAsyncThunk('app/hydrate', async () => {
    const [cart, wishlist, orders] = await Promise.all([
        getJSON(STORAGE_KEYS.cart),
        getJSON(STORAGE_KEYS.wishlist),
        getJSON(STORAGE_KEYS.orders),
    ]);
    return {
        cart: Array.isArray(cart) ? cart : [],
        wishlist: Array.isArray(wishlist) ? wishlist : [],
        orders: Array.isArray(orders) ? orders : [],
    };
});
