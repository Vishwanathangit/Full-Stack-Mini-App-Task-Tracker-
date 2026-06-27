package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.TaskRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.TaskResponse;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Project;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Task;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.User;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception.AccessDeniedException;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception.ResourceNotFoundException;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.ProjectRepository;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createTask_ShouldSaveTask_WhenProjectBelongsToUser() {
        // Arrange
        UUID projectId = UUID.randomUUID();
        String username = "testuser";

        TaskRequest request = new TaskRequest();
        request.setTitle("New Task");
        request.setProjectId(projectId);

        User user = new User();
        user.setUsername(username);

        Project project = new Project();
        project.setId(projectId);
        project.setName("Project 1");
        project.setUser(user);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        
        Task savedTask = Task.builder()
                .id(UUID.randomUUID())
                .title("New Task")
                .project(project)
                .build();
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act
        TaskResponse response = taskService.createTask(request, username);

        // Assert
        assertNotNull(response);
        assertEquals("New Task", response.getTitle());
        assertEquals(projectId, response.getProjectId());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_ShouldThrow_WhenProjectNotFound() {
        // Arrange
        UUID projectId = UUID.randomUUID();
        String username = "testuser";

        TaskRequest request = new TaskRequest();
        request.setProjectId(projectId);

        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> taskService.createTask(request, username));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void deleteTask_ShouldDelete_WhenTaskBelongsToUser() {
        // Arrange
        UUID taskId = UUID.randomUUID();
        String username = "testuser";

        User user = new User();
        user.setUsername(username);

        Project project = new Project();
        project.setUser(user);

        Task task = new Task();
        task.setId(taskId);
        task.setProject(project);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        // Act
        taskService.deleteTask(taskId, username);

        // Assert
        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    void getTaskById_ShouldThrow_WhenTaskNotFound() {
        // Arrange
        UUID taskId = UUID.randomUUID();
        String username = "testuser";

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(taskId, username));
    }
}
