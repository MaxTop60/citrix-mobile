package com.dispatcher.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class EventDto {
    private UUID eventId;
    private String eventType;
    private String priority;
    private String status;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private String description;

    // Конструкторы
    public EventDto() {}

    public EventDto(UUID eventId, String eventType, String priority, String status, 
                    LocalDateTime timestamp, Double latitude, Double longitude, 
                    String description) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.priority = priority;
        this.status = status;
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }

    // Геттеры и сеттеры
    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}