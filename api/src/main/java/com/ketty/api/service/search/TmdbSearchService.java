package com.ketty.api.service.search;

import com.ketty.api.dto.SearchResultItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TmdbSearchService {

    @Value("${api.tmdb.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://api.themoviedb.org/3");

    public List<SearchResultItem> searchMovies(String query) {
        return search(query, "/search/movie", "release_date", "title");
    }

    public List<SearchResultItem> searchTv(String query) {
        return search(query, "/search/tv", "first_air_date", "name");
    }

    private List<SearchResultItem> search(
        String query,
        String path,
        String dateField,
        String titleField
    ) {
        Map response = webClient.get().uri(uriBuilder -> uriBuilder
                .path(path)
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("page", 1)
                .build()
            ).retrieve().bodyToMono(Map.class).block();

        if (response == null || !response.containsKey("results")) {
            return Collections.emptyList();
        }

        List<Map> results = (List<Map>) response.get("results");

        return results.stream().limit(10).map(item -> {
                String date = (String) item.get(dateField);
                String year = (date != null && date.length() >= 4) ? date.substring(0, 4) : "Unknown";

                String posterPath = (String) item.get("poster_path");
                String coverImageUrl = (posterPath != null) ? "https://image.tmdb.org/t/p/w500" + posterPath : null;
                return SearchResultItem.builder().externalId(String.valueOf(item.get("id"))).title((String) item.get(titleField)).coverImageUrl(coverImageUrl).extraInfo(year).build();
        }).collect(Collectors.toList());
    }
}