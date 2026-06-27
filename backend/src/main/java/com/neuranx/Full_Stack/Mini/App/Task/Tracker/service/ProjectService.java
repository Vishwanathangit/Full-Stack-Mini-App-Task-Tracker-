package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.ProjectRepository;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Project logic here
}
