package com.dispatcher.backend.gateway;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class SmsRuGateway {

  private final WebClient webClient;
  private final ObjectMapper objectMapper;

  @Value("${sms.ru.api.url}")
  private String apiUrl;

  @Value("${sms.ru.api.id}")
  private String apiId;

  // @Value("${sms.ru.from}")
  // private String from;

  public SmsRuGateway() {
    this.webClient = WebClient.builder().build();
    this.objectMapper = new ObjectMapper();
  }

  /**
   * Отправка SMS через SMS.ru
   * 
   * @param phone   номер телефона получателя (в формате 79991234567 или
   *                +79991234567)
   * @param message текст сообщения (до 1000 символов)
   * @return true если отправка успешна, false в противном случае
   */
  public boolean sendSms(String phone, String message) {
    try {
      // Очищаем номер телефона (убираем +, пробелы, скобки)
      String cleanPhone = phone.replaceAll("[^0-9]", "");
      if (cleanPhone.startsWith("8") && cleanPhone.length() == 11) {
        cleanPhone = "7" + cleanPhone.substring(1);
      }
      if (!cleanPhone.startsWith("7") && !cleanPhone.startsWith("8")) {
        cleanPhone = "7" + cleanPhone;
      }

      // Кодируем сообщение для URL
      String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8.toString());

      // Формируем URL для запроса
      String url = String.format("%s?api_id=%s&to=%s&msg=%s&json=1",
          apiUrl, apiId, cleanPhone, encodedMessage);

      // if (from != null && !from.isEmpty()) {
      // url += "&from=" + URLEncoder.encode(from, StandardCharsets.UTF_8.toString());
      // }

      System.out.println("=== SMS.RU REQUEST ===");
      System.out.println("URL: " + url.replace(apiId, "***HIDDEN***"));

      // Выполняем запрос
      String response = webClient.get()
          .uri(url)
          .retrieve()
          .bodyToMono(String.class)
          .block();

      System.out.println("SMS.RU Response: " + response);

      // Парсим ответ
      JsonNode json = objectMapper.readTree(response);
      String statusCode = json.get("status_code").asText();

      // status_code = 100 - успешная отправка
      // status_code = 200 - сообщение в очереди на отправку (тоже успех)
      if ("100".equals(statusCode) || "200".equals(statusCode)) {
        System.out.println("SMS sent successfully to " + cleanPhone);
        return true;
      } else {
        String statusText = json.has("status_text") ? json.get("status_text").asText() : "Unknown error";
        System.err.println("SMS failed: " + statusCode + " - " + statusText);
        return false;
      }

    } catch (Exception e) {
      System.err.println("SMS sending error: " + e.getMessage());
      e.printStackTrace();
      return false;
    }
  }

  /**
   * Проверка баланса на аккаунте SMS.ru
   * 
   * @return баланс в рублях или -1 при ошибке
   */
  public double getBalance() {
    try {
      String url = String.format("https://sms.ru/my/balance?api_id=%s&json=1", apiId);
      String response = webClient.get()
          .uri(url)
          .retrieve()
          .bodyToMono(String.class)
          .block();

      JsonNode json = objectMapper.readTree(response);
      if ("100".equals(json.get("status_code").asText())) {
        return json.get("balance").asDouble();
      }
      return -1;
    } catch (Exception e) {
      e.printStackTrace();
      return -1;
    }
  }

  /**
   * Проверка валидности номера телефона
   */
  public boolean isValidPhone(String phone) {
    if (phone == null || phone.isEmpty())
      return false;
    String clean = phone.replaceAll("[^0-9]", "");
    return clean.length() >= 10 && clean.length() <= 12;
  }
}