package com.ketty.api.repository;

import com.ketty.api.entity.Hobby;
import com.ketty.api.entity.HobbyEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HobbyEntryRepository extends JpaRepository<HobbyEntry, Long> {

    List<HobbyEntry> findByHobbyOrderByDisplayOrderAsc(Hobby hobby);
    Optional<HobbyEntry> findByHobbyAndId(Hobby hobby, Long id);
    boolean existsByHobbyAndExternalId(Hobby hobby, String externalId);

    int countByHobby(Hobby hobby);
}