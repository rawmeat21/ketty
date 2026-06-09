package com.ketty.api.service;

import com.ketty.api.dto.CreateProjectRequest;
import com.ketty.api.dto.ProjectResponse;
import com.ketty.api.dto.UpdateProjectRequest;
import com.ketty.api.entity.Project;
import com.ketty.api.entity.ProjectStatus;
import com.ketty.api.entity.ProjectTool;
import com.ketty.api.entity.User;
import com.ketty.api.repository.ProjectRepository;
import com.ketty.api.repository.ProjectToolRepository;
import com.ketty.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectToolRepository projectToolRepository;

    @Transactional
    public ProjectResponse createProject(String username, CreateProjectRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Project project = Project.builder()
            .user(user)
            .title(request.getTitle())
            .description(request.getDescription())
            .status(request.getStatus())
            .projectUrl(request.getProjectUrl())
            .imageUrl(request.getImageUrl())
            .build();

        projectRepository.save(project);
        saveTools(project, request.getTools());

        return mapToProjectResponse(project);
    }

    public List<ProjectResponse> getProjects(String username) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return projectRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::mapToProjectResponse).collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByStatus(String username, ProjectStatus status) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return projectRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status).stream().map(this::mapToProjectResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse updateProject(String username, Long projectId, UpdateProjectRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Project project = projectRepository.findByUserAndId(user, projectId).orElseThrow(() -> new RuntimeException("Project not found"));

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getProjectUrl() != null) {
            project.setProjectUrl(request.getProjectUrl());
        }
        if (request.getImageUrl() != null) {
            project.setImageUrl(request.getImageUrl());
        }

        if (request.getTools() != null) {
            projectToolRepository.deleteByProject(project);
            saveTools(project, request.getTools());
        }

        projectRepository.save(project);

        return mapToProjectResponse(project);
    }

    @Transactional
    public void deleteProject(String username, Long projectId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Project project = projectRepository.findByUserAndId(user, projectId).orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }

    private void saveTools(Project project, List<String> toolNames) {

        if (toolNames == null || toolNames.isEmpty()) {
            return;
        }

        List<ProjectTool> tools = toolNames.stream().filter(name -> name != null && !name.isBlank()).map(name -> ProjectTool.builder().project(project).name(name.trim()).build()).collect(Collectors.toList());

        projectToolRepository.saveAll(tools);
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        List<String> toolNames = projectToolRepository.findByProject(project).stream().map(ProjectTool::getName).collect(Collectors.toList());

        return ProjectResponse.builder()
            .id(project.getId())
            .title(project.getTitle())
            .description(project.getDescription())
            .status(project.getStatus())
            .projectUrl(project.getProjectUrl())
            .imageUrl(project.getImageUrl())
            .tools(toolNames)
            .createdAt(project.getCreatedAt())
            .updatedAt(project.getUpdatedAt())
            .build();
    }
}