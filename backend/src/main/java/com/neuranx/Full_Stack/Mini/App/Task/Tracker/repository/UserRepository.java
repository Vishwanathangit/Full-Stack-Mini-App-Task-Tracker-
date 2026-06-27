package com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
}
