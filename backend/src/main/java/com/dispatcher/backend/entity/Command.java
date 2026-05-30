package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "commands")
public class Command {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "command_id", updatable = false, nullable = false)
  private UUID commandId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "event_id", nullable = false)
  private Event event;

  @Column(name = "message", nullable = false, length = 500)
  private String message;

  @Column(name = "channel", nullable = false, length = 20)
  private String channel; // SMS, TELEGRAM

  @Column(name = "status", nullable = false, length = 20)
  private String status = "SENT";

  @Column(name = "sent_at", nullable = false)
  private LocalDateTime sentAt = LocalDateTime.now();

  @Column(name = "delivered_at")
  private LocalDateTime deliveredAt;

  @Column(name = "error_message", columnDefinition = "TEXT")
  private String errorMessage;

  // Конструкторы
  public Command() {
  }

  public Command(Event event, String message, String channel) {
    this.event = event;
    this.message = message;
    this.channel = channel;
  }

  // Геттеры и сеттеры
  public UUID getCommandId() {
    return commandId;
  }

  public void setCommandId(UUID commandId) {
    this.commandId = commandId;
  }

  public Event getEvent() {
    return event;
  }

  public void setEvent(Event event) {
    this.event = event;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getChannel() {
    return channel;
  }

  public void setChannel(String channel) {
    this.channel = channel;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getSentAt() {
    return sentAt;
  }

  public void setSentAt(LocalDateTime sentAt) {
    this.sentAt = sentAt;
  }

  public LocalDateTime getDeliveredAt() {
    return deliveredAt;
  }

  public void setDeliveredAt(LocalDateTime deliveredAt) {
    this.deliveredAt = deliveredAt;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  // Бизнес-методы
  public void markAsDelivered() {
    this.status = "DELIVERED";
    this.deliveredAt = LocalDateTime.now();
  }

  public void markAsError(String error) {
    this.status = "ERROR";
    this.errorMessage = error;
  }
}