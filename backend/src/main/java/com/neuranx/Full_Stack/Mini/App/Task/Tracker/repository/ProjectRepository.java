package com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
