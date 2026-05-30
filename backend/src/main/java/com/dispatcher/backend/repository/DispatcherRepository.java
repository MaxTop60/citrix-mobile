package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.Dispatcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DispatcherRepository extends JpaRepository<Dispatcher, UUID> {
  List<Dispatcher> findByClient_ClientId(UUID clientId);

  List<Dispatcher> findByIsActive(Boolean isActive);

  Optional<Dispatcher> findByEmail(String email);

  Optional<Dispatcher> findByPushToken(String pushToken);
}