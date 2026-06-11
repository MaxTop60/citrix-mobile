package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.entity.Vehicle;
import com.dispatcher.backend.repository.ClientRepository;
import com.dispatcher.backend.repository.DriverRepository;
import com.dispatcher.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class DriverService {

  @Autowired
  private DriverRepository driverRepository;

  @Autowired
  private ClientRepository clientRepository;

  @Autowired
  private VehicleRepository vehicleRepository;

  public List<Driver> getAllDrivers() {
    return driverRepository.findAll();
  }

  public Driver getDriverById(UUID driverId) {
    return driverRepository.findById(driverId).orElse(null);
  }

  public List<Driver> getDriversByClient(UUID clientId) {
    return driverRepository.findByClient_ClientId(clientId);
  }

  public List<Driver> getActiveDrivers() {
    return driverRepository.findByIsActive(true);
  }

  public Driver getDriverByVehicle(UUID vehicleId) {
    return driverRepository.findByVehicle_VehicleId(vehicleId).orElse(null);
  }

  public Driver createDriver(Driver driver, UUID clientId, UUID vehicleId) {
    if (clientId != null) {
      Client client = clientRepository.findById(clientId).orElse(null);
      driver.setClient(client);
    }
    if (vehicleId != null) {
      Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
      driver.setVehicle(vehicle);
    }
    driver.setDriverId(null);
    return driverRepository.save(driver);
  }

  public Driver updateDriver(UUID driverId, Driver driverUpdate, UUID vehicleId) {
    Driver existing = getDriverById(driverId);
    if (existing == null)
      return null;

    existing.setFullName(driverUpdate.getFullName());
    existing.setPhone(driverUpdate.getPhone());
    existing.setTelegramId(driverUpdate.getTelegramId());

    if (vehicleId != null) {
      Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
      existing.setVehicle(vehicle);
    }

    return driverRepository.save(existing);
  }

  public Driver updateDriverStatus(UUID driverId, Boolean isActive) {
    Driver existing = getDriverById(driverId);
    if (existing == null)
      return null;
    existing.setIsActive(isActive);
    return driverRepository.save(existing);
  }

  public void deleteDriver(UUID driverId) {
    driverRepository.deleteById(driverId);
  }

  public Driver unassignVehicle(UUID driverId) {
    Driver existing = getDriverById(driverId);
    if (existing == null) {
      return null;
    }
    // Обновляем только vehicle_id, не трогая остальные поля
    existing.setVehicle(null);
    return driverRepository.save(existing);
  }
}