package com.dispatcher.backend.controller;

import com.dispatcher.backend.dto.AuthResponse;
import com.dispatcher.backend.dto.LoginRequest;
import com.dispatcher.backend.dto.RegisterRequest;
import com.dispatcher.backend.entity.User;
import com.dispatcher.backend.repository.UserRepository;
import com.dispatcher.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private UserDetailsService userDetailsService;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/login")
  public AuthResponse login(@RequestBody LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
    String token = jwtService.generateToken(userDetails);

    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    String role = user != null ? user.getRole() : "ROLE_USER";

    return new AuthResponse(token, request.getEmail(), role);
  }

  @PostMapping("/register")
  public AuthResponse register(@RequestBody RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("User already exists with email: " + request.getEmail());
    }

    String role = request.getRole() != null ? request.getRole() : "ROLE_USER";

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(role);

    userRepository.save(user);

    UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
    String token = jwtService.generateToken(userDetails);

    return new AuthResponse(token, request.getEmail(), role);
  }
}