import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors } from '../constants/theme';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

function OfflineBanner({ message }) {
    const online = useNetworkStatus();

    if (online && !message) {
        return null;
    }

    const isOffline = !online;

    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                        name={isOffline ? 'wifi-off' : 'information-outline'}
                        size={responsiveFontSize(1.8)}
                        color={colors.warningText}
                    />
                </View>
                <Text style={styles.text}>
                    {isOffline
                        ? "You're offline. Showing saved data where available."
                        : message}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(1),
        paddingBottom: responsiveHeight(0.5),
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warning,
        paddingVertical: responsiveHeight(1.2),
        paddingHorizontal: responsiveWidth(3.5),
        borderRadius: responsiveWidth(3),
        shadowColor: colors.warning,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 3,
    },
    iconWrap: {
        marginRight: responsiveWidth(2.5),
    },
    text: {
        flex: 1,
        color: colors.warningText,
        fontSize: responsiveFontSize(1.3),
        fontWeight: '700',
        lineHeight: responsiveFontSize(1.8),
    },
});

export default React.memo(OfflineBanner);