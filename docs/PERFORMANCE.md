# Performance Optimisation

## What was done
| Area | Technique | Where |
|---|---|---|
| List rendering | `FlatList` with `getItemLayout` (fixed row height), `initialNumToRender=6`, `maxToRenderPerBatch=6`, `windowSize=7`, `removeClippedSubviews`, stable `keyExtractor` (product id) | `HomeScreen`, `WishlistScreen` |
| Re-renders | `React.memo` on `ProductCard`, `CartItemRow`, `CategoryChips`, `QuantityStepper`, `SearchBar`, `FilterModal`, state views | `components/` |
| Stable props | `useCallback` for all handlers / `renderItem`; `useMemo` for chip data | screens, `CategoryChips` |
| Cheap Redux reads | Narrow selectors (`s => s.products.status`), memoised `createSelector` for visible products, cart totals, wishlist id-map | slices |
| Fewer store updates | Persistence writes only when the data reference changes; wishlist heart looked up via an id→true map (O(1)) | `persistence.js`, `wishlistSlice` |
| Network | 400 ms debounced search; duplicate-request guard; stale response discard; cached first page | `useDebounce`, `productsSlice` |

## Capturing React DevTools Profiler evidence
1. `npx react-devtools` (opens the standalone DevTools window).
2. Android emulator/device: `adb reverse tcp:8097 tcp:8097`, then reload the app (`r` in Metro). The app appears in DevTools.
3. Open the **Profiler** tab → settings (gear) → enable **"Record why each component rendered"**.
4. Press **Record**, then on Home: scroll the list, toggle a wishlist heart, add a product to the cart, type in search. Press **Stop**.
5. Take screenshots of the **Flamegraph** and **Ranked** views. Point out that only the toggled `ProductCard` re-rendered (others show "Did not render").
6. For a before/after comparison, temporarily remove `React.memo` from `ProductCard` (export the plain function), repeat steps 4–5, and compare commit durations and the number of re-rendered cards.
7. Save screenshots / export the profile (`Save profile…`) into `docs/profiler/`.
