package com.ketty.api.dto;

import com.ketty.api.entity.ProjectStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateProjectRequest {

    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    private ProjectStatus status;

    private String projectUrl;
    private String imageUrl;
    private List<String> tools;
}