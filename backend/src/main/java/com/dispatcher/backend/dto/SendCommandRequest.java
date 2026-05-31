package com.dispatcher.backend.dto;

import java.util.UUID;

public class SendCommandRequest {
    private UUID eventId;
    private String message;

    public SendCommandRequest() {
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}