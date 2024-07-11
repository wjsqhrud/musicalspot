package com.housing.back.entity.musical;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "musical_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MusicalTicketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "musical_id", nullable = false)
    private MusicalEntity musical;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal price;
}
