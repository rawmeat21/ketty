package com.ketty.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hobbies",uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "type", "name"}))
public class Hobby {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HobbyType type;

    @Column(nullable = false)
    private String name;

    private String slug;

    private int displayOrder;

    @OneToMany(mappedBy = "hobby", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HobbyEntry> entries = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.slug = generateSlug(this.name);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().trim().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-");
    }
}