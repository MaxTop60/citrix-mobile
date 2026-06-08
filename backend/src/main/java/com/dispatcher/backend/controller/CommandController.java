package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.CommandDto;
import com.dispatcher.backend.dto.SendCommandRequest;
import com.dispatcher.backend.entity.Command;
import com.dispatcher.backend.entity.DriverResponse;
import com.dispatcher.backend.entity.User;
import com.dispatcher.backend.repository.DriverResponseRepository;
import com.dispatcher.backend.repository.UserRepository;
import com.dispatcher.backend.service.CommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/commands")
public class CommandController {

    @Autowired
    private CommandService commandService;

    @Autowired
    private DriverResponseRepository driverResponseRepository;

    @Autowired
    private UserRepository userRepository;

    // Получить текущего пользователя из JWT токена
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

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

    // GET /api/commands — получить команды только для текущего водителя
    @GetMapping
    public List<CommandDto> getAllCommands() {
        User currentUser = getCurrentUser();
        UUID driverId = currentUser.getDriverId();

        if (driverId == null) {
            return List.of(); // Водитель не привязан
        }

        List<Command> commands = commandService.getCommandsByDriverId(driverId);
        return commands.stream()
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

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmCommand(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        String responseType = request.get("responseType");
        String content = request.get("content");

        Command command = commandService.getCommandById(id);
        if (command == null) {
            return ResponseEntity.notFound().build();
        }

        // Создаём ответ водителя
        DriverResponse driverResponse = new DriverResponse(command, responseType, content);
        driverResponseRepository.save(driverResponse);

        // Обновляем статус команды
        command.setStatus("RESPONDED");
        commandService.updateCommand(command);

        return ResponseEntity.ok(command);
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