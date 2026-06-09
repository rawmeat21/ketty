package com.ketty.api.repository;

import com.ketty.api.entity.Like;
import com.ketty.api.entity.Post;
import com.ketty.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
    int countByPost(Post post);
}
