package com.neuranx.Full_Stack.Mini.App.Task.Tracker.controller;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.service.TaskService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
}
