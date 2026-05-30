package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.CommandDto;
import com.dispatcher.backend.dto.SendCommandRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/commands")
public class CommandController {

    // Временное хранилище команд в памяти
    // TODO: Реализовать реальное хранилище команд
    private final List<CommandDto> commands = new ArrayList<>();

    public CommandController() {
        // Тестовая команду при старте
        commands.add(new CommandDto(
            UUID.randomUUID(),
            UUID.randomUUID(),
            "DELIVERED",
            "SMS",
            "Проверьте уровень топлива",
            LocalDateTime.now().minusMinutes(10),
            LocalDateTime.now().minusMinutes(8),
            null
        ));
        commands.add(new CommandDto(
            UUID.randomUUID(),
            UUID.randomUUID(),
            "SENT",
            "TELEGRAM",
            "Превышение скорости, снизьте скорость",
            LocalDateTime.now().minusMinutes(5),
            null,
            null
        ));
    }

    // GET /api/commands — получить все команды
    @GetMapping
    public List<CommandDto> getAllCommands() {
        return commands;
    }

    // GET /api/commands/{id} — получить команду по ID
    @GetMapping("/{id}")
    public CommandDto getCommandById(@PathVariable UUID id) {
        return commands.stream()
            .filter(cmd -> cmd.getCommandId().equals(id))
            .findFirst()
            .orElse(null);
    }

    // POST /api/commands — отправить команду водителю
    @PostMapping
    public CommandDto sendCommand(@RequestBody SendCommandRequest request) {
        // TODO: Здесь будет бизнес-логика отправки команды
        
        // Поиск события 
        // Симуляция успешной отправки
        // TODO: Реализовать реальную отправку
        
        CommandDto newCommand = new CommandDto();
        newCommand.setCommandId(UUID.randomUUID());
        newCommand.setEventId(request.getEventId());
        newCommand.setStatus("SENT");  // Начальный статус
        newCommand.setChannel(request.getChannel());
        
        // Формируем сообщение
        String message = "Команда по событию " + request.getEventId();
        if (request.getCustomComment() != null && !request.getCustomComment().isEmpty()) {
            message += ". Комментарий: " + request.getCustomComment();
        }
        newCommand.setMessage(message);
        newCommand.setSentAt(LocalDateTime.now());
        
        // Симуляция доставки 
        newCommand.setDeliveredAt(LocalDateTime.now().plusSeconds(2));
        newCommand.setStatus("DELIVERED");
        
        commands.add(0, newCommand);
        return newCommand;
    }

    // DELETE /api/commands/{id} — отменить/удалить команду
    @DeleteMapping("/{id}")
    public String deleteCommand(@PathVariable UUID id) {
        boolean removed = commands.removeIf(cmd -> cmd.getCommandId().equals(id));
        return removed ? "Команда удалена" : "Команда не найдена";
    }
}