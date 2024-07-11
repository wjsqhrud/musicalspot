package com.housing.back.dto.response.review;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCommentOwnerResponseDto {
    private Long id;
    private String nickname;  // 댓글 작성자의 닉네임 추가
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private boolean owner;
}
