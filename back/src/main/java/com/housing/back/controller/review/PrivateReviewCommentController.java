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

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private/review/comments")
@RequiredArgsConstructor
public class PrivateReviewCommentController {

    private final PrivateReviewCommentService privateReviewCommentService;

    @PostMapping("/create")
    public ResponseEntity<TestResponseDto> createComment(HttpServletRequest request, @RequestBody CreateReviewCommentRequestDto createReviewCommentRequestDto) {
        return privateReviewCommentService.createComment(request, createReviewCommentRequestDto);
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<TestResponseDto> updateComment(HttpServletRequest request, @PathVariable("commentId") Long commentId, @RequestBody UpdateReviewCommentRequestDto updateReviewCommentRequestDto) {
        return privateReviewCommentService.updateComment(request, commentId, updateReviewCommentRequestDto);
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<TestResponseDto> deleteComment(HttpServletRequest request, @PathVariable("commentId") Long commentId) {
        return privateReviewCommentService.deleteComment(request, commentId);
    }
}