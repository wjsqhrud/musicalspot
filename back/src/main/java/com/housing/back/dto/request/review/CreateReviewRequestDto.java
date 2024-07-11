package com.housing.back.dto.request.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequestDto {
    private String title;
    private String content;
    private Long musicalId;
}
