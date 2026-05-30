package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "clients")
public class Client {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "client_id", updatable = false, nullable = false)
  private UUID clientId;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @Column(name = "inn", nullable = false, unique = true, length = 12)
  private String inn;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  @Column(name = "email", nullable = false, length = 100)
  private String email;

  @Column(name = "is_active")
  private Boolean isActive = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt = LocalDateTime.now();

  // Конструкторы
  public Client() {
  }

  public Client(String name, String inn, String phone, String email) {
    this.name = name;
    this.inn = inn;
    this.phone = phone;
    this.email = email;
  }

  // Геттеры и сеттеры
  public UUID getClientId() {
    return clientId;
  }

  public void setClientId(UUID clientId) {
    this.clientId = clientId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getInn() {
    return inn;
  }

  public void setInn(String inn) {
    this.inn = inn;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}