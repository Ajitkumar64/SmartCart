import { createAsyncThunk, createSelector, createSlice, } from '@reduxjs/toolkit';
import { PAGE_SIZE } from '../../constants/config';
import { getProducts, getProductsByCategory, searchProductsApi, } from '../../services/productService';
import { readProductsCache, writeProductsCache, } from '../../services/cacheService';
import { getErrorMessage } from '../../utils/errors';
import { filterByCategory, filterByPriceRange, searchProducts, sortProducts, } from '../../utils/search';

const initialState = {
    items: [],
    total: 0,
    status: 'idle',
    loadingMore: false,
    refreshing: false,
    error: null,
    fromCache: false,
    query: '',
    category: null,
    sort: 'default',
    priceRange: { min: null, max: null },
    inFlightKey: null,
    activeRequestId: null,
};

const filterKey = (s) => `${s.query.trim().toLowerCase()}|${s.category ?? ''}|${s.sort}`;
const DEFAULT_KEY = filterKey({ query: '', category: null, sort: 'default' });
const requestKey = (s, skip) => `${filterKey(s)}|${skip}`;

function sortParams(sort) {
    switch (sort) {
        case 'price_asc':
            return { sortBy: 'price', order: 'asc' };
        case 'price_desc':
            return { sortBy: 'price', order: 'desc' };
        case 'rating_desc':
            return { sortBy: 'rating', order: 'desc' };
        default:
            return {};
    }
}

function requestProducts(s, skip, signal) {
    const params = { limit: PAGE_SIZE, skip, ...sortParams(s.sort) };
    const q = s.query.trim();
    if (q) {
        return searchProductsApi(q, params, signal);
    }
    if (s.category) {
        return getProductsByCategory(s.category, params, signal);
    }
    return getProducts(params, signal);
}

async function readCachedPage(s) {
    const exact = await readProductsCache(filterKey(s));
    if (exact) {
        return exact;
    }
    const base = await readProductsCache(DEFAULT_KEY);
    if (!base) {
        return null;
    }
    let list = searchProducts(base.products, s.query);
    list = filterByCategory(list, s.category);
    list = sortProducts(list, s.sort);
    return { products: list, total: list.length };
}

export const fetchProducts = createAsyncThunk('products/fetch', async (arg, { getState, rejectWithValue, signal }) => {
    const s = getState().products;
    const skip = arg.reset ? 0 : s.items.length;
    try {
        const data = await requestProducts(s, skip, signal);
        if (skip === 0) {
            await writeProductsCache(filterKey(s), {
                products: data.products,
                total: data.total,
            });
        }
        return { products: data.products, total: data.total, fromCache: false };
    }
    catch (error) {
        if (skip === 0) {
            const cached = await readCachedPage(s);
            if (cached) {
                return { ...cached, fromCache: true };
            }
        }
        return rejectWithValue(getErrorMessage(error));
    }
}, {
    condition: (arg, { getState }) => {
        const s = getState().products;
        if (arg.refresh) {
            return !s.refreshing;
        }
        if (s.inFlightKey === requestKey(s, arg.reset ? 0 : s.items.length)) {
            return false;
        }
        if (!arg.reset) {
            if (s.loadingMore || s.refreshing || s.status === 'loading') {
                return false;
            }
            if (s.fromCache || s.items.length >= s.total) {
                return false;
            }
        }
        return true;
    },
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setQuery(state, action) {
            const q = action.payload.trim();
            if (q === state.query) {
                return;
            }
            state.query = q;
            if (q) {
                state.category = null;
            }
        },
        setCategory(state, action) {
            state.category = action.payload;
            state.query = '';
        },
        setSort(state, action) {
            state.sort = action.payload;
        },
        setPriceRange(state, action) {
            state.priceRange = action.payload;
        },
        resetFilters(state) {
            state.query = '';
            state.category = null;
            state.sort = 'default';
            state.priceRange = { min: null, max: null };
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                const { reset, refresh } = action.meta.arg;
                state.activeRequestId = action.meta.requestId;
                state.inFlightKey = requestKey(state, reset ? 0 : state.items.length);
                state.error = null;
                if (refresh) {
                    state.refreshing = true;
                }
                else if (reset) {
                    state.status = 'loading';
                    state.items = [];
                    state.total = 0;
                    state.fromCache = false;
                }
                else {
                    state.loadingMore = true;
                }
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                if (action.meta.requestId !== state.activeRequestId) {
                    return;
                }
                const { products, total, fromCache } = action.payload;
                if (action.meta.arg.reset) {
                    state.items = products;
                }
                else {
                    const seen = new Set(state.items.map(p => p.id));
                    state.items.push(...products.filter(p => !seen.has(p.id)));
                }
                state.total = total;
                state.fromCache = fromCache;
                state.status = 'succeeded';
                state.loadingMore = false;
                state.refreshing = false;
                state.inFlightKey = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                if (action.meta.requestId !== state.activeRequestId) {
                    return;
                }
                state.error = action.payload ?? 'Something went wrong.';
                state.status = state.items.length ? 'succeeded' : 'failed';
                state.loadingMore = false;
                state.refreshing = false;
                state.inFlightKey = null;
            });
    },
});

export const { setQuery, setCategory, setSort, setPriceRange, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
const selectItems = (s) => s.products.items;
const selectPriceRange = (s) => s.products.priceRange;
const selectSort = (s) => s.products.sort;
export const selectVisibleProducts = createSelector([selectItems, selectPriceRange, selectSort], (items, range, sort) => sortProducts(filterByPriceRange(items, range), sort));
export const selectHasMore = (s) => !s.products.fromCache && s.products.items.length < s.products.total;