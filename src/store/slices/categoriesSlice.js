import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants/config';
import { getCategoryList } from '../../services/productService';
import { getJSON, setJSON } from '../../services/storage';
import { getErrorMessage } from '../../utils/errors';

export const fetchCategories = createAsyncThunk('categories/fetch', async (_, { rejectWithValue, signal }) => {
    try {
        const list = await getCategoryList(signal);
        await setJSON(STORAGE_KEYS.categories, list);
        return list;
    }
    catch (e) {
        const cached = await getJSON(STORAGE_KEYS.categories);
        if (cached && cached.length) {
            return cached;
        }
        return rejectWithValue(getErrorMessage(e));
    }
}, {
    condition: (_, { getState }) => getState().categories.status !== 'loading',
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: { items: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Could not load categories.';
            });
    },
});

export default categoriesSlice.reducer;