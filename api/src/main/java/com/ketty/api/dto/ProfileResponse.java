package com.ketty.api.dto;

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
public class ProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String status;
    private String avatarUrl;
    private List<ProfileLinkDTO> links;
    private LocalDateTime createdAt;
}