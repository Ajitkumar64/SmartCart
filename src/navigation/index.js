import React, { useRef, useEffect } from 'react';
import { Platform, StyleSheet, View, Text, Pressable, Animated, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import { colors } from '../constants/theme';
import { useAppSelector } from '../store/hooks';
import { selectCartCount } from '../store/slices/cartSlice';

import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { active: 'home-variant', inactive: 'home-variant-outline' },
  Wishlist: { active: 'heart', inactive: 'heart-outline' },
  Cart: { active: 'cart', inactive: 'cart-outline' },
  Orders: { active: 'clipboard-text', inactive: 'clipboard-text-outline' },
};

function TabButton({ route, isFocused, onPress, iconColor, labelColor }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const count = useAppSelector(selectCartCount);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isFocused ? -4 : 0,
      useNativeDriver: true,
      friction: 5,
      tension: 60,
    }).start();
  }, [isFocused, translateY]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 50,
    }).start();
  };

  const icons = TAB_ICONS[route.name];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
        <MaterialCommunityIcons
          name={isFocused ? icons.active : icons.inactive}
          size={responsiveFontSize(2.6)}
          color={iconColor}
        />
        {route.name === 'Cart' && count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
          </View>
        )}
      </Animated.View>
      <Text style={[styles.tabLabel, { color: labelColor }]}>
        {route.name}
      </Text>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabWidth = width / state.routes.length;

  const translateX = useRef(new Animated.Value(state.index * tabWidth)).current;
  const bubbleWidth = tabWidth * 0.5;
  const bubbleOffset = (tabWidth - bubbleWidth) / 2;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      friction: 5,
      tension: 50,
    }).start();
  }, [state.index, tabWidth, translateX]);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <Animated.View
        style={[
          styles.waveBubble,
          {
            width: bubbleWidth,
            transform: [
              { translateX },
              { translateX: bubbleOffset },
            ],
          },
        ]}
      />
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconColor = isFocused ? '#FFFFFF' : colors.textMuted;
          const labelColor = isFocused ? colors.primary : colors.textMuted;

          return (
            <TabButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              iconColor={iconColor}
              labelColor={labelColor}
            />
          );
        })}
      </View>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: 'Product' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{
            title: 'Order Confirmed',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: responsiveWidth(8),
    borderTopRightRadius: responsiveWidth(8),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
    paddingTop: responsiveHeight(1.5),
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveBubble: {
    position: 'absolute',
    top: responsiveHeight(0.8),
    height: responsiveHeight(4.2),
    borderRadius: responsiveHeight(2.1),
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(0.5),
  },
  tabLabel: {
    fontSize: responsiveFontSize(1.1),
    fontWeight: '700',
    marginTop: responsiveHeight(0.5),
    letterSpacing: 0.1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: responsiveWidth(4),
    height: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(0.9),
    fontWeight: '800',
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: responsiveFontSize(1.85),
    color: colors.text,
    letterSpacing: -0.2,
  },
});