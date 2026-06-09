package com.ketty.api.controller;

import com.ketty.api.dto.SearchResultItem;
import com.ketty.api.service.search.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final RawgSearchService rawgSearchService;
    private final LastFmSearchService lastFmSearchService;
    private final GoogleBooksSearchService googleBooksSearchService;
    private final TmdbSearchService tmdbSearchService;
    private final JikanSearchService jikanSearchService;

    @GetMapping("/games")
    public ResponseEntity<List<SearchResultItem>> searchGames(@RequestParam String q) {
        return ResponseEntity.ok(rawgSearchService.search(q));
    }

    @GetMapping("/music")
    public ResponseEntity<List<SearchResultItem>> searchMusic(@RequestParam String q) {
        return ResponseEntity.ok(lastFmSearchService.search(q));
    }

    @GetMapping("/books")
    public ResponseEntity<List<SearchResultItem>> searchBooks(@RequestParam String q) {
        return ResponseEntity.ok(googleBooksSearchService.search(q));
    }

    @GetMapping("/movies")
    public ResponseEntity<List<SearchResultItem>> searchMovies(@RequestParam String q) {
        return ResponseEntity.ok(tmdbSearchService.searchMovies(q));
    }

    @GetMapping("/tv")
    public ResponseEntity<List<SearchResultItem>> searchTv(@RequestParam String q) {
        return ResponseEntity.ok(tmdbSearchService.searchTv(q));
    }

    @GetMapping("/anime")
    public ResponseEntity<List<SearchResultItem>> searchAnime(@RequestParam String q) {
        return ResponseEntity.ok(jikanSearchService.search(q));
    }
}