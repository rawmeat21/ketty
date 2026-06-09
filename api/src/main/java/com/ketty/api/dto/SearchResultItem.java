package com.ketty.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultItem {

    private String externalId;
    private String title;
    private String coverImageUrl;
    private String extraInfo;
}