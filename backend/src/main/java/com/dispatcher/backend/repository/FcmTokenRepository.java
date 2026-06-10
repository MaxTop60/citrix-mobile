package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.FcmToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface FcmTokenRepository extends JpaRepository<FcmToken, UUID> {
  Optional<FcmToken> findByDriver_DriverId(UUID driverId);

  Optional<FcmToken> findByFcmToken(String fcmToken);
}