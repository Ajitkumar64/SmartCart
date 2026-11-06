# SmartCart – React Native CLI E-Commerce App

A mobile shopping app built with **React Native CLI (no Expo)** in plain **JavaScript**.
State: Redux Toolkit · Navigation: React Navigation · HTTP: Axios · Storage: AsyncStorage ·
Notifications: Notifee · Tests: Jest · Data: [DummyJSON](https://dummyjson.com/docs).

## Features
* Animated splash screen, then bottom tabs: Home, Wishlist, Cart, Orders
* Product list from DummyJSON with infinite scroll, pull-to-refresh, loading / empty / error states
* Horizontal category chips, debounced search (400 ms), sort (price, rating) and price-range filter
* Product details: image gallery, price/discount/rating/availability, add to cart, wishlist, similar products
* Cart: add, remove, increase/decrease quantity (validated against stock), live totals, restored after restart
* Wishlist and order history persisted with AsyncStorage
* Simulated checkout with form validation, unique order ID, confirmation screen
* Abandoned-cart reminder (local notification), cancelled when the cart is emptied or an order is placed
* Offline support: cached products and details, offline banner, retry buttons

## My approach
1. **Separation of concerns.** Screens only render and dispatch. API calls live in `services/`, business rules in pure functions in `utils/`, app state in Redux slices. This kept the logic testable without a device.
2. **One slice per domain** (`products`, `categories`, `cart`, `wishlist`, `orders`, `notifications`) using `createSlice` / `createAsyncThunk`, with narrow selectors and memoised `createSelector` for derived data (visible products, cart totals, wishlist lookup).
3. **Local persistence on top of a mock API.** DummyJSON cannot store carts or orders, so cart, wishlist and orders are written to AsyncStorage whenever they change and restored by a `hydrateApp` thunk at launch. Writes are skipped until hydration finishes, so an empty initial state can never overwrite saved data.
4. **Resilient networking.** A thunk `condition` plus an in-flight key blocks duplicate requests, stale responses are ignored, and the first page of every query is cached. On failure the app shows the cached list (or filters the cached default list locally) with a banner.
5. **Performance.** `FlatList` with `getItemLayout`, windowing props and stable keys; `React.memo` on cards and rows; `useCallback` / `useMemo` for handlers and derived data; debounced search. See `docs/PERFORMANCE.md`.
6. **Notifications.** One reminder with a fixed id is (re)scheduled 30 minutes after the last cart change, so it is replaced rather than duplicated. Cancelled when the cart is empty and on checkout. Permission is requested before the first schedule (Android 13+ and iOS).
7. **Pure logic first.** Totals, quantity clamping, search, filtering, sorting, similar-product selection, validation and notification scheduling are separate from the UI and covered by Jest tests.

### Folder structure
```
App.js                     Provider + splash/hydration gate + cart-reminder hook
index.js                   Entry + Notifee background handler
src/
  constants/               config.js (API, paging, storage keys), theme.js
  types/                   JSDoc typedefs (documentation only)
  services/                api.js, productService.js, cacheService.js, storage.js, notificationService.js
  store/                   index.js, hooks.js, hydrate.js, persistence.js, slices/
  hooks/                   useDebounce, useNetworkStatus, useCartReminder, useProductDetails
  utils/                   pricing, search, similar, validation, orderId, errors, toast
  components/              Button, Input, ProductCard, CategoryChips, SearchBar, FilterModal,
                           QuantityStepper, CartItemRow, ImageGallery, StateViews, OfflineBanner…
  navigation/              Root stack + bottom tabs
  screens/                 Splash, Home, ProductDetails, Cart, Wishlist, Checkout,
                           OrderConfirmation, Orders
__tests__/                 Jest unit tests
docs/                      PERFORMANCE.md, CAPTURE.md
```
Data flow: **Screen → dispatch(thunk) → service (Axios) → slice → selector → Screen.**

## Setup (Android)

**Prerequisites:** Node 18+, JDK 17, Android Studio (SDK + emulator or a USB-debugging device).
Environment guide: https://reactnative.dev/docs/set-up-your-development-environment (React Native CLI → Android).

```bash
# 1. Create a fresh React Native CLI project
npx @react-native-community/cli@latest init SmartCart
cd SmartCart

# 2. Copy this source over it (overwrite):
#    App.js, index.js, jest.setup.js, src/, __tests__/, docs/, README.md
#    then remove the template's TypeScript leftovers (this project is plain JavaScript):
#      rm -f App.tsx tsconfig.json __tests__/App.test.tsx

# 3. Install dependencies
npm install @reduxjs/toolkit react-redux axios \
  @react-native-async-storage/async-storage \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  @notifee/react-native @react-native-community/netinfo
```

### Two manual edits
**a) `package.json`** – register the Jest setup file:
```json
"jest": {
  "preset": "react-native",
  "setupFiles": ["<rootDir>/jest.setup.js"]
}
```
**b) `android/app/src/main/AndroidManifest.xml`** – inside `<manifest>` (Android 13+ notification permission):
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Run
```bash
cd android && ./gradlew clean && cd ..     # Windows: gradlew clean
npx react-native start --reset-cache       # terminal 1
npx react-native run-android               # terminal 2 (emulator/device running)
npm test                                   # Jest unit tests
```
After adding any native dependency, always rebuild with `run-android` (reloading JavaScript is not enough).

