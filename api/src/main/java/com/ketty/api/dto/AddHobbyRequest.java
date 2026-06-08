package com.ketty.api.dto;

import com.ketty.api.entity.HobbyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddHobbyRequest {

    @NotNull(message = "Hobby type is required")
    private HobbyType type;
    private String name;
}