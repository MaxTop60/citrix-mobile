package com.dispatcher.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class DispatcherDto {
  private UUID dispatcherId;
  private UUID clientId;
  private String fullName;
  private String email;
  private String phone;
  private String role;
  private String pushToken;
  private String pushTokenPlatform;
  private Boolean isActive;
  private LocalDateTime lastActiveAt;

  public DispatcherDto() {
  }

  // Геттеры и сеттеры
  public UUID getDispatcherId() {
    return dispatcherId;
  }

  public void setDispatcherId(UUID dispatcherId) {
    this.dispatcherId = dispatcherId;
  }

  public UUID getClientId() {
    return clientId;
  }

  public void setClientId(UUID clientId) {
    this.clientId = clientId;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getPushToken() {
    return pushToken;
  }

  public void setPushToken(String pushToken) {
    this.pushToken = pushToken;
  }

  public String getPushTokenPlatform() {
    return pushTokenPlatform;
  }

  public void setPushTokenPlatform(String pushTokenPlatform) {
    this.pushTokenPlatform = pushTokenPlatform;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }

  public LocalDateTime getLastActiveAt() {
    return lastActiveAt;
  }

  public void setLastActiveAt(LocalDateTime lastActiveAt) {
    this.lastActiveAt = lastActiveAt;
  }
}