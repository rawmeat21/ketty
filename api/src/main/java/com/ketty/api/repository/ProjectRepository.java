package com.ketty.api.repository;

import com.ketty.api.entity.Project;
import com.ketty.api.entity.ProjectStatus;
import com.ketty.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUserOrderByCreatedAtDesc(User user);
    List<Project> findByUserAndStatusOrderByCreatedAtDesc(User user, ProjectStatus status);
    Optional<Project> findByUserAndId(User user, Long id);
}