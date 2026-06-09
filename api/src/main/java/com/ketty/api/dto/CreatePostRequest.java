package com.ketty.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePostRequest {

    private Long hobbyId;
    @NotBlank(message = "Post content is required")
    @Size(max = 2000, message = "Post content cannot exceed 2000 characters")
    private String content;
    private String imageUrl;
}