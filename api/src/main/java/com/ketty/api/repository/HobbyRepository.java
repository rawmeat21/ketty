package com.ketty.api.repository;

import com.ketty.api.entity.Hobby;
import com.ketty.api.entity.HobbyType;
import com.ketty.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {

    List<Hobby> findByUserOrderByDisplayOrderAsc(User user);

    Optional<Hobby> findByUserAndId(User user, Long id);
    Optional<Hobby> findByUserAndTypeAndName(User user, HobbyType type, String name);

    boolean existsByUserAndTypeAndName(User user, HobbyType type, String name);

    int countByUser(User user);
}