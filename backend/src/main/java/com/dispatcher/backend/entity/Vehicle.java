package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
public class Vehicle {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "vehicle_id", updatable = false, nullable = false)
  private UUID vehicleId;

  @Column(name = "plate_number", nullable = false, unique = true, length = 20)
  private String plateNumber;

  @Column(name = "model", length = 100)
  private String model;

  @Column(name = "current_speed")
  private Double currentSpeed = 0.0;

  @Column(name = "current_fuel_level")
  private Double currentFuelLevel;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id", nullable = true)
  private Client client;

  // Конструкторы
  public Vehicle() {
  }

  public Vehicle(String plateNumber, String model) {
    this.plateNumber = plateNumber;
    this.model = model;
  }

  // Геттеры и сеттеры
  public UUID getVehicleId() {
    return vehicleId;
  }

  public void setVehicleId(UUID vehicleId) {
    this.vehicleId = vehicleId;
  }

  public String getPlateNumber() {
    return plateNumber;
  }

  public void setPlateNumber(String plateNumber) {
    this.plateNumber = plateNumber;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public Double getCurrentSpeed() {
    return currentSpeed;
  }

  public void setCurrentSpeed(Double currentSpeed) {
    this.currentSpeed = currentSpeed;
  }

  public Double getCurrentFuelLevel() {
    return currentFuelLevel;
  }

  public void setCurrentFuelLevel(Double currentFuelLevel) {
    this.currentFuelLevel = currentFuelLevel;
  }

  public Client getClient() {
    return client;
  }

  public void setClient(Client client) {
    this.client = client;
  }
}