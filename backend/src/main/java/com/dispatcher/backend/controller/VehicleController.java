package com.dispatcher.backend.controller;

import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.entity.Vehicle;
import com.dispatcher.backend.repository.ClientRepository;
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

  @Autowired
  private ClientRepository clientRepository;

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

  // POST /api/vehicles — создать ТС с привязкой к клиенту
  @PostMapping
  public Vehicle createVehicle(@RequestBody Vehicle vehicle, @RequestParam(required = false) UUID clientId) {
    if (clientId != null) {
      Client client = clientRepository.findById(clientId).orElse(null);
      vehicle.setClient(client);
    }
    vehicle.setVehicleId(null);
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