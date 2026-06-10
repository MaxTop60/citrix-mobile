package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fcm_tokens")
public class FcmToken {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "token_id")
  private UUID tokenId;

  @ManyToOne
  @JoinColumn(name = "driver_id", nullable = false)
  private Driver driver;

  @Column(name = "fcm_token", nullable = false, unique = true, length = 500)
  private String fcmToken;

  @Column(name = "last_used_at")
  private LocalDateTime lastUsedAt;

  // Конструкторы
  public FcmToken() {
  }

  public FcmToken(Driver driver, String fcmToken) {
    this.driver = driver;
    this.fcmToken = fcmToken;
    this.lastUsedAt = LocalDateTime.now();
  }

  // Геттеры и сеттеры
  public UUID getTokenId() {
    return tokenId;
  }

  public void setTokenId(UUID tokenId) {
    this.tokenId = tokenId;
  }

  public Driver getDriver() {
    return driver;
  }

  public void setDriver(Driver driver) {
    this.driver = driver;
  }

  public String getFcmToken() {
    return fcmToken;
  }

  public void setFcmToken(String fcmToken) {
    this.fcmToken = fcmToken;
  }

  public LocalDateTime getLastUsedAt() {
    return lastUsedAt;
  }

  public void setLastUsedAt(LocalDateTime lastUsedAt) {
    this.lastUsedAt = lastUsedAt;
  }
}