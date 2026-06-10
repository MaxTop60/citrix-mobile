import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './store';
import { useFcmNotifications, sendTokenToBackend } from '../hooks/useFcmNotifications';
import {
  createNotificationChannel,
  setupForegroundHandler,
  setupBackgroundHandler,
} from '../services/notificationHandler';
import { useSelector } from 'react-redux';
import { RootState } from './store';

import LoginScreen from '../features/auth/ui/LoginScreen';
import RegisterScreen from '../features/auth/ui/RegisterScreen';
import { RoleNavigator } from '../navigation/RoleNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  // FCM хук
  const { fcmToken, permissionGranted } = useFcmNotifications(user?.userId);

  // Отправка токена на бэкенд при авторизации

  useEffect(() => {
    const sendToken = async () => {
      if (fcmToken && user?.role === 'ROLE_DRIVER' && user?.userId) {
        await sendTokenToBackend(fcmToken, user.userId);
      }
    };
    sendToken();
  }, [fcmToken, user]);

  useEffect(() => {
    console.log('🔍 AppNavigator диагностика:');
    console.log('   isAuthenticated:', isAuthenticated);
    console.log('   user:', user);
    console.log('   user?.userId:', user?.userId);
    console.log('   fcmToken:', fcmToken ? `${fcmToken.substring(0, 30)}...` : 'null');
  }, [isAuthenticated, user, fcmToken]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={RoleNavigator} />
      )}
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  // Инициализация уведомлений
  useEffect(() => {
    const initNotifications = async () => {
      await createNotificationChannel();
      setupBackgroundHandler();
      const unsubscribeForeground = setupForegroundHandler();

      return () => {
        unsubscribeForeground();
      };
    };

    initNotifications();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;