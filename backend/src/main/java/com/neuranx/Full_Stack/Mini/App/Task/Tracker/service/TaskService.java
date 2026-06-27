package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Task logic here
}
