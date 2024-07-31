package com.housing.back.controller.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.request.review.CreateReviewCommentRequestDto;
import com.housing.back.dto.request.review.UpdateReviewCommentRequestDto;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.review.PrivateReviewCommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private/review/comments")
@RequiredArgsConstructor
@Tag(name = "Private Review Comment API", description = "로그인 사용자의 리뷰 댓글 관리 API")
public class PrivateReviewCommentController {

    private final PrivateReviewCommentService privateReviewCommentService;

    @PostMapping("/create")
    @Operation(summary = "리뷰 댓글 생성", description = "로그인한 사용자가 특정 리뷰에 댓글을 작성합니다.")
    public ResponseEntity<TestResponseDto> createComment(HttpServletRequest request, @RequestBody CreateReviewCommentRequestDto createReviewCommentRequestDto) {
        return privateReviewCommentService.createComment(request, createReviewCommentRequestDto);
    }

    @PutMapping("/update/{commentId}")
    @Operation(summary = "리뷰 댓글 수정", description = "로그인한 사용자가 작성한 리뷰 댓글을 수정합니다.")
    public ResponseEntity<TestResponseDto> updateComment(HttpServletRequest request, @PathVariable("commentId") Long commentId, @RequestBody UpdateReviewCommentRequestDto updateReviewCommentRequestDto) {
        return privateReviewCommentService.updateComment(request, commentId, updateReviewCommentRequestDto);
    }

    @DeleteMapping("/delete/{commentId}")
    @Operation(summary = "리뷰 댓글 삭제", description = "로그인한 사용자가 작성한 리뷰 댓글을 삭제합니다.")
    public ResponseEntity<TestResponseDto> deleteComment(HttpServletRequest request, @PathVariable("commentId") Long commentId) {
        return privateReviewCommentService.deleteComment(request, commentId);
    }
}