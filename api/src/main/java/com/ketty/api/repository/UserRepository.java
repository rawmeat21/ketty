package com.ketty.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ketty.api.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    
    // jpa magic
    Optional<User> findByUsername(String username);// select * from users where username = username
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);// select count(*) > 0 from users where username = username
    boolean existsByEmail(String email);
}
