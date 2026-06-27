package com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.TaskPriority;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private TaskStatus status = TaskStatus.TODO;
    
    private TaskPriority priority = TaskPriority.MEDIUM;
    
    private LocalDateTime dueDate;
    
    @NotNull(message = "Project ID is required")
    private UUID projectId;
}
