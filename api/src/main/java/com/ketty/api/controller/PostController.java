package com.ketty.api.controller;

import com.ketty.api.dto.*;
import com.ketty.api.entity.User;
import com.ketty.api.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@AuthenticationPrincipal User currentUser,@Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.status(201).body(postService.createPost(currentUser.getUsername(), request));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostResponse>> getAllPosts(@PathVariable String username) {
        return ResponseEntity.ok(postService.getAllPosts(username));
    }

    @GetMapping("/user/{username}/personal")
    public ResponseEntity<List<PostResponse>> getPersonalPosts(@PathVariable String username) {
        return ResponseEntity.ok(postService.getPersonalPosts(username));
    }

    @GetMapping("/user/{username}/hobby/{hobbyId}")
    public ResponseEntity<List<PostResponse>> getPostsByHobby(@PathVariable String username,@PathVariable Long hobbyId) {
        return ResponseEntity.ok(postService.getPostsByHobby(username, hobbyId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(@AuthenticationPrincipal User currentUser,@PathVariable Long postId,@Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(postService.updatePost(currentUser.getUsername(), postId, request));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        postService.deletePost(currentUser.getUsername(), postId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Integer> toggleLike(@AuthenticationPrincipal User currentUser,@PathVariable Long postId) {
        return ResponseEntity.ok(postService.toggleLike(currentUser.getUsername(), postId));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(@AuthenticationPrincipal User currentUser,@PathVariable Long postId,@Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(201).body(postService.addComment(currentUser.getUsername(), postId, request));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal User currentUser, @PathVariable Long commentId) {
        postService.deleteComment(currentUser.getUsername(), commentId);
        return ResponseEntity.noContent().build();
    }
}