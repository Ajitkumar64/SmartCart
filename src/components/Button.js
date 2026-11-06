import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius } from '../constants/theme';

function Button({
    title,
    onPress,
    variant = 'primary',
    disabled,
    loading,
    style,
    icon,
    iconPosition = 'left',
}) {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isGhost = variant === 'ghost';

    const iconColor = isPrimary ? '#FFFFFF' : colors.primary;
    const spinnerColor = isPrimary ? '#FFFFFF' : colors.primary;

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.base,
                isPrimary && styles.primary,
                isOutline && styles.outline,
                isGhost && styles.ghost,
                (disabled || loading) && styles.disabled,
                pressed && !disabled && !loading && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={spinnerColor} size="small" />
            ) : (
                <>
                    {!!icon && iconPosition === 'left' && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={responsiveFontSize(1.8)}
                            color={iconColor}
                            style={styles.iconLeft}
                        />
                    )}

                    <Text style={[styles.text, !isPrimary && styles.textAlt]}>
                        {title}
                    </Text>

                    {!!icon && iconPosition === 'right' && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={responsiveFontSize(1.8)}
                            color={iconColor}
                            style={styles.iconRight}
                        />
                    )}
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        minHeight: responsiveHeight(6.2),
        borderRadius: responsiveWidth(3.5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(1.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
        paddingVertical: responsiveHeight(1),
    },
    disabled: {
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },
    pressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.85,
    },
    text: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(1.55),
        fontWeight: '800',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    textAlt: {
        color: colors.primary,
    },
    iconLeft: {
        marginRight: responsiveWidth(2),
    },
    iconRight: {
        marginLeft: responsiveWidth(2),
    },
});

export default React.memo(Button);