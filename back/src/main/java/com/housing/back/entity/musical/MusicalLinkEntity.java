package com.housing.back.entity.musical;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "musical_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MusicalLinkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "musical_id", nullable = false)
    private MusicalEntity musical;

    @Column(nullable = false)
    private String siteName;

    @Column(nullable = false)
    private String url;
}