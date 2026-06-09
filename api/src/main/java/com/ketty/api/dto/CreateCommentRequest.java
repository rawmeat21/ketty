package com.ketty.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentRequest {

    private Long parentId;
    @NotBlank(message = "Comment content is required")
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String content;
}