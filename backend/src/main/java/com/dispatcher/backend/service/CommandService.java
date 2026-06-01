package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Command;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.entity.Event;
import com.dispatcher.backend.gateway.SmsRuGateway;
import com.dispatcher.backend.repository.CommandRepository;
import com.dispatcher.backend.repository.DriverRepository;
import com.dispatcher.backend.repository.EventRepository;
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
  private SmsRuGateway smsRuGateway;

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

  // Отправить команду водителю через SMS.ru
  public Command sendCommand(UUID eventId, String message, String channel, UUID driverId) {
    // Находим событие
    Event event = eventRepository.findById(eventId)
        .orElseThrow(() -> new RuntimeException("Событие не найдено: " + eventId));

    // Находим водителя
    Driver driver = driverRepository.findById(driverId)
        .orElseThrow(() -> new RuntimeException("Водитель не найден: " + driverId));

    // Создаём команду
    Command command = new Command(event, message, channel);
    command.setSentAt(LocalDateTime.now());
    command.setStatus("SENT");

    // Проверяем канал (только SMS)
    if (!"SMS".equalsIgnoreCase(channel)) {
      command.setStatus("ERROR");
      command.setErrorMessage("Поддерживается только SMS канал. Получено: " + channel);
      return commandRepository.save(command);
    }

    // Проверяем номер телефона
    String phone = driver.getPhone();
    if (!smsRuGateway.isValidPhone(phone)) {
      command.setStatus("ERROR");
      command.setErrorMessage("Неверный номер телефона: " + phone);
      return commandRepository.save(command);
    }

    // Отправляем SMS через SMS.ru
    boolean success = smsRuGateway.sendSms(phone, message);

    if (success) {
      command.markAsDelivered();
      System.out.println("Команда успешно отправлена водителю " + driver.getFullName());
    } else {
      command.markAsError("Ошибка отправки SMS на номер " + phone + " через SMS.ru");
      System.err.println("Ошибка отправки команды водителю " + driver.getFullName());
    }

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

  // Обновить команду
  public Command updateCommand(Command command) {
    return commandRepository.save(command);
  }

  // Удалить команду
  public void deleteCommand(UUID commandId) {
    commandRepository.deleteById(commandId);
  }
}