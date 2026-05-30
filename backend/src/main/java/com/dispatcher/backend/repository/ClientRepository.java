package com.dispatcher.backend.repository;

import com.dispatcher.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
  Optional<Client> findByInn(String inn);

  Optional<Client> findByEmail(String email);

  boolean existsByInn(String inn);

  boolean existsByEmail(String email);
}