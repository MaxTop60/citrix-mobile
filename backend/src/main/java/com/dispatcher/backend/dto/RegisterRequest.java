package com.dispatcher.backend.dto;

public class RegisterRequest {
  private String email;
  private String password;
  private String role;
  private String phone;
  private String fullName;
  private String clientId;

  // Конструкторы
  public RegisterRequest() {
  }

  public RegisterRequest(String email, String password, String role, String phone, String fullName, String clientId) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone;
    this.fullName = fullName;
    this.clientId = clientId;
  }

  // Геттеры и сеттеры
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getClientId() {
    return clientId;
  }

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }
}