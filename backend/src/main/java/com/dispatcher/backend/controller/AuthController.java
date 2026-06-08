package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.AuthResponse;
import com.dispatcher.backend.dto.LoginRequest;
import com.dispatcher.backend.dto.RegisterRequest;
import com.dispatcher.backend.entity.Client;
import com.dispatcher.backend.entity.Dispatcher;
import com.dispatcher.backend.entity.Driver;
import com.dispatcher.backend.entity.User;
import com.dispatcher.backend.repository.ClientRepository;
import com.dispatcher.backend.repository.DispatcherRepository;
import com.dispatcher.backend.repository.DriverRepository;
import com.dispatcher.backend.repository.UserRepository;
import com.dispatcher.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import java.util.HashMap;
import java.util.Map;

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

  @PostMapping("/login")
  public AuthResponse login(@RequestBody LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    String token = jwtService.generateToken(user);
    return new AuthResponse(token, user.getEmail(), user.getRole());
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

    // В зависимости от роли создаём запись в профильной таблице
    switch (role) {
      case "ROLE_CLIENT":
        Client client = new Client();
        client.setName(request.getFullName() != null ? request.getFullName() : "Новый клиент");
        client.setInn("0000000000");
        client.setPhone(request.getPhone() != null ? request.getPhone() : "");
        client.setEmail(request.getEmail());
        client = clientRepository.save(client);
        profileId = client.getClientId();
        user.setClientId(profileId);
        break;

      case "ROLE_DISPATCHER":
        Dispatcher dispatcher = new Dispatcher();
        dispatcher.setFullName(request.getFullName() != null ? request.getFullName() : "Новый диспетчер");
        dispatcher.setEmail(request.getEmail());
        dispatcher.setPhone(request.getPhone() != null ? request.getPhone() : "");
        dispatcher = dispatcherRepository.save(dispatcher);
        profileId = dispatcher.getDispatcherId();
        user.setDispatcherId(profileId);
        break;

      case "ROLE_DRIVER":
        Driver driver = new Driver();
        driver.setFullName(request.getFullName() != null ? request.getFullName() : "Новый водитель");
        driver.setPhone(request.getPhone() != null ? request.getPhone() : "");
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
    response.put("profileId", profileId);

    return response;
  }
}