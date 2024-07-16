package com.housing.back.controller.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.service.review.PublicReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicReviewController {
    
    private final PublicReviewService publicReviewService;

    @GetMapping("/review-details/{reviewId}")
    public ResponseEntity<?> getReviewDetails (@PathVariable("reviewId") Long reviewId){
        return publicReviewService.getReviewDetails(reviewId);
    }

    @PostMapping("/review-details/increase-view/{reviewId}")
    public ResponseEntity<?> increaseViewCount(@PathVariable("reviewId") Long reviewId) {
        return publicReviewService.increaseViewCount(reviewId);
    }

    @GetMapping("/reviews/recent")
    public ResponseEntity<?> getRecentReviews(@RequestParam(name = "page", defaultValue = "0") int page) {
        return publicReviewService.getRecentReviews(page);
    }

    @GetMapping("/reviews/likes")
    public ResponseEntity<?> getReviewsByLikes(@RequestParam(name = "page", defaultValue = "0") int page) {
        return publicReviewService.getReviewsByLikes(page);
    }

    @GetMapping("/reviews/views")
    public ResponseEntity<?> getReviewsByViews(@RequestParam(name = "page", defaultValue = "0") int page) {
        return publicReviewService.getReviewsByViews(page);
    }
}
