package com.dispatcher.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "event_id", updatable = false, nullable = false)
  private UUID eventId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "vehicle_id", nullable = true)
  private Vehicle vehicle;

  @Column(name = "event_type", nullable = false, length = 50)
  private String eventType;

  @Column(name = "priority", nullable = false, length = 20)
  private String priority;

  @Column(name = "status", nullable = false, length = 20)
  private String status = "NEW";

  @Column(name = "timestamp", nullable = false)
  private LocalDateTime timestamp = LocalDateTime.now();

  @Column(name = "latitude")
  private Double latitude;

  @Column(name = "longitude")
  private Double longitude;

  @Column(name = "sensor_value")
  private Double sensorValue;

  @Column(name = "threshold_value")
  private Double thresholdValue;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  // Конструкторы
  public Event() {
  }

  public Event(Vehicle vehicle, String eventType, String priority,
      Double latitude, Double longitude, String description) {
    this.vehicle = vehicle;
    this.eventType = eventType;
    this.priority = priority;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
  }

  // Геттеры и сеттеры
  public UUID getEventId() {
    return eventId;
  }

  public void setEventId(UUID eventId) {
    this.eventId = eventId;
  }

  public Vehicle getVehicle() {
    return vehicle;
  }

  public void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
  }

  public String getEventType() {
    return eventType;
  }

  public void setEventType(String eventType) {
    this.eventType = eventType;
  }

  public String getPriority() {
    return priority;
  }

  public void setPriority(String priority) {
    this.priority = priority;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }

  public Double getSensorValue() {
    return sensorValue;
  }

  public void setSensorValue(Double sensorValue) {
    this.sensorValue = sensorValue;
  }

  public Double getThresholdValue() {
    return thresholdValue;
  }

  public void setThresholdValue(Double thresholdValue) {
    this.thresholdValue = thresholdValue;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}