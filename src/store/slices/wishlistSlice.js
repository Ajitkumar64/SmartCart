import { createSelector, createSlice } from '@reduxjs/toolkit';
import { hydrateApp } from '../hydrate';

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { items: [] },
    reducers: {
        toggleWishlist(state, action) {
            const idx = state.items.findIndex(p => p.id === action.payload.id);
            if (idx >= 0) {
                state.items.splice(idx, 1);
            }
            else {
                state.items.unshift(action.payload);
            }
        },
        removeFromWishlist(state, action) {
            state.items = state.items.filter(p => p.id !== action.payload);
        },
    },
    extraReducers: builder => {
        builder.addCase(hydrateApp.fulfilled, (state, action) => {
            state.items = action.payload.wishlist;
        });
    },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
export const selectWishlistItems = (s) => s.wishlist.items;
export const selectWishlistMap = createSelector([selectWishlistItems], items => {
    const map = {};
    items.forEach(p => {
        map[p.id] = true;
    });
    return map;
});