package com.ketty.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddHobbyEntryRequest {

    private String externalId;
    
    @NotBlank(message = "Title is required")
    private String title;

    private String coverImageUrl;
    @Size(max = 500, message = "Note cannot exceed 500 characters")
    private String note;
}