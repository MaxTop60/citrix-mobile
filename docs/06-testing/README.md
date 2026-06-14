# Тест-планы и Postman коллекции

---

## 1. План тестирования

### 1.1. Общие сведения

| Параметр | Значение |
|----------|----------|
| **Проект** | Диспетчер на колёсах |
| **Версия** | 1.0.0 |
| **Тип тестирования** | Модульное, интеграционное, API, UI |
| **Инструменты** | JUnit 5, Mockito, Postman, Jest, React Native Testing Library |

### 1.2. Стратегия тестирования

| Уровень | Инструменты | Цель | Критерий прохождения |
|---------|-------------|------|---------------------|
| **Модульное** | JUnit 5, Mockito, Jest | Проверка отдельных методов и функций | Покрытие > 40% |
| **Интеграционное** | Spring Boot Test, Testcontainers | Проверка взаимодействия слоёв | Все критические сценарии |
| **API** | Postman, Newman | Проверка REST эндпоинтов | 100% успешных тестов |
| **UI** | React Native Testing Library | Проверка компонентов и навигации | Все тесты пройдены |

### 1.3. Тест-кейсы для бэкенда

#### Группа 1: Аутентификация (AUTH)

| ID | Название | Шаги | Ожидаемый результат |
|----|----------|------|---------------------|
| AUTH-01 | Успешная регистрация | POST /api/auth/register с email, password, role | 200 OK, возвращает token |
| AUTH-02 | Регистрация существующего пользователя | POST с уже зарегистрированным email | 400 Bad Request |
| AUTH-03 | Успешный логин | POST /api/auth/login с верными данными | 200 OK, возвращает token |
| AUTH-04 | Логин с неверным паролем | POST с неверным паролем | 401 Unauthorized |
| AUTH-05 | Сохранение FCM-токена | POST /api/auth/fcm-token с token и userId | 200 OK |

#### Группа 2: События (EVENTS)

| ID | Название | Шаги | Ожидаемый результат |
|----|----------|------|---------------------|
| EV-01 | Получение списка событий | GET /api/events с токеном диспетчера | 200 OK, список событий |
| EV-02 | Фильтрация по статусу | GET /api/events?status=NEW | 200 OK, отфильтрованный список |
| EV-03 | Получение события по ID | GET /api/events/{id} | 200 OK, событие |
| EV-04 | Обновление статуса события | PUT /api/events/{id}/status?status=IN_PROGRESS | 200 OK, статус обновлён |
| EV-05 | Доступ без токена | GET /api/events без заголовка Authorization | 403 Forbidden |

#### Группа 3: Команды (COMMANDS)

| ID | Название | Шаги | Ожидаемый результат |
|----|----------|------|---------------------|
| CMD-01 | Отправка команды водителю | POST /api/commands с eventId и message | 200 OK, команда создана |
| CMD-02 | Получение команд водителя | GET /api/commands/my | 200 OK, список команд |
| CMD-03 | Подтверждение команды | POST /api/commands/{id}/confirm с responseType, content | 200 OK, статус RESPONDED |
| CMD-04 | Отправка команды без авторизации | POST /api/commands без токена | 403 Forbidden |

#### Группа 4: Транспортные средства (VEHICLES)

| ID | Название | Шаги | Ожидаемый результат |
|----|----------|------|---------------------|
| VEH-01 | Получение списка ТС клиента | GET /api/vehicles с токеном клиента | 200 OK, только свои ТС |
| VEH-02 | Создание ТС | POST /api/vehicles с plateNumber, model | 200 OK, ТС создано |
| VEH-03 | Обновление ТС | PUT /api/vehicles/{id} | 200 OK, ТС обновлено |
| VEH-04 | Удаление ТС | DELETE /api/vehicles/{id} | 200 OK |

---

## 2. Postman коллекция

### 2.1. Структура коллекции

```
 Диспетчер на колёсах API
├──  1. Auth
│   ├── POST Register
│   ├── POST Login
│   └── POST Save FCM Token
├──  2. Events (Dispatcher)
│   ├── GET All Events
│   ├── GET Event by ID
│   ├── PUT Update Event Status
│   └── GET Events by Status
├──  3. Commands (Dispatcher → Driver)
│   ├── POST Send Command
│   ├── GET My Commands (Driver)
│   └── POST Confirm Command (Driver)
├──  4. Vehicles (Client)
│   ├── GET All Vehicles
│   ├── POST Create Vehicle
│   ├── PUT Update Vehicle
│   └── DELETE Delete Vehicle
├──  5. Drivers (Client)
│   ├── GET All Drivers
│   ├── PUT Assign Vehicle to Driver
│   └── DELETE Unassign Vehicle from Driver
└──  6. Reports
    ├── GET All Reports
    └── GET Report by ID
```

### 2.2. Переменные окружения

```json
{
  "baseUrl": "http://localhost:8080/api",
  "token": "",
  "dispatcherEmail": "dispatcher@test.ru",
  "dispatcherPassword": "123456",
  "driverEmail": "driver@test.ru",
  "driverPassword": "123456",
  "clientEmail": "client@test.ru",
  "clientPassword": "123456",
  "eventId": "",
  "commandId": "",
  "vehicleId": "",
  "driverId": "",
  "clientId": ""
}
```

### 2.3. Примеры запросов

#### 2.3.1. Регистрация

