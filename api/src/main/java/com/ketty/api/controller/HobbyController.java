package com.ketty.api.controller;

import com.ketty.api.dto.AddHobbyEntryRequest;
import com.ketty.api.dto.AddHobbyRequest;
import com.ketty.api.dto.HobbyEntryResponse;
import com.ketty.api.dto.HobbyResponse;
import com.ketty.api.entity.User;
import com.ketty.api.service.HobbyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hobbies")
@RequiredArgsConstructor
public class HobbyController {

    private final HobbyService hobbyService;

    @PostMapping
    public ResponseEntity<HobbyResponse> addHobby(@AuthenticationPrincipal User currentUser,@Valid @RequestBody AddHobbyRequest request) {
        return ResponseEntity.status(201).body(hobbyService.addHobby(currentUser.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<HobbyResponse>> getMyHobbies(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(hobbyService.getHobbies(currentUser.getUsername()));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<HobbyResponse>> getHobbiesByUsername(@PathVariable String username) {
        return ResponseEntity.ok(hobbyService.getHobbies(username));
    }

    @DeleteMapping("/{hobbyId}")
    public ResponseEntity<Void> deleteHobby(@AuthenticationPrincipal User currentUser,@PathVariable Long hobbyId) {
        hobbyService.deleteHobby(currentUser.getUsername(), hobbyId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{hobbyId}/entries")
    public ResponseEntity<HobbyEntryResponse> addEntry(@AuthenticationPrincipal User currentUser,@PathVariable Long hobbyId,@Valid @RequestBody AddHobbyEntryRequest request) {
        return ResponseEntity.status(201).body(
            hobbyService.addEntry(currentUser.getUsername(), hobbyId, request)
        );
    }

    @PutMapping("/{hobbyId}/entries/{entryId}")
    public ResponseEntity<HobbyEntryResponse> updateEntry(@AuthenticationPrincipal User currentUser,@PathVariable Long hobbyId,@PathVariable Long entryId,@Valid @RequestBody AddHobbyEntryRequest request) {
        return ResponseEntity.ok(hobbyService.updateEntry(currentUser.getUsername(), hobbyId, entryId, request));
    }

    @DeleteMapping("/{hobbyId}/entries/{entryId}")
    public ResponseEntity<Void> deleteEntry(@AuthenticationPrincipal User currentUser,@PathVariable Long hobbyId,@PathVariable Long entryId) {
        hobbyService.deleteEntry(currentUser.getUsername(), hobbyId, entryId);
        return ResponseEntity.noContent().build();
    }
}