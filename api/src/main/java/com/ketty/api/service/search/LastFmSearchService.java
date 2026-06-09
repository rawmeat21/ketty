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
public class LastFmSearchService {

    @Value("${api.lastfm.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://ws.audioscrobbler.com/2.0");

    public List<SearchResultItem> search(String query) {

        Map response = webClient.get().uri(uriBuilder -> uriBuilder.queryParam("method", "track.search").queryParam("track", query).queryParam("api_key", apiKey).queryParam("format", "json").queryParam("limit", 10).build()).retrieve().bodyToMono(Map.class).block();

        if (response == null) {
            return Collections.emptyList();
        }

        try 
        {

            Map results = (Map) response.get("results");
            Map trackMatches = (Map) results.get("trackmatches");
            List<Map> tracks = (List<Map>) trackMatches.get("track");

            if (tracks == null) {
                return Collections.emptyList();
            }

            return tracks.stream().map(track -> {
                String coverImageUrl = extractLastFmImage(track);
                return SearchResultItem.builder().externalId((String) track.get("mbid")).title((String) track.get("name")).coverImageUrl(coverImageUrl).extraInfo((String) track.get("artist")).build();}).filter(item -> item.getExternalId() != null && !item.getExternalId().isBlank()).collect(Collectors.toList());
        } 
        catch (Exception e) 
        {
            return Collections.emptyList();
        }
    }

    private String extractLastFmImage(Map track) {

        List<Map> images = (List<Map>) track.get("image");
        if (images == null || images.isEmpty()) {
            return null;
        }
        for (int i = images.size() - 1; i >= 0; i--) {
            String url = (String) images.get(i).get("#text");
            if (url != null && !url.isBlank()) {
                return url;
            }
        }
        return null;
    }
}