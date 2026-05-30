package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.Command;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CommandRepository extends JpaRepository<Command, UUID> {
  List<Command> findByEvent_EventId(UUID eventId);

  List<Command> findByStatus(String status);
}