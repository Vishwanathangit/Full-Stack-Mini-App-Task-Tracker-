package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.ProjectRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.ProjectResponse;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Project;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.User;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception.AccessDeniedException;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception.ResourceNotFoundException;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.ProjectRepository;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ProjectResponse createProject(ProjectRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(user)
                .build();
                
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    public List<ProjectResponse> getMyProjects(String username) {
        return projectRepository.findByUserUsername(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(UUID id, String username) {
        Project project = getProjectAndVerifyOwnership(id, username);
        return mapToResponse(project);
    }

    public ProjectResponse updateProject(UUID id, ProjectRequest request, String username) {
        Project project = getProjectAndVerifyOwnership(id, username);
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    public void deleteProject(UUID id, String username) {
        Project project = getProjectAndVerifyOwnership(id, username);
        projectRepository.delete(project);
    }
    
    private Project getProjectAndVerifyOwnership(UUID id, String username) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        if (!project.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not have permission to access this project");
        }
        return project;
    }
    
    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
