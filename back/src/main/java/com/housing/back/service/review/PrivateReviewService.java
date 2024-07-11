package com.housing.back.service.review;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.common.JwtUtils;
import com.housing.back.dto.response.review.ReviewOwnerResponseDto;
import com.housing.back.dto.request.review.CreateReviewRequestDto;
import com.housing.back.dto.request.review.UpdateReviewRequestDto;
import com.housing.back.dto.response.review.ReviewCommentOwnerResponseDto;
import com.housing.back.entity.auth.NickNameEntity;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.review.ReviewCommentEntity;
import com.housing.back.entity.review.ReviewEntity;
import com.housing.back.entity.review.ReviewLikeEntity;
import com.housing.back.repository.auth.NicknameRepository;
import com.housing.back.repository.auth.UserRepository;
import com.housing.back.repository.musical.MusicalRepository;
import com.housing.back.repository.review.ReviewCommentRepository;
import com.housing.back.repository.review.ReviewLikeRepository;
import com.housing.back.repository.review.ReviewRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrivateReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final NicknameRepository nicknameRepository;
    private final MusicalRepository musicalRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ReviewOwnerResponseDto> getReviewDetailsWithOwnerCheck(HttpServletRequest request, Long reviewId) {
        try {
            String token = request.getHeader("Authorization");
            final Long userId;
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                String username = jwtUtils.extractUserId(token);
                Optional<UserEntity> userEntityOptional = userRepository.findByUserId(username);
                userId = userEntityOptional.map(UserEntity::getId).orElse(null);
                // todo: 아래처럼 커스텀예외를 할거면 optional<userEntity> 를 사용할 수 있다.
                // if (userId == null) {
                //     // 커스텀 예외를 발생시키거나, 적절한 응답을 반환합니다.
                //     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID");
                // }
            } else {
                userId = null;
            }

            ReviewEntity review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

            boolean isOwner = userId != null && review.getUser().getId().equals(userId);

            List<ReviewCommentEntity> comments = reviewCommentRepository.findByReviewId(reviewId);
            List<ReviewCommentOwnerResponseDto> commentDtos = comments.stream().map(comment -> {
                boolean commentOwner = userId != null && comment.getUser().getId().equals(userId);
                // todo: 함수로 분리 재사용 가능
                String nickname = nicknameRepository.findByUserId(comment.getUser().getId())
                                                    .map(NickNameEntity::getNickname)
                                                    .orElse("Unknown");
                return new ReviewCommentOwnerResponseDto(comment.getId(), nickname, comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(), commentOwner);
            }).collect(Collectors.toList());

            // todo: 함수로 분리 재사용 가능
            String reviewNickname = nicknameRepository.findByUserId(review.getUser().getId())
                                                    .map(NickNameEntity::getNickname)
                                                    .orElse("Unknown");
            // todo: 함수로 분리 재사용 가능
            String musicalImageUrl = musicalRepository.findById(review.getMusical().getId())
            .map(musical -> musical.getImageUrl())
            .orElse(null);

            // todo: 함수로 분리 재사용 가능
            String musicalTitle = musicalRepository.findById(review.getMusical().getId())
            .map(musical -> musical.getTitle())
            .orElse(null);

            // todo: 함수로 분리 재사용 가능
            String musicalCategory = musicalRepository.findById(review.getMusical().getId())
                                                    .map(musical -> musical.getCategory().getCategory())
                                                    .orElse(null);
            

            ReviewOwnerResponseDto responseDto = new ReviewOwnerResponseDto(
                    review.getId(),
                    reviewNickname,
                    review.getTitle(),
                    review.getContent(),
                    review.getMusical().getId(),
                    musicalImageUrl,
                    musicalTitle,
                    musicalCategory,                    
                    review.getCreatedAt(),
                    review.getUpdatedAt(),
                    review.getViewCount(),
                    review.getLikeCount(),
                    isOwner,
                    commentDtos
            );

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    public ResponseEntity<?> createReview(HttpServletRequest request, CreateReviewRequestDto createReviewRequestDto) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }

            token = token.substring(7);
            String username = jwtUtils.extractUserId(token);
            // todo: 아래방식이 더 안전하다고 하는데 잘생각해보자
            UserEntity user = userRepository.findByUserId(username)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

            ReviewEntity review = new ReviewEntity();
            review.setUser(user);
            review.setTitle(createReviewRequestDto.getTitle());
            review.setContent(createReviewRequestDto.getContent());
            review.setMusical(musicalRepository.findById(createReviewRequestDto.getMusicalId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID")));

            reviewRepository.save(review);

            return ResponseEntity.status(HttpStatus.CREATED).body("Review created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating review");
        }
    }

    @Transactional
    public ResponseEntity<?> updateReview(HttpServletRequest request, Long reviewId, UpdateReviewRequestDto updateReviewRequestDto) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }

            token = token.substring(7);
            String username = jwtUtils.extractUserId(token);
            UserEntity user = userRepository.findByUserId(username)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

            ReviewEntity review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

            if (!review.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the owner of this review");
            }

            review.setTitle(updateReviewRequestDto.getTitle());
            review.setContent(updateReviewRequestDto.getContent());
            review.setMusical(musicalRepository.findById(updateReviewRequestDto.getMusicalId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID")));

            reviewRepository.save(review);

            return ResponseEntity.status(HttpStatus.OK).body("Review updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating review");
        }
    }

    @Transactional
    public ResponseEntity<?> deleteReview(HttpServletRequest request, Long reviewId) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }

            token = token.substring(7);
            String username = jwtUtils.extractUserId(token);
            UserEntity user = userRepository.findByUserId(username)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

            ReviewEntity review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

            if (!review.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the owner of this review");
            }

            reviewRepository.delete(review);

            return ResponseEntity.status(HttpStatus.OK).body("Review deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting review");
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Boolean> hasUserLikedReview(String authorizationHeader, Long reviewId) {
        String token = authorizationHeader.substring(7);
        String userId = jwtUtils.extractUserId(token);

        Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
        UserEntity userEntity = userEntityOptional.get();

        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

        boolean hasLiked = reviewLikeRepository.findByUserAndReview(userEntity, reviewEntity).isPresent();
        return ResponseEntity.ok(hasLiked);
    }

    @Transactional
    public ResponseEntity<?> toggleReviewLike(String authorizationHeader, Long reviewId) {
        String token = authorizationHeader.substring(7);
        String userId = jwtUtils.extractUserId(token);

        Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
        UserEntity userEntity = userEntityOptional.get();

        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

        Optional<ReviewLikeEntity> reviewLikeEntityOptional = reviewLikeRepository.findByUserAndReview(userEntity, reviewEntity);

        if (reviewLikeEntityOptional.isPresent()) {
            reviewLikeRepository.delete(reviewLikeEntityOptional.get());
            reviewEntity.setLikeCount(reviewEntity.getLikeCount() - 1);
        } else {
            ReviewLikeEntity reviewLikeEntity = new ReviewLikeEntity();
            reviewLikeEntity.setUser(userEntity);
            reviewLikeEntity.setReview(reviewEntity);
            reviewLikeEntity.setLiked(true);
            reviewLikeRepository.save(reviewLikeEntity);
            reviewEntity.setLikeCount(reviewEntity.getLikeCount() + 1);
        }

        reviewRepository.save(reviewEntity);

        return ResponseEntity.ok().build();
    }

}
