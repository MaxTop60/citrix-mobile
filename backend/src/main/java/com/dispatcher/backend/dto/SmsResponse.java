package com.dispatcher.backend.dto;

public class SmsResponse {
  private String status;
  private String statusCode;
  private String messageId;

  public SmsResponse() {
  }

  public SmsResponse(String status, String statusCode, String messageId) {
    this.status = status;
    this.statusCode = statusCode;
    this.messageId = messageId;
  }

  // Геттеры и сеттеры
  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(String statusCode) {
    this.statusCode = statusCode;
  }

  public String getMessageId() {
    return messageId;
  }

  public void setMessageId(String messageId) {
    this.messageId = messageId;
  }
}