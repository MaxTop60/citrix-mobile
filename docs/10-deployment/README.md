# Развёртывание и инструкции

## 1. Системные требования

| Компонент | Минимальная версия | Рекомендуемая версия |
|-----------|-------------------|----------------------|
| **Java JDK** | 17 | 21+ |
| **Node.js** | 18.x | 20.x |
| **PostgreSQL** | 14 | 15+ |
| **Android Studio** | 2024.1 | Последняя |
| **Maven** | 3.8 | 3.9+ |
| **Git** | 2.30 | Последняя |

---

## 2. Установка и запуск бэкенда

### 2.1. Клонирование репозитория

```bash
git clone https://github.com/MaxTop60/citrix-mobile.git
cd citrix-mobile/backend
```

### 2.2. Настройка базы данных PostgreSQL

1. Установите PostgreSQL (если не установлен)

2. Создайте базу данных:

```sql
CREATE DATABASE dispatcher_db;
```

3. Настройте подключение в `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dispatcher_db
spring.datasource.username=postgres
spring.datasource.password=ваш_пароль
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 2.3. Настройка Firebase (для push-уведомлений)

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)

2. Скачайте `firebase-service-account.json`

3. Поместите файл в `src/main/resources/`

### 2.4. Настройка JWT

В `application.properties` добавьте:

```properties
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

### 2.5. Запуск бэкенда

```bash
# Через Maven
./mvnw spring-boot:run

# Или через JAR
./mvnw clean package
java -jar target/backend-1.0.0.jar
```

**Сервер запустится на:** `http://localhost:8080`

**Swagger UI:** `http://localhost:8080/swagger-ui.html`

---

## 3. Установка и запуск мобильного приложения

### 3.1. Установка зависимостей

```bash
cd ../mobile
npm install
```

### 3.2. Настройка API URL

Отредактируйте `src/shared/api/client.ts`:

```typescript
// Для эмулятора Android
const API_URL = 'http://10.0.2.2:8080/api';

// Для реального телефона по USB (с adb reverse)
const API_URL = 'http://10.0.2.2:8080/api';

// Для реального телефона по Wi-Fi (IP компьютера)
const API_URL = 'http://192.168.1.100:8080/api';
```

### 3.3. Настройка Firebase для мобильного приложения

1. В Firebase Console добавьте Android приложение
2. Укажите package name: `com.dispatcher.mobile`
3. Скачайте `google-services.json`
4. Поместите файл в `android/app/`

### 3.4. Запуск на эмуляторе

```bash
# Запустить эмулятор в Android Studio
# Затем выполнить:
npx react-native run-android
```

### 3.5. Запуск на реальном телефоне (USB)

1. Включите отладку по USB на телефоне
2. Подключите телефон к компьютеру
3. Выполните:

```bash
# Проверить подключение
adb devices

# Пробросить порт
adb reverse tcp:8080 tcp:8080

# Запустить приложение
npx react-native run-android
```

### 3.6. Запуск Metro отдельно

```bash
npx react-native start --reset-cache
```

---

## 4. Инструкция по настройке ADB reverse (для USB подключения)

### 4.1. Включение отладки на телефоне

1. `Настройки` → `О телефоне` → нажать `Номер сборки` 7 раз
2. `Настройки` → `Для разработчиков` → включить `Отладка по USB`

### 4.2. Проверка подключения

```bash
adb devices
```

Должно показать:
```
List of devices attached
XXXXXXXX    device
```

### 4.3. Проброс порта

```bash
adb reverse tcp:8080 tcp:8080
```

### 4.4. Проверка проброса

```bash
adb reverse --list
```

Должно показать: `tcp:8080 tcp:8080`

---

## 5. Установка через APK (без разработки)

### 5.1. Сборка APK

```bash
cd android
./gradlew assembleRelease
```

APK будет в: `android/app/build/outputs/apk/release/app-release.apk`

### 5.2. Установка на телефон

```bash
adb install app-release.apk
```

Или скопируйте APK на телефон и установите вручную.

---

## 6. Проверка работоспособности

### 6.1. Проверка бэкенда

```bash
curl http://localhost:8080/api/health
```

Ожидаемый ответ: `"Сервер работает!"`

### 6.2. Проверка подключения с телефона

1. Откройте браузер на телефоне
2. Перейдите по адресу: `http://10.0.2.2:8080/api/health` (или IP компьютера)
3. Должен быть ответ `"Сервер работает!"`

### 6.3. Регистрация тестового пользователя

**POST** `http://localhost:8080/api/auth/register`

```json
{
    "email": "test@example.com",
    "password": "123456",
    "role": "ROLE_DISPATCHER",
    "fullName": "Тестовый Диспетчер",
    "phone": "+79991234567"
}
```

---

## 7. Устранение неполадок

### 7.1. Порт 8080 занят

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

### 7.2. adb reverse не работает

- Убедитесь, что телефон подключён по USB (не по Wi-Fi)
- Перезапустите adb: `adb kill-server && adb start-server`
- Подтвердите отладку на телефоне

### 7.3. Ошибка подключения к БД

- Проверьте, запущен ли PostgreSQL
- Проверьте логин и пароль в `application.properties`
- Создайте базу данных вручную: `CREATE DATABASE dispatcher_db;`

### 7.4. Ошибка сборки React Native

```bash
# Очистить кэш
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npx react-native run-android
```

### 7.5. Firebase не инициализирован

- Убедитесь, что `firebase-service-account.json` в `src/main/resources/`
- Проверьте логи: должна быть строка `✅ Firebase успешно инициализирован`

---

## 8. Переменные окружения (опционально)

### Для бэкенда

```bash
export DB_URL=jdbc:postgresql://localhost:5432/dispatcher_db
export DB_USERNAME=postgres
export DB_PASSWORD=password
export JWT_SECRET=your_secret_key
```

### Для мобильного приложения

Создайте файл `.env` в корне `mobile/`:

```
API_URL=http://192.168.1.100:8080/api
```
