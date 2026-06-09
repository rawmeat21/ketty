package com.ketty.api.repository;

import com.ketty.api.entity.Comment;
import com.ketty.api.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostAndParentIsNullOrderByCreatedAtAsc(Post post);
    int countByPost(Post post);
}

