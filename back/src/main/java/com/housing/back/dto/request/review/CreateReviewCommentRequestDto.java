package com.housing.back.dto.request.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewCommentRequestDto {
    private Long reviewId;
    private String content;
}
