import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import { calculateCartTotals } from '../../utils/pricing';
import { generateOrderId } from '../../utils/orderId';
import { validateCheckout } from '../../utils/validation';
import { cancelCartReminder } from '../../services/notificationService';
import { hydrateApp } from '../hydrate';
import { clearCart } from './cartSlice';

const ordersSlice = createSlice({
    name: 'orders',
    initialState: { orders: [] },
    reducers: {
        addOrder(state, action) {
            state.orders.unshift(action.payload);
        },
    },
    extraReducers: builder => {
        builder.addCase(hydrateApp.fulfilled, (state, action) => {
            state.orders = action.payload.orders;
        });
    },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

export const checkout = createAsyncThunk('orders/checkout', async (customer, { getState, dispatch, rejectWithValue }) => {
    const items = getState().cart.items;
    if (items.length === 0) {
        return rejectWithValue('Your cart is empty.');
    }
    if (Object.keys(validateCheckout(customer)).length > 0) {
        return rejectWithValue('Please fix the highlighted fields.');
    }
    await new Promise(resolve => setTimeout(resolve, 1200));
    const totals = calculateCartTotals(items);
    const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        items,
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.grandTotal,
        customer,
    };
    dispatch(addOrder(order));
    dispatch(clearCart());
    try {
        await cancelCartReminder();
    }
    catch {

    }
    return order;
});

export const selectOrders = (s) => s.orders.orders;