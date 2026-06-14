# OpenAPI, Swagger

## 1. Зависимость в pom.xml

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

---

## 2. Настройка в application.properties

```properties
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/api-docs
springdoc.packages-to-scan=com.dispatcher.backend.controller
```

---

## 3. Конфигурация OpenApiConfig.java

```java
package com.dispatcher.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Диспетчер на колёсах API")
                .version("1.0.0")
                .description("API для мобильного приложения Диспетчер на колёсах"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
```

---

## 4. Аннотации в контроллерах

### AuthController.java

```java
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Аутентификация", description = "Регистрация и вход")
public class AuthController {

    @PostMapping("/register")
    @Operation(summary = "Регистрация пользователя")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Успешно"),
        @ApiResponse(responseCode = "400", description = "Пользователь уже существует")
    })
    public AuthResponse register(@RequestBody RegisterRequest request) {
        // ...
    }

    @PostMapping("/login")
    @Operation(summary = "Вход в систему")
    public AuthResponse login(@RequestBody LoginRequest request) {
        // ...
    }
}
```

### EventController.java

```java
@RestController
@RequestMapping("/api/events")
@Tag(name = "События", description = "Управление событиями мониторинга")
public class EventController {

    @GetMapping
    @Operation(summary = "Получить список событий")
    public List<EventDto> getAllEvents() {
        // ...
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить событие по ID")
    public EventDto getEventById(@PathVariable UUID id) {
        // ...
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Обновить статус события")
    public EventDto updateEventStatus(@PathVariable UUID id, @RequestParam String status) {
        // ...
    }
}
```

### CommandController.java

```java
@RestController
@RequestMapping("/api/commands")
@Tag(name = "Команды", description = "Отправка и подтверждение команд")
public class CommandController {

    @PostMapping
    @Operation(summary = "Отправить команду водителю")
    public CommandDto sendCommand(@RequestBody SendCommandRequest request) {
        // ...
    }

    @GetMapping("/my")
    @Operation(summary = "Получить мои команды (для водителя)")
    public List<CommandDto> getMyCommands() {
        // ...
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "Подтвердить выполнение команды")
    public ResponseEntity<?> confirmCommand(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        // ...
    }
}
```

### VehicleController.java

```java
@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Транспорт", description = "Управление транспортными средствами")
public class VehicleController {

    @GetMapping
    @Operation(summary = "Получить список ТС")
    public List<Vehicle> getAllVehicles() {
        // ...
    }

    @PostMapping
    @Operation(summary = "Создать ТС")
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        // ...
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить ТС")
    public Vehicle updateVehicle(@PathVariable UUID id, @RequestBody Vehicle vehicleUpdate) {
        // ...
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить ТС")
    public String deleteVehicle(@PathVariable UUID id) {
        // ...
    }
}
```

---

## 5. Просмотр документации

После запуска бэкенда:

| URL | Описание |
|-----|----------|
| `http://localhost:8080/swagger-ui.html` | Интерактивная документация Swagger UI |
| `http://localhost:8080/api-docs` | JSON спецификация OpenAPI |

---

## 6. Документация API

### Аутентификация

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| POST | `/api/auth/register` | Регистрация нового пользователя | Публичный |
| POST | `/api/auth/login` | Вход в систему, получение JWT | Публичный |
| POST | `/api/auth/fcm-token` | Сохранение FCM-токена устройства | Авторизованный |

### События

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| GET | `/api/events` | Получение списка событий | DISPATCHER |
| GET | `/api/events/{id}` | Получение события по ID | DISPATCHER |
| PUT | `/api/events/{id}/status` | Обновление статуса события | DISPATCHER |

### Команды

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| POST | `/api/commands` | Отправка команды водителю | DISPATCHER |
| GET | `/api/commands/my` | Получение моих команд | DRIVER |
| POST | `/api/commands/{id}/confirm` | Подтверждение выполнения команды | DRIVER |
| PUT | `/api/commands/{id}/status` | Обновление статуса команды | DISPATCHER |

### Транспорт

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| GET | `/api/vehicles` | Получение списка ТС | CLIENT |
| POST | `/api/vehicles` | Создание ТС | CLIENT |
| PUT | `/api/vehicles/{id}` | Обновление ТС | CLIENT |
| DELETE | `/api/vehicles/{id}` | Удаление ТС | CLIENT |

---

## 7. Форматы запросов и ответов

### RegisterRequest

```json
{
    "email": "user@example.com",
    "password": "123456",
    "role": "ROLE_DISPATCHER",
    "fullName": "Иванов Иван Иванович",
    "phone": "+79991234567"
}
```

### AuthResponse

```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "email": "user@example.com",
    "role": "ROLE_DISPATCHER",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### EventDto

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "eventType": "FUEL_DROP",
    "priority": "CRITICAL",
    "status": "NEW",
    "timestamp": "2026-06-14T15:30:00Z",
    "latitude": 55.751244,
    "longitude": 37.618423,
    "description": "Падение топлива на 15 литров"
}
```

### SendCommandRequest

```json
{
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Проверьте датчик топлива"
}
```

---
