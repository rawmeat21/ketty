package com.ketty.api.dto;

import com.ketty.api.entity.HobbyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HobbyResponse {

    private Long id;
    private HobbyType type;
    private String name;
    private String slug;
    private int displayOrder;
    private List<HobbyEntryResponse> entries;
}

