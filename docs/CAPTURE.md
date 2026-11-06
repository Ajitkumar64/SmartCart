# Screenshots and Demo Video (Android)

**Screenshots**
```bash
adb exec-out screencap -p > docs/shot-home.png
```
(or use the emulator camera button). Suggested set: Home, categories/search, filter sheet, product details,
cart, checkout with validation errors, order confirmation, orders, wishlist, offline banner, notification.

**Screen recording** (max 3 min per file)
```bash
adb shell screenrecord --bit-rate 6000000 /sdcard/smartcart-demo.mp4   # Ctrl+C to stop
adb pull /sdcard/smartcart-demo.mp4 docs/
```

**Suggested demo script:** browse + infinite scroll → pull-to-refresh → search "phone" → category → sort/price filter →
product details + gallery + similar → add to cart/wishlist → change quantities → kill & reopen app (data restored) →
airplane mode (cached products + banner + retry) → checkout → confirmation → orders →
notification (shorten `REMINDER_DELAY_MS`, leave items in cart, background the app).
