package com.housing.back.dto.request.review;

import lombok.Data;

@Data
public class UpdateReviewRequestDto {
    private String title;
    private String content;
    private Long musicalId;
}