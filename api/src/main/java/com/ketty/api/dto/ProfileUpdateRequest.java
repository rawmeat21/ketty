package com.ketty.api.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProfileUpdateRequest {
    @Size(max = 50, message = "Display name cannot exceed 50 characters")
    private String displayName;

    @Size(max = 300, message = "Bio cannot exceed 300 characters")
    private String bio;

    @Size(max = 100, message = "Status cannot exceed 100 characters")
    private String status;

    private String avatarUrl;
    private List<ProfileLinkDTO> links;
}