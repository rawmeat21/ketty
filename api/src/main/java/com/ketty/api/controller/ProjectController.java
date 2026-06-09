package com.ketty.api.controller;

import com.ketty.api.dto.CreateProjectRequest;
import com.ketty.api.dto.ProjectResponse;
import com.ketty.api.dto.UpdateProjectRequest;
import com.ketty.api.entity.ProjectStatus;
import com.ketty.api.entity.User;
import com.ketty.api.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@AuthenticationPrincipal User currentUser,@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(201).body(projectService.createProject(currentUser.getUsername(), request));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<ProjectResponse>> getProjects(@PathVariable String username) {
        return ResponseEntity.ok(projectService.getProjects(username));
    }

    @GetMapping("/user/{username}/status/{status}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByStatus(@PathVariable String username,@PathVariable ProjectStatus status) {
        return ResponseEntity.ok(projectService.getProjectsByStatus(username, status));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@AuthenticationPrincipal User currentUser,@PathVariable Long projectId,@Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(currentUser.getUsername(), projectId, request));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@AuthenticationPrincipal User currentUser,@PathVariable Long projectId) {
        projectService.deleteProject(currentUser.getUsername(), projectId);
        return ResponseEntity.noContent().build();
    }
}