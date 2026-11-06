import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';
import {useCartReminder} from './src/hooks/useCartReminder';
import {store} from './src/store';
import {useAppDispatch, useAppSelector} from './src/store/hooks';
import {hydrateApp} from './src/store/hydrate';
import {colors} from './src/constants/theme';

function Bootstrap() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(s => s.cart.hydrated);
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);
  useCartReminder();

  useEffect(() => {
    dispatch(hydrateApp());
  }, [dispatch]);

  if (!splashDone || !hydrated) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Bootstrap />
      </SafeAreaProvider>
    </Provider>
  );
}
