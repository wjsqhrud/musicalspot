package com.housing.back.controller.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.request.review.CreateReviewRequestDto;
import com.housing.back.dto.request.review.UpdateReviewRequestDto;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.review.PrivateReviewService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private")
@RequiredArgsConstructor
public class PrivateReviewController {

    private final PrivateReviewService privateReviewService;

    @PostMapping("/create-review")
    public ResponseEntity<TestResponseDto> createReview(HttpServletRequest request, @RequestBody CreateReviewRequestDto createReviewRequestDto) {
        ResponseEntity<TestResponseDto> response = privateReviewService.createReview(request, createReviewRequestDto);
        return response;
    }

    @PutMapping("/update-review/{reviewId}")
    public ResponseEntity<TestResponseDto> updateReview(HttpServletRequest request, @PathVariable("reviewId") Long reviewId, @RequestBody UpdateReviewRequestDto updateReviewRequestDto) {
        ResponseEntity<TestResponseDto> response = privateReviewService.updateReview(request, reviewId, updateReviewRequestDto);
        return response;
    }

    @DeleteMapping("/delete-review/{reviewId}")
    public ResponseEntity<TestResponseDto> deleteReview(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        ResponseEntity<TestResponseDto> response = privateReviewService.deleteReview(request, reviewId);
        return response;
    }

    @GetMapping("/review-details/{reviewId}")
    public ResponseEntity<TestResponseDto> getReviewDetailsWithOwnerCheck(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        ResponseEntity<TestResponseDto> response = privateReviewService.getReviewDetailsWithOwnerCheck(request, reviewId);
        return response;
    }

    @GetMapping("/review-like/{reviewId}")
    public ResponseEntity<TestResponseDto> hasUserLikedReview(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        ResponseEntity<TestResponseDto> response = privateReviewService.hasUserLikedReview(request, reviewId);
        return response;
    }

    @PostMapping("/toggle-review-like/{reviewId}")
    public ResponseEntity<TestResponseDto> toggleReviewLike(HttpServletRequest request, @PathVariable("reviewId") Long reviewId) {
        ResponseEntity<TestResponseDto> response = privateReviewService.toggleReviewLike(request, reviewId);
        return response;
    }
}
