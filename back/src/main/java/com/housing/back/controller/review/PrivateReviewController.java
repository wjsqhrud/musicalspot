package com.housing.back.controller.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.request.review.CreateReviewRequestDto;
import com.housing.back.dto.request.review.UpdateReviewRequestDto;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.review.PrivateReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private")
@RequiredArgsConstructor
@Tag(name = "Private Review API", description = "로그인 사용자의 리뷰 관리 API")
public class PrivateReviewController {

    private final PrivateReviewService privateReviewService;

    @PostMapping("/create-review")
    @Operation(summary = "리뷰 작성", description = "로그인한 사용자가 새로운 리뷰를 작성합니다.")
    public ResponseEntity<TestResponseDto> createReview(HttpServletRequest request, @RequestBody CreateReviewRequestDto createReviewRequestDto) {
        return privateReviewService.createReview(request, createReviewRequestDto);
    }

    @PutMapping("/update-review/{reviewId}")
    @Operation(summary = "리뷰 수정", description = "로그인한 사용자가 작성한 기존 리뷰를 수정합니다.")
    public ResponseEntity<TestResponseDto> updateReview(HttpServletRequest request, @PathVariable("reviewId") Long reviewId, @RequestBody UpdateReviewRequestDto updateReviewRequestDto) {
        return privateReviewService.updateReview(request, reviewId, updateReviewRequestDto);
    }

    @DeleteMapping("/delete-review/{reviewId}")
    @Operation(summary = "리뷰 삭제", description = "로그인한 사용자가 작성한 리뷰를 삭제합니다.")
    public ResponseEntity<TestResponseDto> deleteReview(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        return privateReviewService.deleteReview(request, reviewId);
    }

    @GetMapping("/review-details/{reviewId}")
    @Operation(summary = "리뷰 상세 조회", description = "로그인한 사용자가 작성한 리뷰의 상세 정보를 조회합니다.")
    public ResponseEntity<TestResponseDto> getReviewDetailsWithOwnerCheck(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        return privateReviewService.getReviewDetailsWithOwnerCheck(request, reviewId);
    }

    @GetMapping("/review-like/{reviewId}")
    @Operation(summary = "리뷰 좋아요 상태 조회", description = "로그인한 사용자가 특정 리뷰에 대해 좋아요를 누른 적이 있는지 확인합니다.")
    public ResponseEntity<TestResponseDto> hasUserLikedReview(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        return privateReviewService.hasUserLikedReview(request, reviewId);
    }

    @PostMapping("/toggle-review-like/{reviewId}")
    @Operation(summary = "리뷰 좋아요 토글", description = "로그인한 사용자가 특정 리뷰에 대해 좋아요 또는 좋아요 취소를 토글합니다.")
    public ResponseEntity<TestResponseDto> toggleReviewLike(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        return privateReviewService.toggleReviewLike(request, reviewId);
    }
}
