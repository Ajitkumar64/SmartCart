/**
 * @format
 */
import {AppRegistry} from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';

// Notifee requires a background event handler to be registered.
notifee.onBackgroundEvent(async () => {});

AppRegistry.registerComponent(appName, () => App);
