import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveHeight,
    responsiveFontSize,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius } from '../constants/theme';

function SearchBar({ value, onChangeText, onClear, onOpenFilters, filtersActive }) {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.row}>
            <View style={[styles.shell, focused && styles.shellFocused]}>
                <View style={[styles.magnifyBadge, focused && styles.magnifyBadgeFocused]}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={responsiveFontSize(2.2)}
                        color={focused ? '#FFFFFF' : colors.primary}
                    />
                </View>

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Search products"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    returnKeyType="search"
                    autoCorrect={false}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />

                {value.length > 0 && (
                    <Pressable
                        onPress={onClear}
                        hitSlop={10}
                        accessibilityLabel="Clear search"
                        style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}
                    >
                        <MaterialCommunityIcons
                            name="close-circle"
                            size={responsiveFontSize(2.1)}
                            color={colors.textMuted}
                        />
                    </Pressable>
                )}

                <View style={styles.divider} />

                <Pressable
                    onPress={onOpenFilters}
                    style={({ pressed }) => [styles.filterBtn, pressed && styles.filterPressed]}
                    accessibilityLabel="Filters and sorting"
                >
                    <MaterialCommunityIcons
                        name="tune-variant"
                        size={responsiveFontSize(2.4)}
                        color={filtersActive ? colors.primary : colors.textMuted}
                    />
                    {filtersActive && <View style={styles.dot} />}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(0.8),
        paddingBottom: responsiveHeight(1.4),
    },
    shell: {
        flexDirection: 'row',
        alignItems: 'center',
        height: responsiveHeight(6.4),
        paddingLeft: responsiveWidth(1.5),
        paddingRight: responsiveWidth(1.5),
        backgroundColor: colors.surface,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: colors.border,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    shellFocused: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },
    magnifyBadge: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4),
        borderRadius: responsiveFontSize(2),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${colors.primary}14`,
    },
    magnifyBadgeFocused: {
        backgroundColor: colors.primary,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: responsiveFontSize(1.7),
        color: colors.text,
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: 0,
    },
    clearBtn: {
        marginRight: responsiveWidth(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearBtnPressed: {
        opacity: 0.55,
    },
    divider: {
        width: 1,
        height: '45%',
        backgroundColor: colors.border,
        marginHorizontal: responsiveWidth(1.5),
    },
    filterBtn: {
        width: responsiveFontSize(3.6),
        height: responsiveFontSize(3.6),
        borderRadius: responsiveFontSize(1.8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterPressed: {
        transform: [{ scale: 0.9 }],
        opacity: 0.85,
    },
    dot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: responsiveFontSize(0.9),
        height: responsiveFontSize(0.9),
        borderRadius: responsiveFontSize(0.45),
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.surface,
    },
});

export default React.memo(SearchBar);