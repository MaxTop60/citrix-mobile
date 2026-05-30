package com.dispatcher.backend.dto;

import java.util.UUID;

public class DriverDto {
  private UUID driverId;
  private UUID clientId;
  private UUID vehicleId;
  private String fullName;
  private String phone;
  private String telegramId;
  private Boolean isActive;

  public DriverDto() {
  }

  // Геттеры и сеттеры
  public UUID getDriverId() {
    return driverId;
  }

  public void setDriverId(UUID driverId) {
    this.driverId = driverId;
  }

  public UUID getClientId() {
    return clientId;
  }

  public void setClientId(UUID clientId) {
    this.clientId = clientId;
  }

  public UUID getVehicleId() {
    return vehicleId;
  }

  public void setVehicleId(UUID vehicleId) {
    this.vehicleId = vehicleId;
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