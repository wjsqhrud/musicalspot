package com.housing.back.service.review;

import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.common.JwtUtils;
import com.housing.back.common.TestResponseMessage;
import com.housing.back.dto.request.review.CreateReviewCommentRequestDto;
import com.housing.back.dto.request.review.UpdateReviewCommentRequestDto;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.review.ReviewCommentEntity;
import com.housing.back.entity.review.ReviewEntity;
import com.housing.back.exception.CustomDatabaseException;
import com.housing.back.repository.auth.UserRepository;
import com.housing.back.repository.review.ReviewCommentRepository;
import com.housing.back.repository.review.ReviewRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrivateReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewRepository reviewRepository;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Transactional
    public ResponseEntity<TestResponseDto> createComment(HttpServletRequest request, CreateReviewCommentRequestDto createReviewCommentRequestDto) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return TestResponseDto.unAuthorized();
            }
    
            token = token.substring(7);
            String username = jwtUtils.extractUserId(token);
    
            Optional<UserEntity> optionalUser = userRepository.findByUserId(username);
            if (!optionalUser.isPresent()) {
                return TestResponseDto.userNotFound();
            }
            UserEntity user = optionalUser.get();
    
            Optional<ReviewEntity> optionalReview = reviewRepository.findById(createReviewCommentRequestDto.getReviewId());
            if (!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();
    
            ReviewCommentEntity comment = new ReviewCommentEntity();
            comment.setUser(user);
            comment.setReview(review);
            comment.setContent(createReviewCommentRequestDto.getContent());
    
            reviewCommentRepository.save(comment);
    
            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional
    public ResponseEntity<TestResponseDto> updateComment(HttpServletRequest request, Long commentId, UpdateReviewCommentRequestDto updateReviewCommentRequestDto) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return TestResponseDto.unAuthorized();
            }

            token = token.substring(7);
            String username = jwtUtils.extractUserId(token);

            Optional<UserEntity> optionalUser = userRepository.findByUserId(username);
            if(!optionalUser.isPresent()) {
                return TestResponseDto.userNotFound();
            }
            UserEntity user = optionalUser.get();

            Optional<ReviewCommentEntity> optionalComment = reviewCommentRepository.findById(commentId);
            if(!optionalComment.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewCommentEntity comment = optionalComment.get();

            if (!comment.getUser().getId().equals(user.getId())) {
                return TestResponseDto.forbidden();
            }

            comment.setContent(updateReviewCommentRequestDto.getContent());
            reviewCommentRepository.save(comment);

            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional
    public ResponseEntity<TestResponseDto> deleteComment(HttpServletRequest request, Long commentId) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return TestResponseDto.unAuthorized();
            }
    
            token = token.substring(7);
            String username = jwtUtils.extractUserId(token);
    
            Optional<UserEntity> optionalUser = userRepository.findByUserId(username);
            if (!optionalUser.isPresent()) {
                return TestResponseDto.userNotFound();
            }
            UserEntity user = optionalUser.get();
    
            Optional<ReviewCommentEntity> optionalComment = reviewCommentRepository.findById(commentId);
            if (!optionalComment.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewCommentEntity comment = optionalComment.get();
    
            if (!comment.getUser().getId().equals(user.getId())) {
                return TestResponseDto.forbidden();
            }
    
            reviewCommentRepository.delete(comment);
    
            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }
}
