package com.ketty.api.repository;

import com.ketty.api.entity.Hobby;
import com.ketty.api.entity.Post;
import com.ketty.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserOrderByCreatedAtDesc(User user);
    List<Post> findByUserAndHobbyIsNullOrderByCreatedAtDesc(User user);
    List<Post> findByUserAndHobbyOrderByCreatedAtDesc(User user, Hobby hobby);
}