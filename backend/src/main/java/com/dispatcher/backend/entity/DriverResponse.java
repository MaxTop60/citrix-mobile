package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "driver_responses")
public class DriverResponse {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "response_id", updatable = false, nullable = false)
  private UUID responseId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "command_id", unique = true, nullable = false)
  private Command command;

  @Column(name = "response_type", nullable = false, length = 20)
  private String responseType;

  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(name = "received_at", nullable = false)
  private LocalDateTime receivedAt;

  @Column(name = "is_verified")
  private Boolean isVerified = false;

  // Конструкторы
  public DriverResponse() {
  }

  public DriverResponse(Command command, String responseType, String content) {
    this.command = command;
    this.responseType = responseType;
    this.content = content;
    this.receivedAt = LocalDateTime.now();
    this.isVerified = true;
  }

  // Геттеры и сеттеры
  public UUID getResponseId() {
    return responseId;
  }

  public void setResponseId(UUID responseId) {
    this.responseId = responseId;
  }

  public Command getCommand() {
    return command;
  }

  public void setCommand(Command command) {
    this.command = command;
  }

  public String getResponseType() {
    return responseType;
  }

  public void setResponseType(String responseType) {
    this.responseType = responseType;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public LocalDateTime getReceivedAt() {
    return receivedAt;
  }

  public void setReceivedAt(LocalDateTime receivedAt) {
    this.receivedAt = receivedAt;
  }

  public Boolean getIsVerified() {
    return isVerified;
  }

  public void setIsVerified(Boolean isVerified) {
    this.isVerified = isVerified;
  }
}