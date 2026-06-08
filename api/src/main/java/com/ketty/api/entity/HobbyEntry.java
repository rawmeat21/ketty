package com.ketty.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hobby_entries",uniqueConstraints = @UniqueConstraint(columnNames = {"hobby_id", "externalId"}))
public class HobbyEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hobby_id", nullable = false)
    private Hobby hobby;

    private String externalId;

    @Column(nullable = false)
    private String title;

    private String coverImageUrl;

    @Column(length = 500)
    private String note;
    private int displayOrder;
}