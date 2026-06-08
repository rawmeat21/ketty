package com.ketty.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HobbyEntryResponse {

    private Long id;
    private String externalId;
    private String title;
    private String coverImageUrl;
    private String note;
    private int displayOrder;
}

