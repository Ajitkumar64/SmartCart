import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveHeight,
    responsiveFontSize,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors } from '../constants/theme';

const ScreenHeader = ({ title, subtitle }) => {
    return (
        <View style={styles.wrap}>
            <View style={styles.decorCircle} />
            <View style={styles.decorCircleSm} />

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <View style={styles.accentBar} />
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {!!subtitle && (
                    <View style={styles.subtitleRow}>
                        <MaterialCommunityIcons
                            name="star-four-points-outline"
                            size={responsiveFontSize(1.7)}
                            color={colors.primary}
                        />
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default React.memo(ScreenHeader);

const styles = StyleSheet.create({
    wrap: {
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(1.8),
        paddingBottom: responsiveHeight(1.2),
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        top: -responsiveWidth(8),
        right: -responsiveWidth(10),
        width: responsiveWidth(30),
        height: responsiveWidth(30),
        borderRadius: responsiveWidth(15),
        backgroundColor: colors.primary,
        opacity: 0.06,
    },
    decorCircleSm: {
        position: 'absolute',
        top: responsiveHeight(3),
        right: responsiveWidth(6),
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(5),
        backgroundColor: colors.primary,
        opacity: 0.1,
    },
    content: {
        zIndex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accentBar: {
        width: responsiveWidth(1.1),
        height: responsiveFontSize(3.2),
        borderRadius: responsiveWidth(0.6),
        backgroundColor: colors.primary,
        marginRight: responsiveWidth(2.5),
    },
    title: {
        flex: 1,
        fontSize: responsiveFontSize(3),
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.5,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(0.6),
        paddingLeft: responsiveWidth(1.1) + responsiveWidth(2.5),
    },
    subtitle: {
        marginLeft: responsiveWidth(1.5),
        fontSize: responsiveFontSize(1.6),
        color: colors.textMuted,
        letterSpacing: 0.15,
    },
});