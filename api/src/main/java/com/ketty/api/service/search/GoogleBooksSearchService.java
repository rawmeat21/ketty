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
public class GoogleBooksSearchService {

    @Value("${api.googlebooks.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://www.googleapis.com/books/v1");

    public List<SearchResultItem> search(String query) {

        Map response = webClient.get().uri(uriBuilder -> uriBuilder.path("/volumes").queryParam("q", query).queryParam("key", apiKey).queryParam("maxResults", 10).build()).retrieve().bodyToMono(Map.class).block();

        if (response == null || !response.containsKey("items")) {
            return Collections.emptyList();
        }

        List<Map> items = (List<Map>) response.get("items");

        return items.stream().map(item -> {
            String id = (String) item.get("id");
            Map volumeInfo = (Map) item.get("volumeInfo");

            String title = (String) volumeInfo.get("title");

            List<String> authors = (List<String>) volumeInfo.get("authors");
            String authorInfo = (authors != null && !authors.isEmpty()) ? authors.get(0): "Unknown author";

            String coverImageUrl = null;

            Map imageLinks = (Map) volumeInfo.get("imageLinks");
            if (imageLinks != null) {
                coverImageUrl = (String) imageLinks.get("thumbnail");
            }

            return SearchResultItem.builder().externalId(id).title(title).coverImageUrl(coverImageUrl).extraInfo(authorInfo).build();
            
        }).collect(Collectors.toList());
    }
}