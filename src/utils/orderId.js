export function generateOrderId(now = Date.now()) {
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `SC-${now.toString(36).toUpperCase()}-${rand}`;
}
