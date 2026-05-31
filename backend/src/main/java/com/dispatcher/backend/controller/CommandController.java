package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.CommandDto;
import com.dispatcher.backend.dto.SendCommandRequest;
import com.dispatcher.backend.entity.Command;
import com.dispatcher.backend.service.CommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/commands")
public class CommandController {

    @Autowired
    private CommandService commandService;

    // Конвертация Entity → DTO
    private CommandDto convertToDto(Command command) {
        CommandDto dto = new CommandDto();
        dto.setCommandId(command.getCommandId());
        if (command.getEvent() != null) {
            dto.setEventId(command.getEvent().getEventId());
        }
        dto.setMessage(command.getMessage());
        dto.setChannel(command.getChannel());
        dto.setStatus(command.getStatus());
        dto.setSentAt(command.getSentAt());
        dto.setDeliveredAt(command.getDeliveredAt());
        dto.setErrorMessage(command.getErrorMessage());
        return dto;
    }

    // GET /api/commands — получить все команды
    @GetMapping
    public List<CommandDto> getAllCommands() {
        return commandService.getAllCommands().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // GET /api/commands/{id} — получить команду по ID
    @GetMapping("/{id}")
    public CommandDto getCommandById(@PathVariable UUID id) {
        Command command = commandService.getCommandById(id);
        return command != null ? convertToDto(command) : null;
    }

    // GET /api/commands/event/{eventId} — получить команды по событию
    @GetMapping("/event/{eventId}")
    public List<CommandDto> getCommandsByEvent(@PathVariable UUID eventId) {
        return commandService.getCommandsByEvent(eventId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // POST /api/commands — отправить команду водителю (только SMS)
    @PostMapping
    public CommandDto sendCommand(@RequestBody SendCommandRequest request,
            @RequestParam UUID driverId) {
        Command saved = commandService.sendCommand(
                request.getEventId(),
                request.getMessage(),
                "SMS",
                driverId);
        return convertToDto(saved);
    }

    // PUT /api/commands/{id}/status — обновить статус команды
    @PutMapping("/{id}/status")
    public CommandDto updateCommandStatus(@PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String errorMessage) {
        Command updated = commandService.updateCommandStatus(id, status, errorMessage);
        return updated != null ? convertToDto(updated) : null;
    }

    // DELETE /api/commands/{id} — удалить команду
    @DeleteMapping("/{id}")
    public String deleteCommand(@PathVariable UUID id) {
        commandService.deleteCommand(id);
        return "Команда удалена";
    }
}