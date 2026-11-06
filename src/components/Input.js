import React, { useState, forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius } from '../constants/theme';

const Input = forwardRef(({ label, error, style, icon, value, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <View style={styles.wrap}>
            {!!label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    !!error && styles.inputContainerError,
                    style,
                ]}
            >
                {!!icon && (
                    <MaterialCommunityIcons
                        name={icon}
                        size={responsiveFontSize(1.8)}
                        color={error ? colors.danger : isFocused ? colors.primary : colors.textMuted}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    ref={ref}
                    value={value}
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    onFocus={(e) => {
                        setIsFocused(true);
                        rest.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        rest.onBlur?.(e);
                    }}
                    {...rest}
                />

                {!error && hasValue && (
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={responsiveFontSize(1.8)}
                        color={colors.success}
                        style={styles.rightIcon}
                    />
                )}
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});

const styles = StyleSheet.create({
    wrap: {
        marginBottom: responsiveHeight(1.8),
    },
    label: {
        fontSize: responsiveFontSize(1.3),
        fontWeight: '700',
        color: colors.text,
        marginBottom: responsiveHeight(0.8),
        marginLeft: responsiveWidth(1),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: radius.md,
        paddingHorizontal: responsiveWidth(3.5),
        minHeight: responsiveHeight(6.5),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    inputContainerFocused: {
        borderColor: colors.primary,
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    inputContainerError: {
        borderColor: colors.danger,
        backgroundColor: '#FEF2F2',
    },
    leftIcon: {
        marginRight: responsiveWidth(2.5),
    },
    rightIcon: {
        marginLeft: responsiveWidth(2),
    },
    input: {
        flex: 1,
        fontSize: responsiveFontSize(1.5),
        color: colors.text,
        padding: 0,
        height: '100%',
    },
    error: {
        color: colors.danger,
        fontSize: responsiveFontSize(1.15),
        marginTop: responsiveHeight(0.5),
        marginLeft: responsiveWidth(1.5),
        fontWeight: '600',
    },
});

export default React.memo(Input);