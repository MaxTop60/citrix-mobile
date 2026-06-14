# Мобильное прилложение для автоматизации управления клиентами

**Автор:** Торубаров Максим Евгеньевич  
**Группа:** ПИЖ-б-о-23-2  
**Траектория:** Mobile  
**Дата начала:** 15.02.2026  
**Дата сдачи:** [ДД.ММ.ГГГГ]

---

## Описание проекта

Мобильное приложение предназначено для автоматизации управления клиентами мониторинговой системы транспорта. Система позволяет диспетчерам получать уведомления о критических событиях (падение топлива, превышение скорости, простой) и отправлять команды водителям, а клиентам — управлять автопарком и просматривать отчёты. Водители, в свою очередь, получают команды и могут подтверждать их выполнение.

---

## Траектория выполнения

- [ ] Веб-разработка (React + Spring Boot)
- [ ] Десктоп
- [x] Мобильная
- [ ] Enterprise

---

## Технологический стек

| Компонент       | Технология                                      |
|-----------------|-------------------------------------------------|
| Бэкенд          | Java 17, Spring Boot 3, PostgreSQL, JPA/Hibernate |
| Мобильный клиент| React Native 0.85, TypeScript, Redux Toolkit    |
| API             | REST, JWT                                       |
| Безопасность    | JWT, BCrypt, Spring Security                    |
| Push-уведомления| Firebase Cloud Messaging (FCM)                  |
| Сборка          | Maven (бэкенд), Metro (React Native)            |
| Инструменты     | Git, Postman, Android Studio                    |

---

## Требования к окружению

| Требование           | Версия |
|----------------------|--------|
| Java JDK             | 17+    |
| Node.js              | 18+    |
| PostgreSQL           | 15+    |
| Maven                | 3.8+   |
| Android Studio       | 2024+  |

---

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/MaxTop60/citrix-mobile.git
cd citrix-mobile
```

### 2. Запуск бэкенда

```bash
cd backend
./mvnw spring-boot:run
```

Сервер запустится на `http://localhost:8080`

### 3. Запуск мобильного приложения

```bash
cd mobile
npm install
npm run android
```

Приложение установится на подключённый Android-телефон (или эмулятор).

### 4. Настройка подключения

Для работы с реальным телефоном по USB выполните проброс порта:

```bash
adb reverse tcp:8080 tcp:8080
```

URL в `mobile/src/shared/api/client.ts` будет выбран автоматически в зависимости от платформы.

---

## API Endpoints

Базовый URL: `http://localhost:8080/api`

| Метод   | Эндпоинт                      | Описание                     | Доступ           |
|---------|-------------------------------|------------------------------|------------------|
| POST    | /auth/login                   | Вход в систему               | Публичный        |
| POST    | /auth/register                | Регистрация пользователя     | Публичный        |
| POST    | /auth/fcm-token               | Сохранение FCM-токена        | DRIVER           |
| GET     | /events                       | Список событий               | DISPATCHER       |
| GET     | /events/{id}                  | Детали события               | DISPATCHER       |
| PUT     | /events/{id}/status           | Обновление статуса события   | DISPATCHER       |
| POST    | /commands                     | Отправка команды водителю    | DISPATCHER       |
| GET     | /commands/my                  | Команды текущего водителя    | DRIVER           |
| POST    | /commands/{id}/confirm        | Подтверждение команды        | DRIVER           |
| GET     | /vehicles                     | Список ТС (фильтрация)       | CLIENT           |
| POST    | /vehicles                     | Добавление ТС                | CLIENT           |
| PUT     | /vehicles/{id}                | Обновление ТС                | CLIENT           |
| DELETE  | /vehicles/{id}                | Удаление ТС                  | CLIENT           |
| GET     | /drivers                      | Список водителей             | CLIENT           |
| PUT     | /drivers/{id}/assign-vehicle  | Привязка водителя к ТС       | CLIENT           |
| DELETE  | /drivers/{id}/unassign-vehicle| Отвязка водителя от ТС       | CLIENT           |

---

## Структура документации

Вся документация находится в папке [docs/](docs/):

```
docs/
├── 00-project-charter/          # Паспорт проекта, IDEF0, BUC, SWOT, ROI
├── 01-requirements/             # Use Case, Domain Model, трассировка
├── 02-architecture/             # PCMEF, ADR, интерфейсы
├── 03-database/                 # ER-диаграмма, DDL, ORM
├── 04-detailed-design/          # Sequence диаграммы, спецификация методов
├── 05-implementation/           # Реализация слоёв
├── 06-testing/                  # Тест-планы, Postman
├── 07-refactoring/              # Рефакторинг, паттерны
├── 08-ui/                       # Скриншоты интерфейсов
├── 09-api/                      # OpenAPI, Swagger
├── 10-deployment/               # Развёртывание, инструкции
├── 11-user-guide/               # Руководство пользователя
├── 12-final-report/             # Пояснительная записка, презентация
└── images/                      # Общие изображения (диаграммы, скриншоты)
```

---

## Полезные ссылки

- [Репозиторий проекта](https://github.com/MaxTop60/citrix-mobile)
- [Документация](docs/)
- [API спецификация](docs/09-api/)
- [Руководство пользователя](docs/11-user-guide/)
```
