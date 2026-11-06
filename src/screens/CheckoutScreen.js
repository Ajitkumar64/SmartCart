import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Animated,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { EmptyView } from '../components/StateViews';
import { colors, radius } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartTotals } from '../store/slices/cartSlice';
import { checkout } from '../store/slices/ordersSlice';
import { formatCurrency, getDiscountedPrice } from '../utils/pricing';
import { showToast } from '../utils/toast';

const EMPTY = { fullName: '', email: '', phone: '', address: '', city: '', postalCode: '' };

const validateField = (key, value) => {
    const trimmed = value.trim();
    switch (key) {
        case 'fullName':
            if (!trimmed) return 'Name is required';
            if (trimmed.length < 3) return 'Name must be at least 3 characters';
            if (!/^[a-zA-Z\s]+$/.test(trimmed)) return 'Letters and spaces only';
            return '';
        case 'email':
            if (!trimmed) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Invalid email format';
            return '';
        case 'phone':
            if (!trimmed) return 'Phone is required';
            if (!/^\+?[\d\s-]{10,15}$/.test(trimmed)) return 'Must be 10-15 digits';
            return '';
        case 'address':
            if (!trimmed) return 'Address is required';
            if (trimmed.length < 5) return 'Address must be at least 5 characters';
            return '';
        case 'city':
            if (!trimmed) return 'City is required';
            if (!/^[a-zA-Z\s]+$/.test(trimmed)) return 'Letters only';
            return '';
        case 'postalCode':
            if (!trimmed) return 'Postal code is required';
            if (!/^[a-zA-Z0-9\s-]{4,10}$/.test(trimmed)) return 'Invalid format (4-10 chars)';
            return '';
        default:
            return '';
    }
};

