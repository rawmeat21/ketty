package com.ketty.api.service;

import com.ketty.api.dto.*;
import com.ketty.api.entity.*;
import com.ketty.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HobbyService {

    private final UserRepository userRepository;
    private final HobbyRepository hobbyRepository;
    private final HobbyEntryRepository hobbyEntryRepository;

    private static final Map<HobbyType, String> CATALOGUED_NAMES = Map.of(
        HobbyType.MUSIC, "Music",
        HobbyType.GAMES, "Games",
        HobbyType.BOOKS, "Books",
        HobbyType.MOVIES, "Movies",
        HobbyType.ANIME, "Anime"
    );

    @Transactional
    public HobbyResponse addHobby(String username, AddHobbyRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String name;
        if (request.getType() == HobbyType.CUSTOM) {
            if (request.getName() == null || request.getName().isBlank()) {
                throw new RuntimeException("Name is required for custom hobbies");
            }
            name = request.getName().trim();
        } else {
            name = CATALOGUED_NAMES.get(request.getType());
        }

        if (hobbyRepository.existsByUserAndTypeAndName(user, request.getType(), name)) {
            throw new RuntimeException("You already have a " + name + " hobby");
        }

        int order = hobbyRepository.countByUser(user);

        Hobby hobby = Hobby.builder().user(user).type(request.getType()).name(name).displayOrder(order).build();
        hobbyRepository.save(hobby);

        return mapToHobbyResponse(hobby);
    }

    public List<HobbyResponse> getHobbies(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return hobbyRepository.findByUserOrderByDisplayOrderAsc(user).stream().map(this::mapToHobbyResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteHobby(String username, Long hobbyId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Hobby hobby = hobbyRepository.findByUserAndId(user, hobbyId).orElseThrow(() -> new RuntimeException("Hobby not found"));

        hobbyRepository.delete(hobby);
    }

    @Transactional
    public HobbyEntryResponse addEntry(String username, Long hobbyId, AddHobbyEntryRequest request) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Hobby hobby = hobbyRepository.findByUserAndId(user, hobbyId).orElseThrow(() -> new RuntimeException("Hobby not found"));

        if (request.getExternalId() != null) {
            if (hobbyEntryRepository.existsByHobbyAndExternalId(hobby, request.getExternalId())) {
                throw new RuntimeException("This item is already in your " + hobby.getName() + " hobby");
            }
        }

        int order = hobbyEntryRepository.countByHobby(hobby);

        HobbyEntry entry = HobbyEntry.builder().hobby(hobby).externalId(request.getExternalId()).title(request.getTitle()).coverImageUrl(request.getCoverImageUrl()).note(request.getNote()).displayOrder(order).build();
        hobbyEntryRepository.save(entry);

        return mapToHobbyEntryResponse(entry);
    }

    @Transactional
    public HobbyEntryResponse updateEntry(String username, Long hobbyId, Long entryId, AddHobbyEntryRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Hobby hobby = hobbyRepository.findByUserAndId(user, hobbyId).orElseThrow(() -> new RuntimeException("Hobby not found"));

        HobbyEntry entry = hobbyEntryRepository.findByHobbyAndId(hobby, entryId).orElseThrow(() -> new RuntimeException("Entry not found"));
        if (request.getTitle() != null) {
            entry.setTitle(request.getTitle());
        }
        if (request.getCoverImageUrl() != null) {
            entry.setCoverImageUrl(request.getCoverImageUrl());
        }
        if (request.getNote() != null) {
            entry.setNote(request.getNote());
        }

        hobbyEntryRepository.save(entry);

        return mapToHobbyEntryResponse(entry);
    }

    @Transactional
    public void deleteEntry(String username, Long hobbyId, Long entryId) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Hobby hobby = hobbyRepository.findByUserAndId(user, hobbyId).orElseThrow(() -> new RuntimeException("Hobby not found"));
        HobbyEntry entry = hobbyEntryRepository.findByHobbyAndId(hobby, entryId).orElseThrow(() -> new RuntimeException("Entry not found"));

        hobbyEntryRepository.delete(entry);
    }

    private HobbyResponse mapToHobbyResponse(Hobby hobby) {
        List<HobbyEntryResponse> entries = hobbyEntryRepository.findByHobbyOrderByDisplayOrderAsc(hobby).stream().map(this::mapToHobbyEntryResponse).collect(Collectors.toList());

        return HobbyResponse.builder().id(hobby.getId()).type(hobby.getType()).name(hobby.getName()).slug(hobby.getSlug()).displayOrder(hobby.getDisplayOrder()).entries(entries).build();
    }

    private HobbyEntryResponse mapToHobbyEntryResponse(HobbyEntry entry) {
        return HobbyEntryResponse.builder().id(entry.getId()).externalId(entry.getExternalId()).title(entry.getTitle()).coverImageUrl(entry.getCoverImageUrl()).note(entry.getNote()).displayOrder(entry.getDisplayOrder()).build();
    }
}