import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import ordersReducer from './slices/ordersSlice';
import notificationReducer from './slices/notificationSlice';
import { setupPersistence } from './persistence';
const rootReducer = combineReducers({
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    notifications: notificationReducer,
});
export const store = configureStore({ reducer: rootReducer });
setupPersistence(store);
