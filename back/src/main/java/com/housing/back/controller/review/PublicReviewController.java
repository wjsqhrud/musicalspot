package com.housing.back.controller.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.review.PublicReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@Tag(name = "Public Review API", description = "비로그인 사용자를 위한 리뷰 조회 API")
public class PublicReviewController {
    
    private final PublicReviewService publicReviewService;

    @GetMapping("/review-details/{reviewId}")
    @Operation(summary = "리뷰 상세 조회", description = "특정 리뷰의 상세 정보를 조회합니다.")
    public ResponseEntity<TestResponseDto> getReviewDetails (@PathVariable("reviewId") Long reviewId){
        return publicReviewService.getReviewDetails(reviewId);
    }

    @PostMapping("/review-details/increase-view/{reviewId}")
    @Operation(summary = "리뷰 조회수 증가", description = "특정 리뷰의 조회수를 1 증가시킵니다.")
    public ResponseEntity<TestResponseDto> increaseViewCount(@PathVariable("reviewId") Long reviewId) {
        return publicReviewService.increaseViewCount(reviewId);
    }

    @GetMapping("/reviews/recent")
    @Operation(summary = "최근 리뷰 조회", description = "가장 최근에 작성된 리뷰들을 페이징하여 조회합니다.")
    public ResponseEntity<TestResponseDto> getRecentReviews(@RequestParam(name = "page", defaultValue = "0") int page) {
        return publicReviewService.getRecentReviews(page);
    }

    @GetMapping("/reviews/likes")
    @Operation(summary = "좋아요순 리뷰 조회", description = "좋아요가 많은 리뷰들을 페이징하여 조회합니다.")
    public ResponseEntity<TestResponseDto> getReviewsByLikes(@RequestParam(name = "page", defaultValue = "0") int page) {
        return publicReviewService.getReviewsByLikes(page);
    }

    @GetMapping("/reviews/views")
    @Operation(summary = "조회수순 리뷰 조회", description = "조회수가 많은 리뷰들을 페이징하여 조회합니다.")
    public ResponseEntity<TestResponseDto> getReviewsByViews(@RequestParam(name = "page", defaultValue = "0") int page) {
        return publicReviewService.getReviewsByViews(page);
    }
    @GetMapping("/musical/{musicalId}/reviews")
    @Operation(summary = "뮤지컬 리뷰 조회", description = "특정 뮤지컬에 대한 리뷰 목록을 조회합니다.")
    public ResponseEntity<TestResponseDto> getReviewsByMusical(@PathVariable("musicalId") Long musicalId) {
        return publicReviewService.getReviewsByMusicalId(musicalId);
    }
}
