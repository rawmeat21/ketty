package com.ketty.api.service.search;

import com.ketty.api.dto.SearchResultItem;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JikanSearchService {

    private final WebClient webClient = WebClient.create("https://api.jikan.moe/v4");

    public List<SearchResultItem> search(String query) {

        Map response = webClient.get().uri(uriBuilder -> uriBuilder.path("/anime").queryParam("q", query).queryParam("limit", 10).build()).retrieve().bodyToMono(Map.class).block();

        if (response == null || !response.containsKey("data")) {
            return Collections.emptyList();
        }

        List<Map> data = (List<Map>) response.get("data");

        return data.stream().map(anime -> {
            Map images = (Map) anime.get("images");
            String coverImageUrl = null;
            if (images != null) {
                Map jpg = (Map) images.get("jpg");
                if (jpg != null) {
                    coverImageUrl = (String) jpg.get("image_url");
                }
            }

            Object episodes = anime.get("episodes");
            String episodeInfo = (episodes != null) ? episodes + " episodes" : "Unknown episodes";

            return SearchResultItem.builder().externalId(String.valueOf(anime.get("mal_id"))).title((String) anime.get("title")).coverImageUrl(coverImageUrl).extraInfo(episodeInfo).build();
        }).collect(Collectors.toList());
    }
}