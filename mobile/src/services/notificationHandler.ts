import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

/**
 * Создание канала уведомлений для Android
 */
export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Уведомления диспетчера',
      importance: AndroidImportance.HIGH,
      vibration: true,
      sound: 'default',
    });
  }
};

/**
 * Обработчик уведомлений в foreground (приложение открыто)
 */
export const setupForegroundHandler = () => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('📨 Foreground уведомление:', remoteMessage);

    const title = remoteMessage.notification?.title || 'Новое событие';
    const body = remoteMessage.notification?.body || '';

    // Показать системное уведомление
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
      ios: {
        sound: 'default',
      },
    });

    // Также можно показать Alert
    Alert.alert(title, body);
  });
};

/**
 * Обработчик уведомлений в background (приложение свёрнуто)
 */
export const setupBackgroundHandler = () => {
  // Регистрируем обработчик для background сообщений
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background уведомление:', remoteMessage);

    if (Platform.OS === 'ios') {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Новое событие',
        body: remoteMessage.notification?.body || '',
        ios: { sound: 'default' },
      });
    }
  });
};

/**
 * Обработчик нажатия на уведомление
 */
export const setupNotificationPressHandler = (navigation: any) => {
  // Приложение открыто через нажатие на уведомление
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('🔔 Уведомление открыло приложение:', remoteMessage);
    const eventId = remoteMessage.data?.eventId;
    if (eventId && navigation) {
      navigation.navigate('EventDetail', { eventId });
    }
  });

  // Приложение было полностью закрыто и открыто через уведомление
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('🚀 Приложение запущено из уведомления:', remoteMessage);
        const eventId = remoteMessage.data?.eventId;
        if (eventId && navigation) {
          setTimeout(() => {
            navigation.navigate('EventDetail', { eventId });
          }, 1000);
        }
      }
    });
};