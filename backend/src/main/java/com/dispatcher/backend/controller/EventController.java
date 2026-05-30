package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.EventDto;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    // TODO: Заменить на реальную БД
    private final List<EventDto> events = new ArrayList<>();

    public EventController() {
        // Тестовые события при старте
        events.add(new EventDto(
            UUID.randomUUID(),
            "FUEL_DROP",
            "CRITICAL",
            "NEW",
            LocalDateTime.now().minusMinutes(5),
            55.751244,
            37.618423,
            "Резкое падение уровня топлива на 15 литров за 3 минуты"
        ));
        events.add(new EventDto(
            UUID.randomUUID(),
            "SPEED_EXCEED",
            "HIGH",
            "NEW",
            LocalDateTime.now().minusMinutes(15),
            55.751244,
            37.618423,
            "Превышение скорости: 95 км/ч при лимите 60 км/ч"
        ));
        events.add(new EventDto(
            UUID.randomUUID(),
            "LONG_IDLE",
            "MEDIUM",
            "IN_PROGRESS",
            LocalDateTime.now().minusHours(2),
            55.751244,
            37.618423,
            "Длительный простой более 30 минут"
        ));
    }

    // GET /api/events — получить все события
    @GetMapping
    public List<EventDto> getAllEvents() {
        return events;
    }

    // GET /api/events/{id} — получить событие по ID
    @GetMapping("/{id}")
    public EventDto getEventById(@PathVariable UUID id) {
        return events.stream()
            .filter(event -> event.getEventId().equals(id))
            .findFirst()
            .orElse(null);
    }

    // POST /api/events — создать новое событие 
    @PostMapping
    public EventDto createEvent(@RequestBody EventDto newEvent) {
        newEvent.setEventId(UUID.randomUUID());
        newEvent.setTimestamp(LocalDateTime.now());
        events.add(0, newEvent);
        return newEvent;
    }
}