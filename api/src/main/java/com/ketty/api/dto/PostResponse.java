package com.ketty.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private Long hobbyId;
    private String hobbyName;
    private String content;
    private String imageUrl;
    private int likeCount;
    private boolean likedByCurrentUser;
    private int commentCount;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
