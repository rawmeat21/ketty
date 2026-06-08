package com.ketty.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileLinkDTO {

    private Long id;

    @NotBlank(message = "Link label is required")
    private String label;

    @NotBlank(message = "Link URL is required")
    private String url;
}