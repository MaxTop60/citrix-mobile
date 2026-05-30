package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "drivers")
public class Driver {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "driver_id", updatable = false, nullable = false)
  private UUID driverId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id", nullable = false)
  private Client client;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "vehicle_id", unique = true)
  private Vehicle vehicle;

  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  @Column(name = "telegram_id", length = 100)
  private String telegramId;

  @Column(name = "is_active")
  private Boolean isActive = true;

  // Конструкторы
  public Driver() {
  }

  public Driver(Client client, String fullName, String phone) {
    this.client = client;
    this.fullName = fullName;
    this.phone = phone;
  }

  // Геттеры и сеттеры
  public UUID getDriverId() {
    return driverId;
  }

  public void setDriverId(UUID driverId) {
    this.driverId = driverId;
  }

  public Client getClient() {
    return client;
  }

  public void setClient(Client client) {
    this.client = client;
  }

  public Vehicle getVehicle() {
    return vehicle;
  }

  public void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getTelegramId() {
    return telegramId;
  }

  public void setTelegramId(String telegramId) {
    this.telegramId = telegramId;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
  }
}