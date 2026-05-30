package com.dispatcher.backend.service;

import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.entity.Dispatcher;
import com.dispatcher.backend.repository.ClientRepository;
import com.dispatcher.backend.repository.DispatcherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DispatcherService {

  @Autowired
  private DispatcherRepository dispatcherRepository;

  @Autowired
  private ClientRepository clientRepository;

  public List<Dispatcher> getAllDispatchers() {
    return dispatcherRepository.findAll();
  }

  public Dispatcher getDispatcherById(UUID dispatcherId) {
    return dispatcherRepository.findById(dispatcherId).orElse(null);
  }

  public List<Dispatcher> getDispatchersByClient(UUID clientId) {
    return dispatcherRepository.findByClient_ClientId(clientId);
  }

  public List<Dispatcher> getActiveDispatchers() {
    return dispatcherRepository.findByIsActive(true);
  }

  public Dispatcher getDispatcherByEmail(String email) {
    return dispatcherRepository.findByEmail(email).orElse(null);
  }

  public Dispatcher createDispatcher(Dispatcher dispatcher, UUID clientId) {
    if (clientId != null) {
      Client client = clientRepository.findById(clientId).orElse(null);
      dispatcher.setClient(client);
    }
    dispatcher.setDispatcherId(null);
    dispatcher.setLastActiveAt(LocalDateTime.now());
    return dispatcherRepository.save(dispatcher);
  }

  public Dispatcher updateDispatcher(UUID dispatcherId, Dispatcher dispatcherUpdate) {
    Dispatcher existing = getDispatcherById(dispatcherId);
    if (existing == null)
      return null;

    existing.setFullName(dispatcherUpdate.getFullName());
    existing.setPhone(dispatcherUpdate.getPhone());
    existing.setRole(dispatcherUpdate.getRole());

    return dispatcherRepository.save(existing);
  }

  public Dispatcher updatePushToken(UUID dispatcherId, String token, String platform) {
    Dispatcher existing = getDispatcherById(dispatcherId);
    if (existing == null)
      return null;
    existing.updatePushToken(token, platform);
    return dispatcherRepository.save(existing);
  }

  public Dispatcher updateDispatcherStatus(UUID dispatcherId, Boolean isActive) {
    Dispatcher existing = getDispatcherById(dispatcherId);
    if (existing == null)
      return null;
    existing.setIsActive(isActive);
    return dispatcherRepository.save(existing);
  }

  public void deleteDispatcher(UUID dispatcherId) {
    dispatcherRepository.deleteById(dispatcherId);
  }
}