import notifee, { AndroidImportance, AuthorizationStatus, TriggerType, } from '@notifee/react-native';
import { REMINDER_DELAY_MS } from '../constants/config';

export const CART_REMINDER_ID = 'smartcart-abandoned-cart';
export const CART_CHANNEL_ID = 'cart-reminders';

export async function ensureNotificationPermission() {
    const settings = await notifee.requestPermission();
    return (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL);
}

export async function scheduleCartReminder(itemCount, delayMs = REMINDER_DELAY_MS, now = Date.now()) {
    if (itemCount <= 0) {
        await cancelCartReminder();
        return { scheduled: false, triggerAt: null, permissionGranted: true };
    }
    const granted = await ensureNotificationPermission();
    if (!granted) {
        return { scheduled: false, triggerAt: null, permissionGranted: false };
    }
    const channelId = await notifee.createChannel({
        id: CART_CHANNEL_ID,
        name: 'Cart reminders',
        importance: AndroidImportance.HIGH,
    });
    const triggerAt = now + delayMs;
    await notifee.createTriggerNotification({
        id: CART_REMINDER_ID,
        title: 'Your cart is waiting 🛒',
        body: `You left ${itemCount} item${itemCount === 1 ? '' : 's'} in your SmartCart. Complete your order before they sell out!`,
        android: { channelId, pressAction: { id: 'default' } },
    }, { type: TriggerType.TIMESTAMP, timestamp: triggerAt });
    return { scheduled: true, triggerAt, permissionGranted: true };
}

export async function cancelCartReminder() {
    await notifee.cancelTriggerNotification(CART_REMINDER_ID);
    await notifee.cancelNotification(CART_REMINDER_ID);
}

export async function syncCartReminder(itemCount, delayMs = REMINDER_DELAY_MS, now = Date.now()) {
    return scheduleCartReminder(itemCount, delayMs, now);
}