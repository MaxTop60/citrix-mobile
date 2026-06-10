import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { apiClient } from '../shared/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Запрос разрешения на уведомления
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Разрешение на уведомления получено');
    } else {
      console.log('Разрешение на уведомления отклонено');
    }

    // Для Android 13+ дополнительное разрешение
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const { PermissionsAndroid } = await import('react-native');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return enabled;
  } catch (error) {
    console.error('Ошибка при запросе разрешений:', error);
    return false;
  }
};

/**
 * Получение FCM токена устройства
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    console.log('📱 FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Ошибка получения FCM токена:', error);
    return null;
  }
};

/**
 * Отправка FCM токена на бэкенд
 */
export const sendTokenToBackend = async (token: string, userId: string): Promise<void> => {
  try {
    console.log('📤 Отправка FCM токена для userId:', userId);
    const response = await apiClient.post('/auth/fcm-token', { 
      token, 
      userId  // явно передаём userId
    });
    console.log('✅ Токен отправлен:', response.data);
  } catch (error: any) {
    console.error('❌ Ошибка отправки токена:', error.response?.data || error.message);
  }
};

/**
 * Хук для управления FCM уведомлениями
 */
export const useFcmNotifications = (userId?: string) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  console.log('🔧 useFcmNotifications вызван с userId:', userId);

  useEffect(() => {
    console.log('📱 Инициализация FCM...');
    const initialize = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        setPermissionGranted(enabled);
        console.log('   Разрешение на уведомления:', enabled);

        if (enabled) {
          const token = await messaging().getToken();
          setFcmToken(token);
          console.log('📱 FCM Token получен:', token ? `${token.substring(0, 30)}...` : 'null');
        }
      } catch (error) {
        console.error('Ошибка инициализации FCM:', error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    console.log('🔄 Проверка отправки FCM: fcmToken=', !!fcmToken, 'userId=', userId);
    const sendToken = async () => {
      if (fcmToken && userId) {
        console.log('📤 ОТПРАВЛЯЕМ FCM токен на бэкенд...');
        try {
          const response = await apiClient.post('/auth/fcm-token', { token: fcmToken, userId });
          console.log('✅ Успешно:', response.data);
        } catch (error: any) {
          console.error('❌ Ошибка:', error.response?.data || error.message);
        }
      } else {
        console.log('⏳ Ждём: fcmToken=', !!fcmToken, 'userId=', userId);
      }
    };
    sendToken();
  }, [fcmToken, userId]);

  return { fcmToken, permissionGranted };
};