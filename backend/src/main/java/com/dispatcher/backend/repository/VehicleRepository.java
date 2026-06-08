package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
  List<Vehicle> findByClient_ClientId(UUID clientId);
}