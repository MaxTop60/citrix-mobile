package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Command;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.entity.Event;
import com.dispatcher.backend.entity.FcmToken;
import com.dispatcher.backend.repository.CommandRepository;
import com.dispatcher.backend.repository.DriverRepository;
import com.dispatcher.backend.repository.EventRepository;
import com.dispatcher.backend.repository.FcmTokenRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CommandService {

  @Autowired
  private CommandRepository commandRepository;

  @Autowired
  private EventRepository eventRepository;

  @Autowired
  private DriverRepository driverRepository;

  @Autowired
  private FcmTokenRepository fcmTokenRepository;

  // Получить все команды
  public List<Command> getAllCommands() {
    return commandRepository.findAll();
  }

  // Получить команду по ID
  public Command getCommandById(UUID commandId) {
    return commandRepository.findById(commandId).orElse(null);
  }

  // Получить команды по событию
  public List<Command> getCommandsByEvent(UUID eventId) {
    return commandRepository.findByEvent_EventId(eventId);
  }

  // Получить команды по водителю
  public List<Command> getCommandsByDriverId(UUID driverId) {
    return commandRepository.findByDriver_DriverId(driverId);
  }

  // Отправить push-уведомление водителю
  private void sendPushNotification(Driver driver, String title, String body, String eventId) {
    FcmToken fcmToken = fcmTokenRepository.findByDriver_DriverId(driver.getDriverId()).orElse(null);
    if (fcmToken == null || fcmToken.getFcmToken() == null) {
      System.out.println("❌ Нет FCM токена для водителя: " + driver.getDriverId());
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
      System.out.println("✅ Push-уведомление отправлено: " + response);
    } catch (FirebaseMessagingException e) {
      System.err.println("❌ Ошибка отправки push: " + e.getMessage());
      // Если токен невалиден — удаляем его
      if (e.getMessagingErrorCode() == com.google.firebase.messaging.MessagingErrorCode.INVALID_ARGUMENT) {
        fcmTokenRepository.delete(fcmToken);
        System.out.println("   Невалидный токен удалён");
      }
    }
  }

  // Отправить команду водителю (через push)
  public Command sendCommand(UUID eventId, String message, UUID driverId) {
    // Находим событие
    Event event = eventRepository.findById(eventId)
        .orElseThrow(() -> new RuntimeException("Событие не найдено: " + eventId));

    // Находим водителя
    Driver driver = driverRepository.findById(driverId)
        .orElseThrow(() -> new RuntimeException("Водитель не найден: " + driverId));

    // Создаём команду
    Command command = new Command(event, message, "PUSH");
    command.setDriver(driver);
    command.setSentAt(LocalDateTime.now());
    command.setStatus("SENT");

    // Отправляем push-уведомление
    String title = "📢 Новая команда от диспетчера";
    String body = message.length() > 100 ? message.substring(0, 97) + "..." : message;
    sendPushNotification(driver, title, body, event.getEventId().toString());

    command.markAsDelivered();
    return commandRepository.save(command);
  }

  // Обновить команду
  public Command updateCommand(Command command) {
    return commandRepository.save(command);
  }

  // Обновить статус команды
  public Command updateCommandStatus(UUID commandId, String status, String errorMessage) {
    Command command = getCommandById(commandId);
    if (command != null) {
      command.setStatus(status);
      if (errorMessage != null) {
        command.setErrorMessage(errorMessage);
      }
      return commandRepository.save(command);
    }
    return null;
  }

  // Удалить команду
  public void deleteCommand(UUID commandId) {
    commandRepository.deleteById(commandId);
  }
}