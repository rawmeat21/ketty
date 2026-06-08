package com.ketty.api.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ketty.api.entity.User;
import com.ketty.api.config.JwtService;
import com.ketty.api.dto.AuthResponse;
import com.ketty.api.dto.LoginRequest;
import com.ketty.api.dto.RegisterRequest;
import com.ketty.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest request)
    {
        if(userRepo.existsByUsername(request.getUsername()))
        {
            throw new RuntimeException("Username already exists");
        }

        if(userRepo.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder().username(request.getUsername()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).displayName(request.getDisplayName() != null ? request.getDisplayName() : request.getUsername()).build();

        userRepo.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponse.builder().token(token).username(user.getUsername()).email(user.getEmail()).displayName(user.getDisplayName()).build();
    }

    public AuthResponse login(LoginRequest request)
    {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getPassword(), request.getPassword()));
        User user = userRepo.findByUsername(request.getUsername()).orElseThrow(()-> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder().token(token).username(user.getUsername()).email(user.getEmail()).displayName(user.getDisplayName()).build();
    }
}
