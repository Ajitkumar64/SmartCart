import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import CategoryChips from '../components/CategoryChips';
import FilterModal from '../components/FilterModal';
import OfflineBanner from '../components/OfflineBanner';
import ProductCard, { ROW_HEIGHT } from '../components/ProductCard';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import Button from '../components/Button';

import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '../constants/config';
import { colors } from '../constants/theme';
import { useDebounce } from '../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import {
    fetchProducts,
    resetFilters,
    selectHasMore,
    selectVisibleProducts,
    setCategory,
    setPriceRange,
    setQuery,
    setSort,
} from '../store/slices/productsSlice';
import { selectWishlistMap, toggleWishlist } from '../store/slices/wishlistSlice';
import { toSnapshot } from '../utils/product';
import { showToast } from '../utils/toast';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';

const NUM_COLUMNS = 2;
const INITIAL_BATCH = 6;

export default function HomeScreen() {
    const products = useAppSelector(selectVisibleProducts);
    const status = useAppSelector((s) => s.products.status);
    const loadingMore = useAppSelector((s) => s.products.loadingMore);
    const refreshing = useAppSelector((s) => s.products.refreshing);
    const error = useAppSelector((s) => s.products.error);
    const fromCache = useAppSelector((s) => s.products.fromCache);
    const query = useAppSelector((s) => s.products.query);
    const category = useAppSelector((s) => s.products.category);
    const sort = useAppSelector((s) => s.products.sort);
    const priceRange = useAppSelector((s) => s.products.priceRange);
    const hasMore = useAppSelector(selectHasMore);
    const wishlistMap = useAppSelector(selectWishlistMap);
    const categories = useAppSelector((s) => s.categories.items);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const [text, setText] = useState(query);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const debouncedText = useDebounce(text, SEARCH_DEBOUNCE_MS);

    const priceActive = priceRange.min !== null || priceRange.max !== null;
    const filtersActive = sort !== 'default' || priceActive;

    const isInitialLoading = status === 'loading' && products.length === 0;
    const isInitialError = status === 'failed' && products.length === 0;

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setQuery(debouncedText));
    }, [debouncedText, dispatch]);

    useEffect(() => {
        dispatch(fetchProducts({ reset: true }));
    }, [query, category, sort, dispatch]);

    useEffect(() => {
        const needsTopUp =
            priceActive &&
            products.length < PAGE_SIZE / 2 &&
            hasMore &&
            status === 'succeeded' &&
            !loadingMore &&
            !refreshing &&
            !error;

        if (needsTopUp) {
            dispatch(fetchProducts({ reset: false }));
        }
    }, [
        priceActive,
        products.length,
        hasMore,
        status,
        loadingMore,
        refreshing,
        error,
        dispatch,
    ]);

    const endReachedLock = useRef(false);

    useEffect(() => {
        if (!loadingMore && !refreshing) {
            endReachedLock.current = false;
        }
    }, [loadingMore, refreshing]);

    const handlePress = useCallback(
        (id) => navigation.navigate('ProductDetails', { productId: id }),
        [navigation],
    );

    const handleToggleWishlist = useCallback(
        (product) => dispatch(toggleWishlist(toSnapshot(product))),
        [dispatch],
    );

    const handleAdd = useCallback(
        (product) => {
            if (product.stock <= 0) return;
            dispatch(addToCart({ product: toSnapshot(product) }));
            showToast('Added to cart');
        },
        [dispatch],
    );

    const handleSelectCategory = useCallback(
        (nextCategory) => {
            setText('');
            dispatch(setCategory(nextCategory));
        },
        [dispatch],
    );

    const handleClear = useCallback(() => {
        setText('');
        dispatch(setQuery(''));
    }, [dispatch]);

    const handleOpenFilters = useCallback(() => setFiltersOpen(true), []);
    const handleCloseFilters = useCallback(() => setFiltersOpen(false), []);

    const handleRefresh = useCallback(() => {
        endReachedLock.current = false;
        dispatch(fetchProducts({ reset: true, refresh: true }));
    }, [dispatch]);

    const handleRetry = useCallback(() => {
        endReachedLock.current = false;
        dispatch(fetchProducts({ reset: true }));
    }, [dispatch]);

    const handleEndReached = useCallback(() => {
        if (!hasMore || endReachedLock.current || loadingMore || refreshing) return;
        endReachedLock.current = true;
        dispatch(fetchProducts({ reset: false }));
    }, [dispatch, hasMore, loadingMore, refreshing]);

    const handleApply = useCallback(
        (nextSort, nextPriceRange) => {
            dispatch(setSort(nextSort));
            dispatch(setPriceRange(nextPriceRange));
            setFiltersOpen(false);
        },
        [dispatch],
    );

    const handleReset = useCallback(() => {
        setText('');
        dispatch(resetFilters());
        setFiltersOpen(false);
    }, [dispatch]);

    const renderItem = useCallback(
        ({ item }) => (
            <ProductCard
                product={item}
                isWishlisted={!!wishlistMap[item.id]}
                onPress={handlePress}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAdd}
            />
        ),
        [wishlistMap, handlePress, handleToggleWishlist, handleAdd],
    );

    const keyExtractor = useCallback((item) => String(item.id), []);

    const getItemLayout = useCallback(
        (_, index) => ({
            length: ROW_HEIGHT,
            offset: ROW_HEIGHT * index,
            index,
        }),
        [],
    );

    const listFooter = useMemo(() => {
        if (loadingMore) {
            return <ActivityIndicator style={styles.footer} color={colors.primary} />;
        }

        if (error && products.length > 0) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{error}</Text>
                    <Button
                        title="Retry"
                        variant="outline"
                        onPress={handleEndReached}
                        style={styles.footerButton}
                    />
                </View>
            );
        }

        return null;
    }, [loadingMore, error, products.length, handleEndReached]);

    const listEmpty = useMemo(
        () => (
            <EmptyView
                title="No products found"
                message="Try a different search or adjust your filters."
                actionLabel="Reset filters"
                onAction={handleReset}
            />
        ),
        [handleReset],
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.hero}>
                <ScreenHeader title="SmartCart" subtitle="Find something you'll love" />

                <OfflineBanner message={fromCache ? 'Showing saved products.' : undefined} />

                <SearchBar
                    value={text}
                    onChangeText={setText}
                    onClear={handleClear}
                    onOpenFilters={handleOpenFilters}
                    filtersActive={filtersActive}
                />

                <CategoryChips
                    categories={categories}
                    selected={category}
                    onSelect={handleSelectCategory}
                />
            </View>

            <View style={styles.listArea}>
                {isInitialLoading ? (
                    <LoadingView label="Loading products…" />
                ) : isInitialError ? (
                    <ErrorView
                        message={error ?? 'Could not load products.'}
                        onRetry={handleRetry}
                    />
                ) : (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>All Products</Text>
                            <View style={styles.countPill}>
                                <Text style={styles.countText}>{products.length}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={products}
                                extraData={wishlistMap}
                                renderItem={renderItem}
                                keyExtractor={keyExtractor}
                                getItemLayout={getItemLayout}
                                numColumns={NUM_COLUMNS}
                                style={styles.flatList}
                                columnWrapperStyle={styles.column}
                                contentContainerStyle={styles.list}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="on-drag"
                                onEndReached={handleEndReached}
                                onEndReachedThreshold={0.5}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={handleRefresh}
                                        colors={[colors.primary]}
                                        tintColor={colors.primary}
                                    />
                                }
                                ListFooterComponent={listFooter}
                                ListEmptyComponent={listEmpty}
                                initialNumToRender={INITIAL_BATCH}
                                maxToRenderPerBatch={INITIAL_BATCH}
                                windowSize={7}
                                updateCellsBatchingPeriod={50}
                                removeClippedSubviews={Platform.OS === 'android'}
                            />
                        </View>
                    </>
                )}
            </View>

            <FilterModal
                visible={filtersOpen}
                sort={sort}
                priceRange={priceRange}
                onClose={handleCloseFilters}
                onApply={handleApply}
                onReset={handleReset}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    hero: {
        backgroundColor: colors.surface,
        borderBottomLeftRadius: responsiveWidth(6),
        borderBottomRightRadius: responsiveWidth(6),
        paddingBottom: responsiveHeight(0.6),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 4,
    },
    listArea: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: responsiveWidth(4),
        borderTopRightRadius: responsiveWidth(4),
        marginTop: -responsiveWidth(2),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(1.6),
        paddingBottom: responsiveHeight(0.4),
    },
    sectionTitle: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: '800',
        color: colors.text,
        letterSpacing: 0.2,
    },
    countPill: {
        minWidth: responsiveWidth(7),
        height: responsiveHeight(2.6),
        borderRadius: responsiveWidth(3.5),
        paddingHorizontal: responsiveWidth(2.2),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: responsiveFontSize(1.3),
        fontWeight: '700',
        color: colors.primary,
    },
    list: {
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(0.5),
        paddingBottom: responsiveHeight(13),
        flexGrow: 1,
    },
    flatList: {
        flex: 1,
    },
    column: {
        justifyContent: 'space-between',
    },
    footer: {
        paddingVertical: responsiveHeight(2),
        alignItems: 'center',
    },
    footerText: {
        color: colors.danger,
        fontSize: responsiveFontSize(1.4),
        textAlign: 'center',
    },
    footerButton: {
        marginTop: responsiveHeight(1),
    },
});