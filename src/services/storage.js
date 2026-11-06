import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getJSON(key) {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
export async function setJSON(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        // Persistence failures must never crash the UI.
    }
}