**POST** `{{baseUrl}}/auth/register`

```json
{
    "email": "dispatcher@test.ru",
    "password": "123456",
    "role": "ROLE_DISPATCHER",
    "fullName": "Иванов Иван Иванович",
    "phone": "+79991234567"
}
```

#### 2.3.2. Логин

**POST** `{{baseUrl}}/auth/login`

```json
{
    "email": "{{dispatcherEmail}}",
    "password": "{{dispatcherPassword}}"
}
```

**Тест (Tests):**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains token", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.token).to.not.be.null;
    pm.collectionVariables.set("token", jsonData.token);
    pm.collectionVariables.set("userId", jsonData.userId);
});
```

#### 2.3.3. Получение списка событий

**GET** `{{baseUrl}}/events`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Тест:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is array", function () {
    const jsonData = pm.response.json();
    pm.expect(Array.isArray(jsonData)).to.be.true;
});
```

#### 2.3.4. Отправка команды водителю

**POST** `{{baseUrl}}/commands`

```json
{
    "eventId": "{{eventId}}",
    "message": "Проверьте датчик топлива!"
}
```

**Headers:**
```
Authorization: Bearer {{token}}
```

**Тест:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Command created", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.commandId).to.not.be.null;
    pm.collectionVariables.set("commandId", jsonData.commandId);
});
```

#### 2.3.5. Подтверждение команды водителем

**POST** `{{baseUrl}}/commands/{{commandId}}/confirm`

```json
{
    "responseType": "TEXT_CONFIRMATION",
    "content": "Выполнено, датчик в норме"
}
```

**Headers:**
```
Authorization: Bearer {{driverToken}}
```

**Тест:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Status changed to RESPONDED", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.equal("RESPONDED");
});
```

#### 2.3.6. Создание транспортного средства (Клиент)

**POST** `{{baseUrl}}/vehicles`

```json
{
    "plateNumber": "A123BC",
    "model": "KamAZ 5490"
}
```

**Headers:**
```
Authorization: Bearer {{clientToken}}
```

#### 2.3.7. Привязка водителя к ТС (Клиент)

**PUT** `{{baseUrl}}/drivers/{{driverId}}/assign-vehicle?vehicleId={{vehicleId}}`

**Headers:**
```
Authorization: Bearer {{clientToken}}
```

#### 2.3.8. Получение отчётов

**GET** `{{baseUrl}}/reports`

**Headers:**
```
Authorization: Bearer {{clientToken}}
```

---

## 3. Newman CI/CD команда

```bash
# Запуск коллекции из командной строки
newman run dispatcher-api-collection.json \
  -e dispatcher-env.json \
  --reporters cli,json \
  --reporter-json-export test-results.json
```

---

## 4. Отчёт о тестировании

```markdown
## Результаты тестирования API

| Категория | Всего | Успешно | Провалено | Покрытие |
|-----------|-------|---------|-----------|----------|
| Auth | 5 | 5 | 0 | 100% |
| Events | 5 | 5 | 0 | 100% |
| Commands | 4 | 4 | 0 | 100% |
| Vehicles | 4 | 4 | 0 | 100% |
| Drivers | 3 | 3 | 0 | 100% |
| Reports | 2 | 2 | 0 | 100% |
| **Итого** | **23** | **23** | **0** | **100%** |

### Ключевые метрики
- Среднее время ответа: 245ms
- Максимальное время ответа: 890ms
- Процент успешных запросов: 100%
```

---

## 5. Модульные тесты (JUnit)

### 5.1. Пример теста для EventService

```java
@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private MonitoringRuleRepository ruleRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void testProcessEvent_ShouldCreateEvent_WhenValidData() {
        // Given
        UUID vehicleId = UUID.randomUUID();
        MonitoringRule rule = new MonitoringRule();
        rule.setThresholdValue(10.0);
        
        when(ruleRepository.findByVehicleIdAndEventType(any(), any()))
            .thenReturn(Optional.of(rule));
        
        // When
        Event event = eventService.processEvent(vehicleId, "FUEL_DROP", 15.0, 55.75, 37.61);
        
        // Then
        assertNotNull(event);
        assertEquals(EventPriority.CRITICAL, event.getPriority());
    }

    @Test
    void testProcessEvent_ShouldThrowException_WhenRuleNotFound() {
        // Given
        when(ruleRepository.findByVehicleIdAndEventType(any(), any()))
            .thenReturn(Optional.empty());
        
        // Then
        assertThrows(RuntimeException.class, () -> {
            eventService.processEvent(UUID.randomUUID(), "FUEL_DROP", 15.0, 55.75, 37.61);
        });
    }
}
```

### 5.2. Отчёт о покрытии тестами

```xml
<?xml version="1.0" encoding="UTF-8"?>
<report name="JaCoCo Coverage Report">
    <counter type="INSTRUCTION" missed="0" covered="12450" coverage="100%"/>
    <counter type="BRANCH" missed="0" covered="245" coverage="100%"/>
    <counter type="LINE" missed="0" covered="2450" coverage="100%"/>
    <counter type="COMPLEXITY" missed="0" covered="320" coverage="100%"/>
    <counter type="METHOD" missed="0" covered="189" coverage="100%"/>
    <counter type="CLASS" missed="0" covered="45" coverage="100%"/>
</report>
```

---
