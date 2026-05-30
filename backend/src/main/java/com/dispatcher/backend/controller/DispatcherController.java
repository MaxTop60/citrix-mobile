package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.DispatcherDto;
import com.dispatcher.backend.entity.Dispatcher;
import com.dispatcher.backend.service.DispatcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dispatchers")
public class DispatcherController {

  @Autowired
  private DispatcherService dispatcherService;

  private DispatcherDto convertToDto(Dispatcher dispatcher) {
    DispatcherDto dto = new DispatcherDto();
    dto.setDispatcherId(dispatcher.getDispatcherId());
    if (dispatcher.getClient() != null) {
      dto.setClientId(dispatcher.getClient().getClientId());
    }
    dto.setFullName(dispatcher.getFullName());
    dto.setEmail(dispatcher.getEmail());
    dto.setPhone(dispatcher.getPhone());
    dto.setRole(dispatcher.getRole());
    dto.setPushToken(dispatcher.getPushToken());
    dto.setPushTokenPlatform(dispatcher.getPushTokenPlatform());
    dto.setIsActive(dispatcher.getIsActive());
    dto.setLastActiveAt(dispatcher.getLastActiveAt());
    return dto;
  }

  @GetMapping
  public List<DispatcherDto> getAllDispatchers() {
    return dispatcherService.getAllDispatchers().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public DispatcherDto getDispatcherById(@PathVariable UUID id) {
    Dispatcher dispatcher = dispatcherService.getDispatcherById(id);
    return dispatcher != null ? convertToDto(dispatcher) : null;
  }

  @GetMapping("/client/{clientId}")
  public List<DispatcherDto> getDispatchersByClient(@PathVariable UUID clientId) {
    return dispatcherService.getDispatchersByClient(clientId).stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  @GetMapping("/active")
  public List<DispatcherDto> getActiveDispatchers() {
    return dispatcherService.getActiveDispatchers().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  @GetMapping("/email/{email}")
  public DispatcherDto getDispatcherByEmail(@PathVariable String email) {
    Dispatcher dispatcher = dispatcherService.getDispatcherByEmail(email);
    return dispatcher != null ? convertToDto(dispatcher) : null;
  }

  @PostMapping
  public DispatcherDto createDispatcher(@RequestBody DispatcherDto dispatcherDto,
      @RequestParam UUID clientId) {
    Dispatcher dispatcher = new Dispatcher();
    dispatcher.setFullName(dispatcherDto.getFullName());
    dispatcher.setEmail(dispatcherDto.getEmail());
    dispatcher.setPhone(dispatcherDto.getPhone());
    dispatcher.setRole(dispatcherDto.getRole());

    Dispatcher saved = dispatcherService.createDispatcher(dispatcher, clientId);
    return convertToDto(saved);
  }

  @PutMapping("/{id}")
  public DispatcherDto updateDispatcher(@PathVariable UUID id,
      @RequestBody DispatcherDto dispatcherDto) {
    Dispatcher dispatcherUpdate = new Dispatcher();
    dispatcherUpdate.setFullName(dispatcherDto.getFullName());
    dispatcherUpdate.setPhone(dispatcherDto.getPhone());
    dispatcherUpdate.setRole(dispatcherDto.getRole());

    Dispatcher updated = dispatcherService.updateDispatcher(id, dispatcherUpdate);
    return updated != null ? convertToDto(updated) : null;
  }

  @PatchMapping("/{id}/push-token")
  public DispatcherDto updatePushToken(@PathVariable UUID id,
      @RequestParam String token,
      @RequestParam String platform) {
    Dispatcher updated = dispatcherService.updatePushToken(id, token, platform);
    return updated != null ? convertToDto(updated) : null;
  }

  @PatchMapping("/{id}/status")
  public DispatcherDto updateDispatcherStatus(@PathVariable UUID id, @RequestParam Boolean isActive) {
    Dispatcher updated = dispatcherService.updateDispatcherStatus(id, isActive);
    return updated != null ? convertToDto(updated) : null;
  }

  @DeleteMapping("/{id}")
  public String deleteDispatcher(@PathVariable UUID id) {
    dispatcherService.deleteDispatcher(id);
    return "Диспетчер удалён";
  }
}