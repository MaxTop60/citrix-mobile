package com.dispatcher.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CommandDto {
    private UUID commandId;
    private UUID eventId;
    private String status;
    private String channel;
    private String message;
    private LocalDateTime sentAt;
    private LocalDateTime deliveredAt;
    private String errorMessage;

    // Конструктор по умолчанию
    public CommandDto() {}

    // Конструктор с полями
    public CommandDto(UUID commandId, UUID eventId, String status, String channel, 
                      String message, LocalDateTime sentAt, 
                      LocalDateTime deliveredAt, String errorMessage) {
        this.commandId = commandId;
        this.eventId = eventId;
        this.status = status;
        this.channel = channel;
        this.message = message;
        this.sentAt = sentAt;
        this.deliveredAt = deliveredAt;
        this.errorMessage = errorMessage;
    }

    // Геттеры и сеттеры
    public UUID getCommandId() { return commandId; }
    public void setCommandId(UUID commandId) { this.commandId = commandId; }

    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}