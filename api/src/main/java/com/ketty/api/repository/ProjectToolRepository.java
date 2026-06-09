package com.ketty.api.repository;

import com.ketty.api.entity.Project;
import com.ketty.api.entity.ProjectTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectToolRepository extends JpaRepository<ProjectTool, Long> {

    List<ProjectTool> findByProject(Project project);
    void deleteByProject(Project project);
}
