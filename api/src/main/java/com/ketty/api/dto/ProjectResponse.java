package com.ketty.api.dto;

import com.ketty.api.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private ProjectStatus status;
    private String projectUrl;
    private String imageUrl;
    private List<String> tools;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}