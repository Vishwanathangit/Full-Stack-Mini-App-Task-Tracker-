package com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.TaskPriority;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID projectId;
    private String projectName;
}
