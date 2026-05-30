package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
  List<Event> findByVehicle_VehicleId(UUID vehicleId);

  List<Event> findByStatus(String status);

  List<Event> findByPriority(String priority);
}