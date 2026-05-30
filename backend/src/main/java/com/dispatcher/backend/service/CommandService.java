package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Command;
import com.dispatcher.backend.entity.Event;
import com.dispatcher.backend.repository.CommandRepository;
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

  public List<Command> getAllCommands() {
    return commandRepository.findAll();
  }

  public Command getCommandById(UUID commandId) {
    return commandRepository.findById(commandId).orElse(null);
  }

  public List<Command> getCommandsByEvent(UUID eventId) {
    return commandRepository.findByEvent_EventId(eventId);
  }

  public Command sendCommand(UUID eventId, String message, String channel) {
    Event event = eventRepository.findById(eventId).orElse(null);
    if (event == null) {
      throw new RuntimeException("Event not found with id: " + eventId);
    }

    Command command = new Command(event, message, channel);
    command.setSentAt(LocalDateTime.now());
    command.setStatus("SENT");

    // Симуляция доставки (заменим позже на реальный SMS/Telegram шлюз)
    command.markAsDelivered();

    return commandRepository.save(command);
  }

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

  public void deleteCommand(UUID commandId) {
    commandRepository.deleteById(commandId);
  }
}