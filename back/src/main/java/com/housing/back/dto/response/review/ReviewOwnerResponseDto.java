package com.housing.back.dto.response.review;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewOwnerResponseDto {
    private Long id;
    private String nickname;
    private String title;
    private String content;
    private Long musicalId;
    private String musicalImageUrl;
    private String musicalTitle;
    private String musicalCategory;
    private Date createdAt;
    private Date updatedAt;
    private int viewCount;
    private int likeCount;
    private boolean owner;
    private List<ReviewCommentOwnerResponseDto> comments;
}
