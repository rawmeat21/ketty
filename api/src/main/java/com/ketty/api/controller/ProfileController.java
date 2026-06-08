package com.ketty.api.controller;

import com.ketty.api.dto.ProfileResponse;
import com.ketty.api.dto.ProfileUpdateRequest;
import com.ketty.api.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.ketty.api.entity.User;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(profileService.getMyProfile(currentUser.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(@AuthenticationPrincipal User currentUser,@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(currentUser.getUsername(), request));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileResponse> getProfileByUsername(@PathVariable String username) {
        return ResponseEntity.ok(profileService.getProfileByUsername(username));
    }
}