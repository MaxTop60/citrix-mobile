package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.CommandDto;
import com.dispatcher.backend.dto.EventDto;
import com.dispatcher.backend.entity.Command;
import com.dispatcher.backend.entity.Event;
import com.dispatcher.backend.service.CommandService;
import com.dispatcher.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

  @Autowired
  private EventService eventService;

  @Autowired
  private CommandService commandService;

  // Конвертация Entity → DTO
  private EventDto convertToDto(Event event) {
    EventDto dto = new EventDto(
        event.getEventId(),
        event.getEventType(),
        event.getPriority(),
        event.getStatus(),
        event.getTimestamp(),
        event.getLatitude(),
        event.getLongitude(),
        event.getDescription());

    // Добавляем vehicleId
    if (event.getVehicle() != null) {
      dto.setVehicleId(event.getVehicle().getVehicleId());
    }

    return dto;
  }

  // GET /api/events — получить все события
  @GetMapping
  public List<EventDto> getAllEvents() {
    return eventService.getAllEvents().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  // GET /api/events/{id} — получить событие по ID
  @GetMapping("/{id}")
  public EventDto getEventById(@PathVariable UUID id) {
    Event event = eventService.getEventById(id);
    return event != null ? convertToDto(event) : null;
  }

  // GET /api/events/status/{status} — получить события по статусу
  @GetMapping("/status/{status}")
  public List<EventDto> getEventsByStatus(@PathVariable String status) {
    return eventService.getEventsByStatus(status).stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  // POST /api/events — создать новое событие
  @PostMapping
  public EventDto createEvent(@RequestBody EventDto eventDto) {
    System.out.println("=== FULL REQUEST DEBUG ===");
    System.out.println("eventDto object: " + eventDto);
    System.out.println("eventDto.getVehicleId(): " + eventDto.getVehicleId());
    System.out.println("eventDto.getEventType(): " + eventDto.getEventType());

    Event event = new Event(
        null, // vehicleId пока null
        eventDto.getEventType(),
        eventDto.getPriority(),
        eventDto.getLatitude(),
        eventDto.getLongitude(),
        eventDto.getDescription());
    Event saved = eventService.createEvent(event, eventDto.getVehicleId());
    return convertToDto(saved);
  }

  // PUT /api/events/{id}/status — обновить статус события
  @PutMapping("/{id}/status")
  public EventDto updateEventStatus(@PathVariable UUID id, @RequestParam String status) {
    Event updated = eventService.updateEventStatus(id, status);
    return updated != null ? convertToDto(updated) : null;
  }

  // DELETE /api/events/{id} — удалить событие
  @DeleteMapping("/{id}")
  public String deleteEvent(@PathVariable UUID id) {
    eventService.deleteEvent(id);
    return "Событие удалено";
  }

  // GET /api/events/{id}/commands — получить команды для события
  @GetMapping("/{id}/commands")
  public List<CommandDto> getCommandsByEvent(@PathVariable UUID id) {
    return commandService.getCommandsByEvent(id).stream()
        .map(this::convertCommandToDto)
        .collect(Collectors.toList());
  }

  // Конвертация Command → CommandDto
  private CommandDto convertCommandToDto(Command command) {
    CommandDto dto = new CommandDto();
    dto.setCommandId(command.getCommandId());
    dto.setEventId(command.getEvent().getEventId());
    dto.setMessage(command.getMessage());
    dto.setChannel(command.getChannel());
    dto.setStatus(command.getStatus());
    dto.setSentAt(command.getSentAt());
    dto.setDeliveredAt(command.getDeliveredAt());
    dto.setErrorMessage(command.getErrorMessage());
    return dto;
  }
}