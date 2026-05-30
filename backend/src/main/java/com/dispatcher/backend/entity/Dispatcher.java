package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dispatchers")
public class Dispatcher {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "dispatcher_id", updatable = false, nullable = false)
  private UUID dispatcherId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id", nullable = false)
  private Client client;

  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

  @Column(name = "email", nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  @Column(name = "role", length = 50)
  private String role = "dispatcher";

  @Column(name = "push_token", length = 255)
  private String pushToken;

  @Column(name = "push_token_platform", length = 10)
  private String pushTokenPlatform;

  @Column(name = "is_active")
  private Boolean isActive = true;

  @Column(name = "last_active_at")
  private LocalDateTime lastActiveAt;

  // Конструкторы
  public Dispatcher() {
  }

  public Dispatcher(Client client, String fullName, String email, String phone) {
    this.client = client;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
  }

  // Геттеры и сеттеры
  public UUID getDispatcherId() {
    return dispatcherId;
  }

  public void setDispatcherId(UUID dispatcherId) {
    this.dispatcherId = dispatcherId;
  }

  public Client getClient() {
    return client;
  }

  public void setClient(Client client) {
    this.client = client;
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

  // Бизнес-метод
  public void updatePushToken(String token, String platform) {
    this.pushToken = token;
    this.pushTokenPlatform = platform;
    this.lastActiveAt = LocalDateTime.now();
  }
}