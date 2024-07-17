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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicReviewController {
    
    private final PublicReviewService publicReviewService;

    @GetMapping("/review-details/{reviewId}")
    public ResponseEntity<TestResponseDto> getReviewDetails (@PathVariable("reviewId") Long reviewId){
        ResponseEntity<TestResponseDto> response = publicReviewService.getReviewDetails(reviewId);
        return response;
    }

    @PostMapping("/review-details/increase-view/{reviewId}")
    public ResponseEntity<TestResponseDto> increaseViewCount(@PathVariable("reviewId") Long reviewId) {
        ResponseEntity<TestResponseDto> response = publicReviewService.increaseViewCount(reviewId);
        return response;
    }

    @GetMapping("/reviews/recent")
    public ResponseEntity<TestResponseDto> getRecentReviews(@RequestParam(name = "page", defaultValue = "0") int page) {
        ResponseEntity<TestResponseDto> response = publicReviewService.getRecentReviews(page);
        return response;
    }

    @GetMapping("/reviews/likes")
    public ResponseEntity<TestResponseDto> getReviewsByLikes(@RequestParam(name = "page", defaultValue = "0") int page) {
        ResponseEntity<TestResponseDto> response = publicReviewService.getReviewsByLikes(page);
        return response;
    }

    @GetMapping("/reviews/views")
    public ResponseEntity<TestResponseDto> getReviewsByViews(@RequestParam(name = "page", defaultValue = "0") int page) {
        ResponseEntity<TestResponseDto> response = publicReviewService.getReviewsByViews(page);
        return response;
    }
}
