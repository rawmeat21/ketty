package com.ketty.api.repository;

import com.ketty.api.entity.ProfileLink;
import com.ketty.api.entity.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProfileLinkRepository extends JpaRepository<ProfileLink, Long> {

    List<ProfileLink> findByUser(User user);
    
    @Transactional
    void deleteByUser(User user);
}