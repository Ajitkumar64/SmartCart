import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors } from '../constants/theme';

function ImageGallery({ images }) {
    const { width } = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const imageHeight = responsiveHeight(42);

    const renderItem = useCallback(
        ({ item }) => (
            <Image
                source={{ uri: item }}
                style={{ width, height: imageHeight }}
                resizeMode="contain"
            />
        ),
        [width, imageHeight]
    );

    const onScroll = useCallback(
        (e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            if (newIndex !== index) {
                setIndex(newIndex);
            }
        },
        [width, index]
    );

    const getItemLayout = useCallback(
        (_, i) => ({
            length: width,
            offset: width * i,
            index: i,
        }),
        [width]
    );

    if (!images || images.length === 0) {
        return <View style={[styles.wrap, { height: imageHeight }]} />;
    }

    return (
        <View style={styles.wrap}>
            <FlatList
                data={images}
                horizontal
                pagingEnabled
                bounces={false}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                keyExtractor={(uri, i) => `${i}-${uri}`}
                renderItem={renderItem}
                onScroll={onScroll}
                scrollEventThrottle={16}
                getItemLayout={getItemLayout}
            />

            {images.length > 1 && (
                <View style={styles.dotsContainer}>
                    {images.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === index && styles.dotActive]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: '#F8FAFC',
        borderBottomLeftRadius: responsiveWidth(6),
        borderBottomRightRadius: responsiveWidth(6),
        overflow: 'hidden',
        marginBottom: responsiveHeight(2),
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveHeight(1.5),
        position: 'absolute',
        bottom: responsiveHeight(1),
        left: 0,
        right: 0,
    },
    dot: {
        width: responsiveWidth(2),
        height: responsiveWidth(2),
        borderRadius: responsiveWidth(1),
        backgroundColor: '#CBD5E1',
        marginHorizontal: responsiveWidth(1),
    },
    dotActive: {
        backgroundColor: colors.primary,
        width: responsiveWidth(5),
    },
});

export default React.memo(ImageGallery);