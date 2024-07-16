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

    // @Transactional
    // public ResponseEntity<?> createComment(HttpServletRequest request, CreateReviewCommentRequestDto createReviewCommentRequestDto) {
    //     try {
    //         String token = request.getHeader("Authorization");
    //         if (token == null || !token.startsWith("Bearer ")) {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    //         }

    //         token = token.substring(7);
    //         String username = jwtUtils.extractUserId(token);
    //         UserEntity user = userRepository.findByUserId(username)
    //                 .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

    //         ReviewEntity review = reviewRepository.findById(createReviewCommentRequestDto.getReviewId())
    //                 .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

    //         ReviewCommentEntity comment = new ReviewCommentEntity();
    //         comment.setUser(user);
    //         comment.setReview(review);
    //         comment.setContent(createReviewCommentRequestDto.getContent());

    //         reviewCommentRepository.save(comment);

    //         return ResponseEntity.status(HttpStatus.CREATED).body("Comment created successfully");
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating comment");
    //     }
    // }

    // @Transactional
    // public ResponseEntity<?> updateComment(HttpServletRequest request, Long commentId, UpdateReviewCommentRequestDto updateReviewCommentRequestDto) {
    //     try {
    //         String token = request.getHeader("Authorization");
    //         if (token == null || !token.startsWith("Bearer ")) {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    //         }

    //         token = token.substring(7);
    //         String username = jwtUtils.extractUserId(token);
    //         UserEntity user = userRepository.findByUserId(username)
    //                 .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

    //         ReviewCommentEntity comment = reviewCommentRepository.findById(commentId)
    //                 .orElseThrow(() -> new IllegalArgumentException("Invalid comment ID"));

    //         if (!comment.getUser().getId().equals(user.getId())) {
    //             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the owner of this comment");
    //         }

    //         comment.setContent(updateReviewCommentRequestDto.getContent());
    //         reviewCommentRepository.save(comment);

    //         return ResponseEntity.status(HttpStatus.OK).body("Comment updated successfully");
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating comment");
    //     }
    // }

    // @Transactional
    // public ResponseEntity<?> deleteComment(HttpServletRequest request, Long commentId) {
    //     try {
    //         String token = request.getHeader("Authorization");
    //         if (token == null || !token.startsWith("Bearer ")) {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    //         }

    //         token = token.substring(7);
    //         String username = jwtUtils.extractUserId(token);
    //         UserEntity user = userRepository.findByUserId(username)
    //                 .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

    //         ReviewCommentEntity comment = reviewCommentRepository.findById(commentId)
    //                 .orElseThrow(() -> new IllegalArgumentException("Invalid comment ID"));

    //         if (!comment.getUser().getId().equals(user.getId())) {
    //             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the owner of this comment");
    //         }

    //         reviewCommentRepository.delete(comment);

    //         return ResponseEntity.status(HttpStatus.OK).body("Comment deleted successfully");
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting comment");
    //     }
    // }
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
            //todo: 여기부터하면됨
            
            // ReviewCommentEntity comment = reviewCommentRepository.findById(commentId)
            //         .orElseThrow(() -> new CustomNotFoundException(TestResponseMessage.NOT_FOUND.getMessage()));

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
