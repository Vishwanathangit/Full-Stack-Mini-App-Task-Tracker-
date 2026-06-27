package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.PagedResponse;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.TaskRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.TaskResponse;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Project;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Task;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.TaskPriority;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.TaskStatus;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception.AccessDeniedException;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception.ResourceNotFoundException;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.ProjectRepository;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.TaskRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public TaskResponse createTask(TaskRequest request, String username) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
                
        if (!project.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not own this project");
        }
        
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .project(project)
                .build();
                
        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    public PagedResponse<TaskResponse> getTasks(String username, TaskStatus status, TaskPriority priority, 
                                                String sortBy, String sortDir, int page, int size) {
                                                
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy != null ? sortBy : "createdAt"));
        
        Specification<Task> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Only tasks from projects owned by current user
            predicates.add(cb.equal(root.join("project").join("user").get("username"), username));
            
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        Page<Task> taskPage = taskRepository.findAll(spec, pageable);
        
        List<TaskResponse> content = taskPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PagedResponse<>(content, taskPage.getNumber(), taskPage.getSize(), 
                taskPage.getTotalElements(), taskPage.getTotalPages());
    }

    public TaskResponse getTaskById(UUID id, String username) {
        Task task = getTaskAndVerifyOwnership(id, username);
        return mapToResponse(task);
    }

    public TaskResponse updateTask(UUID id, TaskRequest request, String username) {
        Task task = getTaskAndVerifyOwnership(id, username);
        
        // Also verify the new project if they are trying to change it
        if (!task.getProject().getId().equals(request.getProjectId())) {
            Project newProject = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("New Project not found"));
            if (!newProject.getUser().getUsername().equals(username)) {
                throw new AccessDeniedException("You do not own the target project");
            }
            task.setProject(newProject);
        }
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        
        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    public void deleteTask(UUID id, String username) {
        Task task = getTaskAndVerifyOwnership(id, username);
        taskRepository.delete(task);
    }
    
    private Task getTaskAndVerifyOwnership(UUID id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        if (!task.getProject().getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not have permission to access this task");
        }
        return task;
    }
    
    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .build();
    }
}
