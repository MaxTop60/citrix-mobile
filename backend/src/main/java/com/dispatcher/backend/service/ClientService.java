package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {

  @Autowired
  private ClientRepository clientRepository;

  public List<Client> getAllClients() {
    return clientRepository.findAll();
  }

  public Client getClientById(UUID clientId) {
    return clientRepository.findById(clientId).orElse(null);
  }

  public Client getClientByInn(String inn) {
    return clientRepository.findByInn(inn).orElse(null);
  }

  public Client getClientByEmail(String email) {
    return clientRepository.findByEmail(email).orElse(null);
  }

  public Client createClient(Client client) {
    if (clientRepository.existsByInn(client.getInn())) {
      throw new RuntimeException("Client with INN " + client.getInn() + " already exists");
    }
    if (clientRepository.existsByEmail(client.getEmail())) {
      throw new RuntimeException("Client with email " + client.getEmail() + " already exists");
    }
    client.setClientId(null);
    client.setCreatedAt(LocalDateTime.now());
    client.setUpdatedAt(LocalDateTime.now());
    return clientRepository.save(client);
  }

  public Client updateClient(UUID clientId, Client clientUpdate) {
    Client existing = getClientById(clientId);
    if (existing == null) {
      return null;
    }
    existing.setName(clientUpdate.getName());
    existing.setPhone(clientUpdate.getPhone());
    existing.setEmail(clientUpdate.getEmail());
    existing.setUpdatedAt(LocalDateTime.now());
    return clientRepository.save(existing);
  }

  public Client updateClientStatus(UUID clientId, Boolean isActive) {
    Client existing = getClientById(clientId);
    if (existing == null) {
      return null;
    }
    existing.setIsActive(isActive);
    existing.setUpdatedAt(LocalDateTime.now());
    return clientRepository.save(existing);
  }

  public void deleteClient(UUID clientId) {
    clientRepository.deleteById(clientId);
  }
}