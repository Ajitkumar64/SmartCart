import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartCount } from '../store/slices/cartSlice';
import { syncReminder } from '../store/slices/notificationSlice';
export function useCartReminder() {
    const hydrated = useAppSelector(s => s.cart.hydrated);
    const count = useAppSelector(selectCartCount);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!hydrated) {
            return;
        }
        const t = setTimeout(() => {
            dispatch(syncReminder(count));
        }, 500);
        return () => clearTimeout(t);
    }, [hydrated, count, dispatch]);
}
