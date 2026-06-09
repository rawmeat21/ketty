package com.ketty.api.service.search;
// We put all search services in a sub-package to keep them organised.
// This way they don't clutter the main service package.

import com.ketty.api.dto.SearchResultItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RawgSearchService {

    @Value("${api.rawg.key}")
    private String apiKey;
    private final WebClient webClient = WebClient.create("https://api.rawg.io/api");

    public List<SearchResultItem> search(String query) {

        Map response = webClient.get()
            .uri(uriBuilder -> uriBuilder.path("/games").queryParam("key", apiKey).queryParam("search", query).queryParam("page_size", 10).build()).retrieve().bodyToMono(Map.class).block();

        if (response == null || !response.containsKey("results")) {
            return Collections.emptyList();
        }

        List<Map> results = (List<Map>) response.get("results");

        return results.stream().map(game -> {
                String released = (String) game.get("released");
                String year = (released != null && released.length() >= 4)? released.substring(0, 4): "Unknown";
                return SearchResultItem.builder().externalId(String.valueOf(game.get("id"))).title((String) game.get("name")).coverImageUrl((String) game.get("background_image")).extraInfo(year).build();
            }).collect(Collectors.toList());
    }
}