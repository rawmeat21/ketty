package com.ketty.api.service;

import com.ketty.api.dto.ProfileLinkDTO;
import com.ketty.api.dto.ProfileResponse;
import com.ketty.api.dto.ProfileUpdateRequest;
import com.ketty.api.entity.ProfileLink;
import com.ketty.api.entity.User;
import com.ketty.api.repository.ProfileLinkRepository;
import com.ketty.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileLinkRepository profileLinkRepository;

    public ProfileResponse getMyProfile(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return mapToProfileResponse(user);
    }

    public ProfileResponse getProfileByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return mapToProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(String username, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        if (request.getLinks() != null) {
            profileLinkRepository.deleteByUser(user);
            List<ProfileLink> newLinks = request.getLinks().stream().map(dto -> ProfileLink.builder().user(user).label(dto.getLabel()).url(dto.getUrl()).build()).collect(Collectors.toList());
            profileLinkRepository.saveAll(newLinks);
        }

        userRepository.save(user);

        return mapToProfileResponse(user);
    }

    private ProfileResponse mapToProfileResponse(User user) {
        List<ProfileLinkDTO> linkDTOs = profileLinkRepository.findByUser(user).stream().map(link -> ProfileLinkDTO.builder().id(link.getId()).label(link.getLabel()).url(link.getUrl()).build()).collect(Collectors.toList());

        return ProfileResponse.builder().id(user.getId()).username(user.getUsername()).email(user.getEmail()).displayName(user.getDisplayName()).bio(user.getBio()).status(user.getStatus()).avatarUrl(user.getAvatarUrl()).links(linkDTOs).createdAt(user.getCreatedAt()).build();
    }
}