export default function CheckoutScreen() {
    const items = useAppSelector(selectCartItems);
    const totals = useAppSelector(selectCartTotals);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showSummarySheet, setShowSummarySheet] = useState(false);

    const scrollViewRef = useRef(null);

    const filledCount = Object.values(form).filter((v) => v && v.trim().length > 0).length;
    const totalFields = Object.keys(form).length;
    const progressPct = (filledCount / totalFields) * 100;

    const progressAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progressPct,
            duration: 350,
            useNativeDriver: false,
        }).start();
    }, [progressPct, progressAnim]);

    const setField = useCallback(
        (key) => (value) => {
            setForm((f) => ({ ...f, [key]: value }));
            const errorMsg = validateField(key, value);
            setErrors((e) => {
                if (errorMsg) return { ...e, [key]: errorMsg };
                const newErrors = { ...e };
                delete newErrors[key];
                return newErrors;
            });
        },
        [],
    );

    const submit = async () => {
        const found = {};
        Object.keys(form).forEach((key) => {
            const errorMsg = validateField(key, form[key]);
            if (errorMsg) found[key] = errorMsg;
        });

        setErrors(found);

        if (Object.keys(found).length > 0) {
            showToast('Please fix the errors before submitting.');
            return;
        }

        setSubmitting(true);
        const result = await dispatch(checkout(form));
        setSubmitting(false);

        if (checkout.fulfilled.match(result)) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Tabs' },
                        { name: 'OrderConfirmation', params: { orderId: result.payload.id } },
                    ],
                }),
            );
        } else {
            showToast(result.payload ?? 'Checkout failed. Please try again.');
        }
    };

    if (items.length === 0 && !submitting) {
        return (
            <EmptyView
                icon="🛒"
                title="Nothing to check out"
                message="Add some products to your cart first."
            />
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <View pointerEvents="none" style={styles.bgGlowTop} />
            <View pointerEvents="none" style={styles.bgGlowBottom} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.heroHeader}>
                        <View style={styles.heroDecor1} />
                        <View style={styles.heroDecor2} />
                        <View style={styles.heroDecor3} />

                        <View style={styles.heroTopRow}>
                            <View style={styles.heroIconBox}>
                                <MaterialCommunityIcons
                                    name="shield-lock-outline"
                                    size={responsiveFontSize(2.4)}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.heroTextWrap}>
                                <Text style={styles.heroTitle}>Secure Checkout</Text>
                                <Text style={styles.heroSubtitle}>Your details are safe with us</Text>
                            </View>
                        </View>

                        <View style={styles.heroDivider} />

                        <View style={styles.heroBottomRow}>
                            <View>
                                <Text style={styles.heroTotalLabel}>Total Amount</Text>
                                <Text style={styles.heroTotalAmount}>{formatCurrency(totals.grandTotal)}</Text>
                            </View>
                            <View style={styles.heroItemsBadge}>
                                <MaterialCommunityIcons
                                    name="cart-outline"
                                    size={responsiveFontSize(1.5)}
                                    color={colors.primary}
                                    style={{ marginRight: 4 }}
                                />
                                <Text style={styles.heroItemsText}>
                                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.heroTrustRow}>
                            <View style={styles.heroTrustChip}>
                                <MaterialCommunityIcons
                                    name="lock-check-outline"
                                    size={responsiveFontSize(1.3)}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.heroTrustText}>SSL Secure</Text>
                            </View>
                            <View style={styles.heroTrustChip}>
                                <MaterialCommunityIcons
                                    name="lightning-bolt-outline"
                                    size={responsiveFontSize(1.3)}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.heroTrustText}>Fast Checkout</Text>
                            </View>
                            <View style={styles.heroTrustChip}>
                                <MaterialCommunityIcons
                                    name="shield-check-outline"
                                    size={responsiveFontSize(1.3)}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.heroTrustText}>Protected</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.stepHeader}>
                        <View style={styles.stepIcon}>
                            <MaterialCommunityIcons
                                name="clipboard-text-outline"
                                size={responsiveFontSize(2)}
                                color={colors.primary}
                            />
                        </View>
                        <View>
                            <Text style={styles.stepTitle}>Order Summary</Text>
                            <Text style={styles.stepSubtitle}>Review your items</Text>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.summaryTrigger,
                            pressed && styles.summaryTriggerPressed,
                        ]}
                        onPress={() => setShowSummarySheet(true)}
                    >
                        <View style={styles.summaryTriggerLeft}>
                            <View style={styles.summaryIconWrap}>
                                <MaterialCommunityIcons
                                    name="receipt"
                                    size={responsiveFontSize(2)}
                                    color={colors.primary}
                                />
                            </View>
                            <View>
                                <Text style={styles.summaryTriggerTitle}>View Order Details</Text>
                                <Text style={styles.summaryTriggerSub}>
                                    {totals.itemCount} items · {formatCurrency(totals.subtotal)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.summaryChevronWrap}>
                            <MaterialCommunityIcons
                                name="chevron-down"
                                size={responsiveFontSize(2.2)}
                                color={colors.textMuted}
                            />
                        </View>
                    </Pressable>

                    <View style={styles.stepHeader}>
                        <View style={styles.stepIcon}>
                            <MaterialCommunityIcons
                                name="truck-delivery-outline"
                                size={responsiveFontSize(2)}
                                color={colors.primary}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stepTitle}>Delivery Details</Text>
                            <Text style={styles.stepSubtitle}>Where should we send your order?</Text>
                        </View>
                        <View style={styles.progressBadge}>
                            <Text style={styles.progressBadgeNum}>{filledCount}</Text>
                            <Text style={styles.progressBadgeDen}>/{totalFields}</Text>
                        </View>
                    </View>

                    <View style={styles.progressTrack}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconWrap}>
                            <MaterialCommunityIcons
                                name="account-circle-outline"
                                size={responsiveFontSize(1.8)}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.sectionLabel}>CONTACT INFORMATION</Text>
                        <View style={styles.sectionLine} />
                    </View>

                    <View style={styles.formWrapper}>
                        <FloatingInput
                            icon="account-outline"
                            label="Full name"
                            value={form.fullName}
                            onChangeText={setField('fullName')}
                            error={errors.fullName}
                            autoCapitalize="words"
                            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        />
                        <FloatingInput
                            icon="email-outline"
                            label="Email address"
                            value={form.email}
                            onChangeText={setField('email')}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        />
                        <FloatingInput
                            icon="phone-outline"
                            label="Phone number"
                            value={form.phone}
                            onChangeText={setField('phone')}
                            error={errors.phone}
                            keyboardType="phone-pad"
                            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIconWrap, styles.sectionIconWrapAmber]}>
                            <MaterialCommunityIcons
                                name="map-marker-radius-outline"
                                size={responsiveFontSize(1.8)}
                                color="#D97706"
                            />
                        </View>
                        <Text style={[styles.sectionLabel, styles.sectionLabelAmber]}>
                            DELIVERY ADDRESS
                        </Text>
                        <View style={styles.sectionLine} />
                    </View>

                    <View style={styles.formWrapper}>
                        <FloatingInput
                            icon="map-marker-outline"
                            label="Street address"
                            value={form.address}
                            onChangeText={setField('address')}
                            error={errors.address}
                            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        />

                        <View style={styles.rowInputs}>
                            <View style={{ flex: 1, marginRight: responsiveWidth(3) }}>
                                <FloatingInput
                                    icon="city-variant-outline"
                                    label="City"
                                    value={form.city}
                                    onChangeText={setField('city')}
                                    error={errors.city}
                                    onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FloatingInput
                                    icon="numeric"
                                    label="Postal code"
                                    value={form.postalCode}
                                    onChangeText={setField('postalCode')}
                                    error={errors.postalCode}
                                    autoCapitalize="characters"
                                    onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.noteBox}>
                        <View style={styles.noteIconWrap}>
                            <MaterialCommunityIcons
                                name="credit-card-check-outline"
                                size={responsiveFontSize(2)}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.noteText}>
                            This is a simulated checkout. No real payment will be processed.
                        </Text>
                    </View>

                    <View style={{ height: responsiveHeight(14) }} />
                </ScrollView>

                <View style={styles.floatingBar}>
                    <Pressable
                        onPress={submit}
                        disabled={submitting}
                        style={({ pressed }) => [
                            styles.submitBtn,
                            pressed && styles.submitBtnPressed,
                            submitting && styles.submitBtnDisabled,
                        ]}
                    >
                        {submitting ? (
                            <View style={styles.submitLoadingRow}>
                                <ActivityIndicator size="small" color="#FFFFFF" />
                                <Text style={styles.submitLoadingText}>Processing...</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.submitBtnTextCol}>
                                    <Text style={styles.submitBtnLabel}>Total to pay</Text>
                                    <Text style={styles.submitBtnTotal}>
                                        {formatCurrency(totals.grandTotal)}
                                    </Text>
                                </View>
                                <View style={styles.submitBtnArrow}>
                                    <MaterialCommunityIcons
                                        name="arrow-right"
                                        size={responsiveFontSize(2)}
                                        color={colors.primary}
                                    />
                                </View>
                            </>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            <Modal
                visible={showSummarySheet}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSummarySheet(false)}
            >
                <View style={styles.modalBg}>
                    <Pressable
                        style={styles.modalDismissArea}
                        onPress={() => setShowSummarySheet(false)}
                    />

                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />

                        <View style={styles.sheetHeader}>
                            <View>
                                <Text style={styles.sheetTitle}>Order Details</Text>
                                <Text style={styles.sheetSubtitle}>Review before you pay</Text>
                            </View>
                            <Pressable
                                onPress={() => setShowSummarySheet(false)}
                                style={styles.closeBtn}
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={responsiveFontSize(2.2)}
                                    color={colors.text}
                                />
                            </Pressable>
                        </View>

                        <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                            <View style={styles.receiptCard}>
                                {items.map((i) => (
                                    <View key={i.product.id} style={styles.receiptLine}>
                                        <View style={styles.qtyBadge}>
                                            <Text style={styles.qtyBadgeText}>{i.quantity}x</Text>
                                        </View>
                                        <Text style={styles.receiptItemTitle} numberOfLines={1}>
                                            {i.product.title}
                                        </Text>
                                        <Text style={styles.receiptValue}>
                                            {formatCurrency(getDiscountedPrice(i.product) * i.quantity)}
                                        </Text>
                                    </View>
                                ))}

                                <View style={styles.dashedDivider} />

                                <View style={styles.receiptLine}>
                                    <Text style={styles.receiptMuted}>Subtotal</Text>
                                    <Text style={styles.receiptValue}>
                                        {formatCurrency(totals.subtotal)}
                                    </Text>
                                </View>
                                <View style={styles.receiptLine}>
                                    <Text style={styles.receiptMuted}>Discount</Text>
                                    <Text style={[styles.receiptValue, { color: colors.success }]}>
                                        -{formatCurrency(totals.discount)}
                                    </Text>
                                </View>
                                <View style={[styles.receiptLine, { marginTop: responsiveHeight(1) }]}>
                                    <Text style={styles.receiptTotalLabel}>Total</Text>
                                    <Text style={styles.receiptTotalValue}>
                                        {formatCurrency(totals.grandTotal)}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <Pressable
                            style={styles.sheetDoneBtn}
                            onPress={() => setShowSummarySheet(false)}
                        >
                            <Text style={styles.sheetDoneText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function FloatingInput({ icon, label, error, value, onFocus, onBlur, ...props }) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const isActive = isFocused || hasValue;

    const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: isActive ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isActive, anim]);

    const labelTop = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [responsiveHeight(1.9), responsiveHeight(0.7)],
    });

    const labelSize = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [responsiveFontSize(1.4), responsiveFontSize(1.05)],
    });

    const labelColor = error ? colors.danger : isFocused ? colors.primary : colors.textMuted;

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <View style={styles.inputGroup}>
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}
            >
                <View style={[styles.iconBox, isFocused && styles.iconBoxFocused]}>
                    <MaterialCommunityIcons
                        name={icon}
                        size={responsiveFontSize(1.8)}
                        color={error ? colors.danger : isFocused ? '#FFFFFF' : colors.textMuted}
                    />
                </View>

                <View style={styles.inputTextWrap}>
                    <Animated.Text
                        style={[
                            styles.floatingLabel,
                            {
                                top: labelTop,
                                fontSize: labelSize,
                                color: labelColor,
                            },
                        ]}
                    >
                        {label}
                    </Animated.Text>
                    <TextInput
                        style={styles.textInput}
                        placeholderTextColor={colors.textMuted}
                        value={value}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...props}
                    />
                </View>

                {!error && hasValue && (
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={responsiveFontSize(1.6)}
                        color={colors.success}
                    />
                )}
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bgGlowTop: {
        position: 'absolute',
        top: -responsiveHeight(8),
        right: -responsiveWidth(20),
        width: responsiveWidth(70),
        height: responsiveWidth(70),
        borderRadius: responsiveWidth(35),
        backgroundColor: `${colors.primary}12`,
    },
    bgGlowBottom: {
        position: 'absolute',
        bottom: -responsiveHeight(10),
        left: -responsiveWidth(25),
        width: responsiveWidth(80),
        height: responsiveWidth(80),
        borderRadius: responsiveWidth(40),
        backgroundColor: `${colors.primary}08`,
    },
    content: {
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(2),
        flexGrow: 1,
    },

    heroHeader: {
        backgroundColor: colors.primary,
        borderRadius: responsiveWidth(6),
        padding: responsiveWidth(5),
        marginBottom: responsiveHeight(3.5),
        overflow: 'hidden',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.38,
        shadowRadius: 18,
        elevation: 9,
    },
    heroDecor1: {
        position: 'absolute',
        top: -responsiveWidth(10),
        right: -responsiveWidth(10),
        width: responsiveWidth(35),
        height: responsiveWidth(35),
        borderRadius: responsiveWidth(17.5),
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    heroDecor2: {
        position: 'absolute',
        bottom: -responsiveWidth(15),
        left: -responsiveWidth(5),
        width: responsiveWidth(25),
        height: responsiveWidth(25),
        borderRadius: responsiveWidth(12.5),
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    heroDecor3: {
        position: 'absolute',
        top: responsiveWidth(20),
        right: responsiveWidth(12),
        width: responsiveWidth(12),
        height: responsiveWidth(12),
        borderRadius: responsiveWidth(6),
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(2),
    },
    heroIconBox: {
        width: responsiveFontSize(4.5),
        height: responsiveFontSize(4.5),
        borderRadius: responsiveFontSize(1.5),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
    },
    heroTextWrap: {
        flex: 1,
    },
    heroTitle: {
        fontSize: responsiveFontSize(1.9),
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    heroSubtitle: {
        fontSize: responsiveFontSize(1.25),
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    heroDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: responsiveHeight(2),
    },
    heroBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroTotalLabel: {
        fontSize: responsiveFontSize(1.2),
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        marginBottom: 2,
    },
    heroTotalAmount: {
        fontSize: responsiveFontSize(2.6),
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    heroItemsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(0.6),
        borderRadius: radius.pill,
    },
    heroItemsText: {
        fontSize: responsiveFontSize(1.2),
        fontWeight: '800',
        color: colors.primary,
    },
    heroTrustRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: responsiveWidth(2),
        marginTop: responsiveHeight(2),
    },
    heroTrustChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(1),
        backgroundColor: 'rgba(255,255,255,0.14)',
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveHeight(0.6),
        borderRadius: radius.pill,
    },
    heroTrustText: {
        fontSize: responsiveFontSize(1.05),
        fontWeight: '700',
        color: '#FFFFFF',
    },

    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.5),
        gap: responsiveWidth(3),
    },
    stepIcon: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4),
        borderRadius: responsiveFontSize(1.2),
        backgroundColor: `${colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepTitle: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.3,
    },
    stepSubtitle: {
        fontSize: responsiveFontSize(1.2),
        color: colors.textMuted,
        marginTop: 2,
    },

    progressBadge: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: `${colors.primary}14`,
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveHeight(0.4),
        borderRadius: radius.pill,
    },
    progressBadgeNum: {
        fontSize: responsiveFontSize(1.4),
        fontWeight: '900',
        color: colors.primary,
    },
    progressBadgeDen: {
        fontSize: responsiveFontSize(1.1),
        fontWeight: '800',
        color: `${colors.primary}99`,
    },
    progressTrack: {
        height: responsiveHeight(0.7),
        backgroundColor: '#E2E8F0',
        borderRadius: radius.pill,
        overflow: 'hidden',
        marginBottom: responsiveHeight(2.5),
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.2),
        marginTop: responsiveHeight(0.5),
        gap: responsiveWidth(2),
    },
    sectionIconWrap: {
        width: responsiveFontSize(3.2),
        height: responsiveFontSize(3.2),
        borderRadius: responsiveFontSize(1),
        backgroundColor: `${colors.primary}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionIconWrapAmber: {
        backgroundColor: '#FEF3C7',
    },
    sectionLabel: {
        fontSize: responsiveFontSize(1.1),
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: 1.2,
    },
    sectionLabelAmber: {
        color: '#D97706',
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
        marginLeft: responsiveWidth(1),
    },

    summaryTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: responsiveWidth(5),
        padding: responsiveWidth(4.5),
        marginBottom: responsiveHeight(3.5),
        borderWidth: 1,
        borderColor: '#EEF2F7',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3,
    },
    summaryTriggerPressed: {
        backgroundColor: '#F8FAFC',
        transform: [{ scale: 0.98 }],
    },
    summaryTriggerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIconWrap: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4),
        borderRadius: responsiveFontSize(1.2),
        backgroundColor: `${colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
    },
    summaryTriggerTitle: {
        fontSize: responsiveFontSize(1.5),
        fontWeight: '800',
        color: colors.text,
    },
    summaryTriggerSub: {
        fontSize: responsiveFontSize(1.25),
        color: colors.textMuted,
        marginTop: 2,
    },
    summaryChevronWrap: {
        width: responsiveFontSize(3.2),
        height: responsiveFontSize(3.2),
        borderRadius: responsiveFontSize(1.6),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    formWrapper: {
        marginBottom: responsiveHeight(2.5),
    },
    inputGroup: {
        marginBottom: responsiveHeight(1.2),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
        borderRadius: responsiveWidth(3.5),
        paddingHorizontal: responsiveWidth(3),
        height: responsiveHeight(6.2),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    inputContainerFocused: {
        borderColor: colors.primary,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
    },
    inputContainerError: {
        borderColor: colors.danger,
        backgroundColor: '#FEF2F2',
    },
    iconBox: {
        width: responsiveFontSize(3.2),
        height: responsiveFontSize(3.2),
        borderRadius: responsiveFontSize(1),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(2.5),
    },
    iconBoxFocused: {
        backgroundColor: colors.primary,
    },
    inputTextWrap: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
    },
    floatingLabel: {
        position: 'absolute',
        left: 0,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    textInput: {
        fontSize: responsiveFontSize(1.45),
        color: colors.text,
        fontWeight: '600',
        padding: 0,
        marginTop: responsiveHeight(1.4),
        height: responsiveHeight(3),
    },
    errorText: {
        color: colors.danger,
        fontSize: responsiveFontSize(1.15),
        marginTop: responsiveHeight(0.3),
        marginLeft: responsiveWidth(2),
        fontWeight: '600',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    noteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsiveWidth(4),
        borderRadius: responsiveWidth(4),
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EEF2F7',
        gap: responsiveWidth(2.5),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    noteIconWrap: {
        width: responsiveFontSize(3.6),
        height: responsiveFontSize(3.6),
        borderRadius: responsiveFontSize(1.1),
        backgroundColor: `${colors.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteText: {
        flex: 1,
        fontSize: responsiveFontSize(1.25),
        color: colors.textMuted,
        lineHeight: responsiveFontSize(1.8),
    },

    floatingBar: {
        position: 'absolute',
        bottom: responsiveHeight(3),
        left: responsiveWidth(5),
        right: responsiveWidth(5),
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        borderRadius: responsiveWidth(4.5),
        paddingVertical: responsiveHeight(1.6),
        paddingHorizontal: responsiveWidth(5),
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    submitBtnPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    submitBtnDisabled: {
        backgroundColor: colors.textMuted,
        shadowOpacity: 0,
        elevation: 0,
        justifyContent: 'center',
    },
    submitBtnTextCol: {
        flex: 1,
    },
    submitBtnLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: responsiveFontSize(1.2),
        fontWeight: '600',
        marginBottom: 2,
    },
    submitBtnTotal: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(1.8),
        fontWeight: '800',
    },
    submitBtnArrow: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4),
        borderRadius: responsiveFontSize(2),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitLoadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: responsiveWidth(2.5),
    },
    submitLoadingText: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(1.5),
        fontWeight: '800',
    },

    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.5)',
        justifyContent: 'flex-end',
    },
    modalDismissArea: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: '#F4F6F9',
        borderTopLeftRadius: responsiveWidth(8),
        borderTopRightRadius: responsiveWidth(8),
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(1.5),
        paddingBottom: responsiveHeight(4),
        maxHeight: '82%',
    },
    sheetHandle: {
        width: responsiveWidth(12),
        height: responsiveHeight(0.6),
        borderRadius: responsiveHeight(0.3),
        backgroundColor: '#CBD5E1',
        alignSelf: 'center',
        marginBottom: responsiveHeight(2),
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(2),
    },
    sheetTitle: {
        fontSize: responsiveFontSize(2),
        fontWeight: '900',
        color: colors.text,
        letterSpacing: -0.3,
    },
    sheetSubtitle: {
        fontSize: responsiveFontSize(1.2),
        color: colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    closeBtn: {
        width: responsiveFontSize(3.5),
        height: responsiveFontSize(3.5),
        borderRadius: responsiveFontSize(1.75),
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetScroll: {
        marginBottom: responsiveHeight(2),
    },
    receiptCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: responsiveWidth(4),
        padding: responsiveWidth(4),
        borderWidth: 1,
        borderColor: '#EEF2F7',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    receiptLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: responsiveHeight(0.8),
    },
    qtyBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.3),
        borderRadius: radius.sm,
        marginRight: responsiveWidth(2.5),
    },
    qtyBadgeText: {
        fontSize: responsiveFontSize(1.2),
        fontWeight: '800',
        color: colors.textMuted,
    },
    receiptItemTitle: {
        flex: 1,
        fontSize: responsiveFontSize(1.4),
        color: colors.text,
        fontWeight: '600',
        marginRight: responsiveWidth(3),
    },
    receiptValue: {
        fontSize: responsiveFontSize(1.4),
        fontWeight: '700',
        color: colors.text,
    },
    dashedDivider: {
        height: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginVertical: responsiveHeight(1.5),
        borderRadius: 1,
    },
    receiptMuted: {
        fontSize: responsiveFontSize(1.4),
        color: colors.textMuted,
        fontWeight: '600',
    },
    receiptTotalLabel: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: '800',
        color: colors.text,
    },
    receiptTotalValue: {
        fontSize: responsiveFontSize(2),
        fontWeight: '900',
        color: colors.primary,
    },
    sheetDoneBtn: {
        backgroundColor: colors.primary,
        paddingVertical: responsiveHeight(1.8),
        borderRadius: responsiveWidth(4),
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    sheetDoneText: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(1.6),
        fontWeight: '800',
    },
});