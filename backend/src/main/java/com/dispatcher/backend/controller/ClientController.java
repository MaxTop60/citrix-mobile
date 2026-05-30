package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.ClientDto;
import com.dispatcher.backend.dto.ClientRequest;
import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

  @Autowired
  private ClientService clientService;

  // Конвертация Entity → DTO
  private ClientDto convertToDto(Client client) {
    ClientDto dto = new ClientDto();
    dto.setClientId(client.getClientId());
    dto.setName(client.getName());
    dto.setInn(client.getInn());
    dto.setPhone(client.getPhone());
    dto.setEmail(client.getEmail());
    dto.setIsActive(client.getIsActive());
    dto.setCreatedAt(client.getCreatedAt());
    dto.setUpdatedAt(client.getUpdatedAt());
    return dto;
  }

  // GET /api/clients — получить всех клиентов
  @GetMapping
  public List<ClientDto> getAllClients() {
    return clientService.getAllClients().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  // GET /api/clients/{id} — получить клиента по ID
  @GetMapping("/{id}")
  public ClientDto getClientById(@PathVariable UUID id) {
    Client client = clientService.getClientById(id);
    return client != null ? convertToDto(client) : null;
  }

  // GET /api/clients/inn/{inn} — найти клиента по ИНН
  @GetMapping("/inn/{inn}")
  public ClientDto getClientByInn(@PathVariable String inn) {
    Client client = clientService.getClientByInn(inn);
    return client != null ? convertToDto(client) : null;
  }

  // GET /api/clients/email/{email} — найти клиента по email
  @GetMapping("/email/{email}")
  public ClientDto getClientByEmail(@PathVariable String email) {
    Client client = clientService.getClientByEmail(email);
    return client != null ? convertToDto(client) : null;
  }

  // POST /api/clients — создать клиента
  @PostMapping
  public ClientDto createClient(@RequestBody ClientRequest request) {
    Client client = new Client(
        request.getName(),
        request.getInn(),
        request.getPhone(),
        request.getEmail());
    Client saved = clientService.createClient(client);
    return convertToDto(saved);
  }

  // PUT /api/clients/{id} — обновить клиента
  @PutMapping("/{id}")
  public ClientDto updateClient(@PathVariable UUID id, @RequestBody ClientRequest request) {
    Client clientUpdate = new Client(
        request.getName(),
        request.getInn(),
        request.getPhone(),
        request.getEmail());
    Client updated = clientService.updateClient(id, clientUpdate);
    return updated != null ? convertToDto(updated) : null;
  }

  // PATCH /api/clients/{id}/status — изменить статус (активен/неактивен)
  @PatchMapping("/{id}/status")
  public ClientDto updateClientStatus(@PathVariable UUID id, @RequestParam Boolean isActive) {
    Client updated = clientService.updateClientStatus(id, isActive);
    return updated != null ? convertToDto(updated) : null;
  }

  // DELETE /api/clients/{id} — удалить клиента
  @DeleteMapping("/{id}")
  public String deleteClient(@PathVariable UUID id) {
    clientService.deleteClient(id);
    return "Клиент удалён";
  }
}