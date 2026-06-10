package com.dispatcher.backend.service;

import com.google.firebase.messaging.*;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.entity.FcmToken;
import com.dispatcher.backend.repository.FcmTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationService {

  @Autowired
  private FcmTokenRepository fcmTokenRepository;

  public void sendCommandNotification(Driver driver, String title, String body, String eventId) {
    FcmToken fcmToken = fcmTokenRepository.findByDriver_DriverId(driver.getDriverId())
        .orElse(null);

    if (fcmToken == null || fcmToken.getFcmToken() == null) {
      System.out.println("Нет FCM токена для водителя " + driver.getDriverId());
      return;
    }

    try {
      Message message = Message.builder()
          .setToken(fcmToken.getFcmToken())
          .setNotification(Notification.builder()
              .setTitle(title)
              .setBody(body)
              .build())
          .putData("eventId", eventId)
          .putData("driverId", driver.getDriverId().toString())
          .build();

      String response = FirebaseMessaging.getInstance().send(message);
      System.out.println("Push-уведомление отправлено: " + response);
    } catch (FirebaseMessagingException e) {
      // Если токен невалиден — удаляем его
      if (e.getMessagingErrorCode() == MessagingErrorCode.INVALID_ARGUMENT) {
        fcmTokenRepository.delete(fcmToken);
        System.out.println("Невалидный FCM токен удалён");
      }
      e.printStackTrace();
    }
  }
}