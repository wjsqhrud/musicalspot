package com.housing.back.dto.response.review;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewListResponseDto {
    private Long id;
    private String title;
    private String content;
    private Long musicalId;
    private String musicalTitle;
    private String musicalImageUrl;
    private String musicalCategory;
    private String nickname;
    private Date createdAt;
    private Date updatedAt;
    private int viewCount;
    private int likeCount;
    private int commentCount;
}
