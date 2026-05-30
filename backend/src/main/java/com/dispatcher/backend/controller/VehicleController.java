package com.dispatcher.backend.controller;

import com.dispatcher.backend.entity.Vehicle;
import com.dispatcher.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

  @Autowired
  private VehicleRepository vehicleRepository;

  // GET /api/vehicles — получить все транспортные средства
  @GetMapping
  public List<Vehicle> getAllVehicles() {
    return vehicleRepository.findAll();
  }

  // GET /api/vehicles/{id} — получить ТС по ID
  @GetMapping("/{id}")
  public Vehicle getVehicleById(@PathVariable UUID id) {
    return vehicleRepository.findById(id).orElse(null);
  }

  // POST /api/vehicles — создать новое ТС
  @PostMapping
  public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
    vehicle.setVehicleId(null); // чтобы Hibernate создал новый ID
    return vehicleRepository.save(vehicle);
  }

  // PUT /api/vehicles/{id} — обновить ТС
  @PutMapping("/{id}")
  public Vehicle updateVehicle(@PathVariable UUID id, @RequestBody Vehicle vehicleUpdate) {
    Vehicle existing = vehicleRepository.findById(id).orElse(null);
    if (existing != null) {
      existing.setPlateNumber(vehicleUpdate.getPlateNumber());
      existing.setModel(vehicleUpdate.getModel());
      existing.setCurrentSpeed(vehicleUpdate.getCurrentSpeed());
      existing.setCurrentFuelLevel(vehicleUpdate.getCurrentFuelLevel());
      return vehicleRepository.save(existing);
    }
    return null;
  }

  // DELETE /api/vehicles/{id} — удалить ТС
  @DeleteMapping("/{id}")
  public String deleteVehicle(@PathVariable UUID id) {
    vehicleRepository.deleteById(id);
    return "Транспортное средство удалено";
  }
}