package com.ketty.api.service;

import com.ketty.api.dto.*;
import com.ketty.api.entity.*;
import com.ketty.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final HobbyRepository hobbyRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public PostResponse createPost(String username, CreatePostRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Hobby hobby = null;
        if (request.getHobbyId() != null) {
            hobby = hobbyRepository.findByUserAndId(user, request.getHobbyId()).orElseThrow(() -> new RuntimeException("Hobby not found"));
        }

        if (request.hasConflictingMedia()) {
            throw new RuntimeException("A post cannot have both an image and a video");
        }

        Post post = Post.builder().user(user).hobby(hobby).content(request.getContent()).imageUrl(request.getImageUrl()).videoUrl(request.getVideoUrl()).build();

        postRepository.save(post);

        return mapToPostResponse(post, user);
    }

    public List<PostResponse> getPersonalPosts(String username) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return postRepository.findByUserAndHobbyIsNullOrderByCreatedAtDesc(user).stream().map(post -> mapToPostResponse(post, user)).collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByHobby(String username, Long hobbyId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Hobby hobby = hobbyRepository.findByUserAndId(user, hobbyId).orElseThrow(() -> new RuntimeException("Hobby not found"));

        return postRepository.findByUserAndHobbyOrderByCreatedAtDesc(user, hobby).stream().map(post -> mapToPostResponse(post, user)).collect(Collectors.toList());
    }

    public List<PostResponse> getAllPosts(String username) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return postRepository.findByUserOrderByCreatedAtDesc(user).stream().map(post -> mapToPostResponse(post, user)).collect(Collectors.toList());
    }

    @Transactional
    public PostResponse updatePost(String username, Long postId, CreatePostRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        if (request.hasConflictingMedia()) {
            throw new RuntimeException("A post cannot have both an image and a video");
        }

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own posts");
        }

        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getImageUrl() != null) {
            post.setImageUrl(request.getImageUrl());
        }

        if (request.getVideoUrl() != null) {
            post.setVideoUrl(request.getVideoUrl());
        }
        postRepository.save(post);

        return mapToPostResponse(post, user);
    }

    @Transactional
    public void deletePost(String username, Long postId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Transactional
    public int toggleLike(String username, Long postId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.existsByUserAndPost(user, post)) 
        {
            likeRepository.deleteByUserAndPost(user, post);
        } 
        else 
        {
            Like like = Like.builder().user(user).post(post).build();
            likeRepository.save(like);
        }

        return likeRepository.countByPost(post);
    }

    @Transactional
    public CommentResponse addComment(String username, Long postId, CreateCommentRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        Comment parent = null;

        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId()).orElseThrow(() -> new RuntimeException("Parent comment not found"));
            if (!parent.getPost().getId().equals(postId)) {
                throw new RuntimeException("Parent comment does not belong to this post");
            }
        }

        Comment comment = Comment.builder().user(user).post(post).parent(parent).content(request.getContent()).build();

        commentRepository.save(comment);

        return mapToCommentResponse(comment);
    }

    @Transactional
    public void deleteComment(String username, Long commentId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private PostResponse mapToPostResponse(Post post, User currentUser) {

        List<CommentResponse> comments = commentRepository.findByPostAndParentIsNullOrderByCreatedAtAsc(post).stream().map(this::mapToCommentResponse).collect(Collectors.toList());

        return PostResponse.builder()
            .id(post.getId())
            .username(post.getUser().getUsername())
            .displayName(post.getUser().getDisplayName())
            .avatarUrl(post.getUser().getAvatarUrl())
            .hobbyId(post.getHobby() != null ? post.getHobby().getId() : null)
            .hobbyName(post.getHobby() != null ? post.getHobby().getName() : null)
            .content(post.getContent())
            .imageUrl(post.getImageUrl())
            .videoUrl(post.getVideoUrl())
            .likeCount(likeRepository.countByPost(post))
            .likedByCurrentUser(likeRepository.existsByUserAndPost(currentUser, post))
            .commentCount(commentRepository.countByPost(post))
            .comments(comments)
            .createdAt(post.getCreatedAt())
            .updatedAt(post.getUpdatedAt())
            .build();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        List<CommentResponse> replies = comment.getReplies() == null ? List.of() : comment.getReplies().stream().map(this::mapToCommentResponse).collect(Collectors.toList());
        return CommentResponse.builder().id(comment.getId()).username(comment.getUser().getUsername()).displayName(comment.getUser().getDisplayName()).content(comment.getContent()).createdAt(comment.getCreatedAt()).replies(replies).build();
    }
}