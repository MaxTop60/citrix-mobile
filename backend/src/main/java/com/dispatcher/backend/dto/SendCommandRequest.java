package com.dispatcher.backend.dto;

import java.util.UUID;

public class SendCommandRequest {
    private UUID eventId;
    private UUID templateId;      // ID выбранного шаблона
    private String customComment; // дополнительный комментарий 
    private String channel;       // "SMS" или "TELEGRAM"

    // Конструктор по умолчанию
    public SendCommandRequest() {}

    // Геттеры и сеттеры
    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public UUID getTemplateId() { return templateId; }
    public void setTemplateId(UUID templateId) { this.templateId = templateId; }

    public String getCustomComment() { return customComment; }
    public void setCustomComment(String customComment) { this.customComment = customComment; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
}