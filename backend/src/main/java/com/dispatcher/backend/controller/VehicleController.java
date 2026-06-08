package com.dispatcher.backend.controller;

import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.entity.User;
import com.dispatcher.backend.entity.Vehicle;
import com.dispatcher.backend.repository.ClientRepository;
import com.dispatcher.backend.repository.UserRepository;
import com.dispatcher.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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

  @Autowired
  private UserRepository userRepository;

  // Получить текущего пользователя из JWT токена
  private User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  // GET /api/vehicles — получить ТС только для текущего клиента
  @GetMapping
  public List<Vehicle> getAllVehicles() {
    User currentUser = getCurrentUser();
    UUID clientId = currentUser.getClientId();

    if (clientId == null) {
      return List.of(); // Не клиент или нет привязки — пустой список
    }

    return vehicleRepository.findByClient_ClientId(clientId);
  }

  // GET /api/vehicles/{id} — получить ТС по ID (с проверкой прав)
  @GetMapping("/{id}")
  public Vehicle getVehicleById(@PathVariable UUID id) {
    User currentUser = getCurrentUser();
    UUID clientId = currentUser.getClientId();

    Vehicle vehicle = vehicleRepository.findById(id).orElse(null);

    if (vehicle == null || vehicle.getClient() == null) {
      return null;
    }

    // Проверяем, что ТС принадлежит текущему клиенту
    if (clientId != null && vehicle.getClient().getClientId().equals(clientId)) {
      return vehicle;
    }

    return null;
  }

  // POST /api/vehicles — создать ТС для текущего клиента
  @PostMapping
  public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
    User currentUser = getCurrentUser();
    UUID clientId = currentUser.getClientId();

    if (clientId == null) {
      throw new RuntimeException("Клиент не найден. Невозможно создать ТС без привязки к автопарку");
    }

    Client client = clientRepository.findById(clientId)
        .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));

    vehicle.setClient(client);
    vehicle.setVehicleId(null);

    return vehicleRepository.save(vehicle);
  }

  // PUT /api/vehicles/{id} — обновить ТС
  @PutMapping("/{id}")
  public Vehicle updateVehicle(@PathVariable UUID id, @RequestBody Vehicle vehicleUpdate) {
    User currentUser = getCurrentUser();
    UUID clientId = currentUser.getClientId();

    Vehicle existing = vehicleRepository.findById(id).orElse(null);
    if (existing == null) {
      return null;
    }

    // Проверяем, что ТС принадлежит текущему клиенту
    if (existing.getClient() == null || !existing.getClient().getClientId().equals(clientId)) {
      throw new RuntimeException("Нет прав на редактирование этого ТС");
    }

    existing.setPlateNumber(vehicleUpdate.getPlateNumber());
    existing.setModel(vehicleUpdate.getModel());
    existing.setCurrentSpeed(vehicleUpdate.getCurrentSpeed());
    existing.setCurrentFuelLevel(vehicleUpdate.getCurrentFuelLevel());

    return vehicleRepository.save(existing);
  }

  // DELETE /api/vehicles/{id} — удалить ТС
  @DeleteMapping("/{id}")
  public String deleteVehicle(@PathVariable UUID id) {
    User currentUser = getCurrentUser();
    UUID clientId = currentUser.getClientId();

    Vehicle existing = vehicleRepository.findById(id).orElse(null);
    if (existing == null) {
      return "ТС не найдено";
    }

    // Проверяем, что ТС принадлежит текущему клиенту
    if (existing.getClient() == null || !existing.getClient().getClientId().equals(clientId)) {
      throw new RuntimeException("Нет прав на удаление этого ТС");
    }

    vehicleRepository.deleteById(id);
    return "Транспортное средство удалено";
  }
}