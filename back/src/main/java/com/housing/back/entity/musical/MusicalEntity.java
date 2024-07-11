package com.housing.back.entity.musical;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "musicals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MusicalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "start_date", nullable = false)
    private Date startDate;  // 시작날짜

    @Column(name = "end_date", nullable = false)
    private Date endDate;    // 끝나는날짜

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int viewCount;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int likeCount;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private MusicalCategoryEntity category;
}