### Build an APK
```bash
cd android && ./gradlew assembleDebug      # android/app/build/outputs/apk/debug/app-debug.apk
cd android && ./gradlew assembleRelease    # android/app/build/outputs/apk/release/app-release.apk
```
The template signs release builds with the debug key; create your own keystore before publishing.

## Dependencies
| Package | Purpose |
|---|---|
| `@reduxjs/toolkit`, `react-redux` | Global state, async thunks, selectors |
| `axios` | API client |
| `@react-native-async-storage/async-storage` | Persistence and offline cache |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` | Navigation |
| `react-native-screens`, `react-native-safe-area-context` | Navigation peer dependencies (native) |
| `@notifee/react-native` | Local notifications |
| `@react-native-community/netinfo` | Offline detection |

All of them must be direct dependencies in your `package.json` so React Native autolinking includes them.

## Tests
`npm test` runs:
* `cart.test.js` – totals, discounts, quantity increment/decrement/clamping, stock limits, remove/clear
* `search.test.js` – search, category/price filter, sorting
* `similar.test.js` – similar-product filtering
* `notifications.test.js` – scheduling, permission denied, cancellation (Notifee mocked)

## Troubleshooting
| Problem | Fix |
|---|---|
| `Can't find ViewManager 'RNSScreen'` | `react-native-screens` is missing from your own `package.json` or the app was not rebuilt. Run `npm install react-native-screens`, uninstall the app, `gradlew clean`, then `run-android`. |
| Same error for another native module | Same cause: install it as a direct dependency and rebuild natively. |
| No notification appears | Allow notifications in system settings. For a quick test set `REMINDER_DELAY_MS` in `src/constants/config.js` to `60 * 1000`; Android may delay inexact alarms. |
| `adb` not recognised | Use `& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"` or add platform-tools to PATH. |

## Assumptions and limitations
* DummyJSON is a mock API: checkout is simulated and no payment is processed.
* DummyJSON cannot combine search with a category, so choosing one clears the other.
* The price range filters already-loaded products on the device (the API has no price filter); more pages load automatically if too few match.
* Tab icons are emoji to avoid extra native icon packages.
* Tested flow targets Android; iOS was not tested.

## More documentation
* `docs/PERFORMANCE.md` – optimisations and how to capture React DevTools Profiler evidence
* `docs/CAPTURE.md` – screenshots and demo video
