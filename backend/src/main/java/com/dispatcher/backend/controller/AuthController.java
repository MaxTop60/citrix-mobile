package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.AuthResponse;
import com.dispatcher.backend.dto.LoginRequest;
import com.dispatcher.backend.dto.RegisterRequest;
import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.entity.Dispatcher;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.entity.FcmToken;
import com.dispatcher.backend.entity.User;
import com.dispatcher.backend.repository.ClientRepository;
import com.dispatcher.backend.repository.DispatcherRepository;
import com.dispatcher.backend.repository.DriverRepository;
import com.dispatcher.backend.repository.UserRepository;
import com.dispatcher.backend.repository.FcmTokenRepository;
import com.dispatcher.backend.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private JwtService jwtService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ClientRepository clientRepository;

  @Autowired
  private DispatcherRepository dispatcherRepository;

  @Autowired
  private DriverRepository driverRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private FcmTokenRepository fcmTokenRepository;

  // Получить текущего пользователя из JWT токена
  private User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  @PostMapping("/login")
  public Map<String, Object> login(@RequestBody LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    String token = jwtService.generateToken(user);

    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("email", user.getEmail());
    response.put("role", user.getRole());
    response.put("userId", user.getUserId());
    return response;
  }

  @PostMapping("/register")
  public Map<String, Object> register(@RequestBody RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("User already exists with email: " + request.getEmail());
    }

    String role = request.getRole() != null ? request.getRole() : "ROLE_DISPATCHER";

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(role);

    UUID profileId = null;
    Client client = null;

    // Если передан clientId, находим клиента
    if (request.getClientId() != null && !request.getClientId().isEmpty()) {
      client = clientRepository.findById(UUID.fromString(request.getClientId())).orElse(null);
    }

    switch (role) {
      case "ROLE_CLIENT":
        Client newClient = new Client();
        newClient.setName(request.getFullName() != null ? request.getFullName() : "Новый клиент");
        newClient.setInn("0000000000");
        newClient.setPhone(request.getPhone() != null ? request.getPhone() : "");
        newClient.setEmail(request.getEmail());
        newClient = clientRepository.save(newClient);
        profileId = newClient.getClientId();
        user.setClientId(profileId);
        break;

      case "ROLE_DISPATCHER":
        Dispatcher dispatcher = new Dispatcher();
        dispatcher.setFullName(request.getFullName() != null ? request.getFullName() : "Новый диспетчер");
        dispatcher.setEmail(request.getEmail());
        dispatcher.setPhone(request.getPhone() != null ? request.getPhone() : "");
        if (client != null) {
          dispatcher.setClient(client);
          // ВАЖНО: сохраняем client_id в таблицу users
          user.setClientId(client.getClientId());
        }
        dispatcher = dispatcherRepository.save(dispatcher);
        profileId = dispatcher.getDispatcherId();
        user.setDispatcherId(profileId);
        break;

      case "ROLE_DRIVER":
        Driver driver = new Driver();
        driver.setFullName(request.getFullName() != null ? request.getFullName() : "Новый водитель");
        driver.setPhone(request.getPhone() != null ? request.getPhone() : "");
        if (client != null) {
          driver.setClient(client);
          // ВАЖНО: сохраняем client_id в таблицу users
          user.setClientId(client.getClientId());
        }
        driver = driverRepository.save(driver);
        profileId = driver.getDriverId();
        user.setDriverId(profileId);
        break;

      default:
        throw new RuntimeException("Unknown role: " + role);
    }

    userRepository.save(user);

    String token = jwtService.generateToken(user);

    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("email", user.getEmail());
    response.put("role", user.getRole());
    response.put("userId", user.getUserId());
    response.put("profileId", profileId);

    return response;
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
    // Spring Security обработает logout автоматически,
    // если настроен logoutUrl
    return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
  }

  // Получить список клиентов (для выбора при регистрации диспетчера/водителя)
  @GetMapping("/clients")
  public List<Client> getAllClients() {
    return clientRepository.findAll();
  }

  @PostMapping("/fcm-token")
  public ResponseEntity<?> saveFcmToken(@RequestBody Map<String, String> request) {
    try {
      String token = request.get("token");
      String userIdStr = request.get("userId");

      // Проверяем обязательные поля
      if (userIdStr == null || token == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "userId and token are required"));
      }

      UUID userId;
      try {
        userId = UUID.fromString(userIdStr);
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Invalid userId format"));
      }

      // Находим пользователя
      User user = userRepository.findById(userId).orElse(null);
      if (user == null) {
        return ResponseEntity.status(404).body(Map.of(
            "error", "User not found"));
      }

      // Проверяем, что пользователь — водитель
      UUID driverId = user.getDriverId();
      if (driverId == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "User is not a driver. Only drivers can register FCM tokens."));
      }

      // Находим водителя
      Driver driver = driverRepository.findById(driverId).orElse(null);
      if (driver == null) {
        return ResponseEntity.status(404).body(Map.of(
            "error", "Driver not found for this user"));
      }

      // Сохраняем или обновляем токен
      Optional<FcmToken> existing = fcmTokenRepository.findByDriver_DriverId(driverId);
      if (existing.isPresent()) {
        FcmToken fcmToken = existing.get();
        fcmToken.setFcmToken(token);
        fcmToken.setLastUsedAt(LocalDateTime.now());
        fcmTokenRepository.save(fcmToken);
        System.out.println("✅ FCM token updated for driver: " + driverId);
      } else {
        FcmToken fcmToken = new FcmToken(driver, token);
        fcmTokenRepository.save(fcmToken);
        System.out.println("✅ New FCM token saved for driver: " + driverId);
      }

      return ResponseEntity.ok(Map.of(
          "message", "FCM token saved successfully",
          "driverId", driverId.toString()));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(500).body(Map.of(
          "error", "Internal server error: " + e.getMessage()));
    }
  }
}