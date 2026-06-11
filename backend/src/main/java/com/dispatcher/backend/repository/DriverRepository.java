package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {
  List<Driver> findByClient_ClientId(UUID clientId);

  List<Driver> findByIsActive(Boolean isActive);

  Optional<Driver> findByVehicle_VehicleId(UUID vehicleId);

  Optional<Driver> findByPhone(String phone);

  Optional<Driver> findByTelegramId(String telegramId);

}