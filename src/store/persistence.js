import { STORAGE_KEYS } from '../constants/config';
import { setJSON } from '../services/storage';

export function setupPersistence(store) {
    let prevCart;
    let prevWishlist;
    let prevOrders;
    store.subscribe(() => {
        const s = store.getState();
        if (!s.cart.hydrated) {
            return;
        }
        if (s.cart.items !== prevCart) {
            prevCart = s.cart.items;
            setJSON(STORAGE_KEYS.cart, s.cart.items);
        }
        if (s.wishlist.items !== prevWishlist) {
            prevWishlist = s.wishlist.items;
            setJSON(STORAGE_KEYS.wishlist, s.wishlist.items);
        }
        if (s.orders.orders !== prevOrders) {
            prevOrders = s.orders.orders;
            setJSON(STORAGE_KEYS.orders, s.orders.orders);
        }
    });
}
