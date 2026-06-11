package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.DriverDto;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import com.dispatcher.backend.entity.Vehicle;
import java.util.Optional;

import com.dispatcher.backend.repository.VehicleRepository;
import com.dispatcher.backend.repository.DriverRepository;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

  @Autowired
  private DriverService driverService;

  @Autowired
  private VehicleRepository vehicleRepository;

  @Autowired
  private DriverRepository driverRepository;

  private DriverDto convertToDto(Driver driver) {
    DriverDto dto = new DriverDto();
    dto.setDriverId(driver.getDriverId());
    if (driver.getClient() != null) {
      dto.setClientId(driver.getClient().getClientId());
    }
    if (driver.getVehicle() != null) {
      dto.setVehicleId(driver.getVehicle().getVehicleId());
    }
    dto.setFullName(driver.getFullName());
    dto.setPhone(driver.getPhone());
    dto.setTelegramId(driver.getTelegramId());
    dto.setIsActive(driver.getIsActive());
    return dto;
  }

  @GetMapping
  public List<DriverDto> getAllDrivers() {
    return driverService.getAllDrivers().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public DriverDto getDriverById(@PathVariable UUID id) {
    Driver driver = driverService.getDriverById(id);
    return driver != null ? convertToDto(driver) : null;
  }

  @GetMapping("/client/{clientId}")
  public List<DriverDto> getDriversByClient(@PathVariable UUID clientId) {
    return driverService.getDriversByClient(clientId).stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  @GetMapping("/active")
  public List<DriverDto> getActiveDrivers() {
    return driverService.getActiveDrivers().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  @GetMapping("/vehicle/{vehicleId}")
  public DriverDto getDriverByVehicle(@PathVariable UUID vehicleId) {
    Driver driver = driverService.getDriverByVehicle(vehicleId);
    return driver != null ? convertToDto(driver) : null;
  }

  @PostMapping
  public DriverDto createDriver(@RequestBody DriverDto driverDto,
      @RequestParam UUID clientId,
      @RequestParam(required = false) UUID vehicleId) {
    Driver driver = new Driver();
    driver.setFullName(driverDto.getFullName());
    driver.setPhone(driverDto.getPhone());
    driver.setTelegramId(driverDto.getTelegramId());

    Driver saved = driverService.createDriver(driver, clientId, vehicleId);
    return convertToDto(saved);
  }

  @PutMapping("/{id}")
  public DriverDto updateDriver(@PathVariable UUID id,
      @RequestBody DriverDto driverDto,
      @RequestParam(required = false) UUID vehicleId) {
    Driver driverUpdate = new Driver();
    driverUpdate.setFullName(driverDto.getFullName());
    driverUpdate.setPhone(driverDto.getPhone());
    driverUpdate.setTelegramId(driverDto.getTelegramId());

    Driver updated = driverService.updateDriver(id, driverUpdate, vehicleId);
    return updated != null ? convertToDto(updated) : null;
  }

  @PatchMapping("/{id}/status")
  public DriverDto updateDriverStatus(@PathVariable UUID id, @RequestParam Boolean isActive) {
    Driver updated = driverService.updateDriverStatus(id, isActive);
    return updated != null ? convertToDto(updated) : null;
  }

  @DeleteMapping("/{id}")
  public String deleteDriver(@PathVariable UUID id) {
    driverService.deleteDriver(id);
    return "Водитель удалён";
  }

  @PutMapping("/{driverId}/assign-vehicle")
  public ResponseEntity<?> assignVehicleToDriver(
      @PathVariable UUID driverId,
      @RequestParam UUID vehicleId) {

    // Проверяем, существует ли водитель
    Driver existingDriver = driverService.getDriverById(driverId);
    if (existingDriver == null) {
      return ResponseEntity.notFound().build();
    }

    // Проверяем, существует ли ТС
    Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
    if (vehicle == null) {
      return ResponseEntity.badRequest().body("Транспорт не найден");
    }

    // Проверяем, что ТС принадлежит тому же клиенту, что и водитель
    if (existingDriver.getClient() != null && vehicle.getClient() != null &&
        !existingDriver.getClient().getClientId().equals(vehicle.getClient().getClientId())) {
      return ResponseEntity.badRequest().body("ТС не принадлежит автопарку этого водителя");
    }

    // Проверяем, что ТС ещё не привязано к другому водителю
    Optional<Driver> driverWithSameVehicle = driverRepository.findByVehicle_VehicleId(vehicleId);
    if (driverWithSameVehicle.isPresent() && !driverWithSameVehicle.get().getDriverId().equals(driverId)) {
      return ResponseEntity.badRequest().body("ТС уже привязано к другому водителю");
    }

    // Привязываем водителя к ТС
    Driver updated = driverService.updateDriver(driverId, existingDriver, vehicleId);

    return ResponseEntity.ok(Map.of(
        "message", "Водитель привязан к ТС",
        "driverId", driverId,
        "vehicleId", vehicleId,
        "driverName", updated.getFullName()));
  }

  @DeleteMapping("/{driverId}/unassign-vehicle")
  public ResponseEntity<?> unassignVehicleFromDriver(@PathVariable UUID driverId) {
    Driver driver = driverService.unassignVehicle(driverId);
    if (driver == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(Map.of(
        "message", "Водитель отвязан от ТС",
        "driverId", driverId));
  }
}