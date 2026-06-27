package com.neuranx.Full_Stack.Mini.App.Task.Tracker.controller;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.service.ProjectService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
}
