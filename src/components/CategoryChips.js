import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveHeight,
    responsiveFontSize,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius } from '../constants/theme';
import { formatCategory } from '../utils/product';

const ALL = '__all__';

const CATEGORY_ICONS = {
    electronics: 'laptop',
    jewelery: 'diamond-stone',
    "men's clothing": 'tshirt-crew',
    "women's clothing": 'tshirt-crew-outline',
};

const DEFAULT_ICON = 'shape-outline';
const ALL_ICON = 'view-grid-outline';

function CategoryChips({ categories, selected, onSelect }) {
    const data = useMemo(() => [ALL, ...categories], [categories]);

    const renderItem = useCallback(
        ({ item }) => {
            const isAll = item === ALL;
            const active = isAll ? selected === null : selected === item;
            const iconName = isAll ? ALL_ICON : CATEGORY_ICONS[item] ?? DEFAULT_ICON;
            const label = isAll ? 'All' : formatCategory(item);

            return (
                <Pressable
                    onPress={() => onSelect(isAll ? null : item)}
                    style={({ pressed }) => [
                        styles.chip,
                        active && styles.chipActive,
                        pressed && styles.chipPressed,
                    ]}
                >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                        <MaterialCommunityIcons
                            name={iconName}
                            size={responsiveFontSize(1.8)}
                            color={active ? colors.primary : colors.textMuted}
                        />
                    </View>
                    <Text style={[styles.text, active && styles.textActive]} numberOfLines={1}>
                        {label}
                    </Text>
                </Pressable>
            );
        },
        [selected, onSelect],
    );

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            extraData={selected}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            style={styles.flat}
        />
    );
}

const styles = StyleSheet.create({
    flat: {
        flexGrow: 0,
    },
    list: {
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        gap: responsiveWidth(1.2),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        height: responsiveHeight(4.2),
        paddingLeft: responsiveWidth(1.4),
        paddingRight: responsiveWidth(4),
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    chipPressed: {
        transform: [{ scale: 0.96 }],
        opacity: 0.9,
    },
    iconWrap: {
        width: responsiveFontSize(3.4),
        height: responsiveFontSize(3.4),
        borderRadius: responsiveFontSize(1.7),
        backgroundColor: `${colors.textMuted}14`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(2),
    },
    iconWrapActive: {
        backgroundColor: '#FFFFFF',
    },
    text: {
        fontSize: responsiveFontSize(1.5),
        fontWeight: '700',
        color: colors.text,
        letterSpacing: 0.15,
    },
    textActive: {
        color: '#FFFFFF',
    },
});

export default React.memo(CategoryChips);