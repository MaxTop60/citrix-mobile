package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Event;
import com.dispatcher.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

  @Autowired
  private EventRepository eventRepository;

  // Получить все события
  public List<Event> getAllEvents() {
    return eventRepository.findAll();
  }

  // Получить событие по ID
  public Event getEventById(UUID eventId) {
    return eventRepository.findById(eventId).orElse(null);
  }

  // Получить события по транспортному средству
  public List<Event> getEventsByVehicle(UUID vehicleId) {
    return eventRepository.findByVehicleId(vehicleId);
  }

  // Получить события по статусу
  public List<Event> getEventsByStatus(String status) {
    return eventRepository.findByStatus(status);
  }

  // Создать новое событие
  public Event createEvent(Event event) {
    event.setEventId(null); // чтобы Hibernate создал новый ID
    event.setTimestamp(java.time.LocalDateTime.now());
    return eventRepository.save(event);
  }

  // Обновить статус события
  public Event updateEventStatus(UUID eventId, String newStatus) {
    Event event = getEventById(eventId);
    if (event != null) {
      event.setStatus(newStatus);
      return eventRepository.save(event);
    }
    return null;
  }

  // Удалить событие
  public void deleteEvent(UUID eventId) {
    eventRepository.deleteById(eventId);
  }
}