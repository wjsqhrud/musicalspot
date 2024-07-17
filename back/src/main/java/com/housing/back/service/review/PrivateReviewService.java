package com.housing.back.service.review;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.common.JwtUtils;
import com.housing.back.common.TestResponseMessage;
import com.housing.back.dto.response.review.ReviewOwnerResponseDto;
import com.housing.back.dto.request.review.CreateReviewRequestDto;
import com.housing.back.dto.request.review.UpdateReviewRequestDto;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.dto.response.review.ReviewCommentOwnerResponseDto;
import com.housing.back.entity.auth.NickNameEntity;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.entity.review.ReviewCommentEntity;
import com.housing.back.entity.review.ReviewEntity;
import com.housing.back.entity.review.ReviewLikeEntity;
import com.housing.back.exception.CustomDatabaseException;
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

    @Transactional
    public ResponseEntity<TestResponseDto> createReview(HttpServletRequest request, CreateReviewRequestDto createReviewRequestDto) {
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

            ReviewEntity review = new ReviewEntity();
            review.setUser(user);
            review.setTitle(createReviewRequestDto.getTitle());
            review.setContent(createReviewRequestDto.getContent());
            review.setMusical(musicalRepository.findById(createReviewRequestDto.getMusicalId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID")));

            reviewRepository.save(review);

            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional
    public ResponseEntity<TestResponseDto> updateReview(HttpServletRequest request, Long reviewId, UpdateReviewRequestDto updateReviewRequestDto) {
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
            
            Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();                    

            if (!review.getUser().getId().equals(user.getId())) {
                return TestResponseDto.forbidden();
            }

            Optional<MusicalEntity> optionalMusical = musicalRepository.findById(updateReviewRequestDto.getMusicalId());
            if (!optionalMusical.isPresent()) {
                return TestResponseDto.notFound();
            }
            MusicalEntity musical = optionalMusical.get();

            review.setTitle(updateReviewRequestDto.getTitle());
            review.setContent(updateReviewRequestDto.getContent());
            review.setMusical(musical);

            reviewRepository.save(review);

            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional
    public ResponseEntity<TestResponseDto> deleteReview(HttpServletRequest request, Long reviewId) {
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

            Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();  

            if (!review.getUser().getId().equals(user.getId())) {
                return TestResponseDto.forbidden();
            }

            reviewRepository.delete(review);

            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<TestResponseDto> getReviewDetailsWithOwnerCheck(HttpServletRequest request, Long reviewId) {
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
            
            UserEntity user = optionalUser.get();  // 이미 null 체크가 완료되었으므로 안전하게 사용 가능
            Long userId = user.getId();

            Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();     

            boolean isOwner = userId != null && review.getUser().getId().equals(userId);

            List<ReviewCommentEntity> comments = reviewCommentRepository.findByReviewId(reviewId);

            // todo: 나중에 만져야할듯 util 패키지에 넣어야할듯
            List<ReviewCommentOwnerResponseDto> commentDtos = comments.stream().map(comment -> {
                boolean commentOwner = userId != null && comment.getUser().getId().equals(userId);
                String nickname = nicknameRepository.findByUserId(comment.getUser().getId())
                                                    .map(NickNameEntity::getNickname)
                                                    .orElse("Unknown");
                return new ReviewCommentOwnerResponseDto(comment.getId(), nickname, comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(), commentOwner);
            }).collect(Collectors.toList());

            String reviewNickname = nicknameRepository.findByUserId(review.getUser().getId())
                                                    .map(NickNameEntity::getNickname)
                                                    .orElse("Unknown");

            String musicalImageUrl = musicalRepository.findById(review.getMusical().getId())
                                                      .map(musical -> musical.getImageUrl())
                                                      .orElse(null);

            String musicalTitle = musicalRepository.findById(review.getMusical().getId())
                                                   .map(musical -> musical.getTitle())
                                                   .orElse(null);

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

            return TestResponseDto.success(responseDto);

        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<TestResponseDto> hasUserLikedReview(HttpServletRequest request, Long reviewId) {
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
            
            Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();     

            Optional<ReviewLikeEntity> optionalReviewLike = reviewLikeRepository.findByUserAndReview(user, review);
            boolean hasLiked = optionalReviewLike.isPresent();

            return TestResponseDto.success(hasLiked);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional
    public ResponseEntity<TestResponseDto> toggleReviewLike(HttpServletRequest request, Long reviewId) {
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
            
            Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();     

            Optional<ReviewLikeEntity> optionalReviewLikeEntity = reviewLikeRepository.findByUserAndReview(user, review);

            if (optionalReviewLikeEntity.isPresent()) {
                reviewLikeRepository.delete(optionalReviewLikeEntity.get());
                review.setLikeCount(review.getLikeCount() - 1);
            } else {
                ReviewLikeEntity reviewLikeEntity = new ReviewLikeEntity();
                reviewLikeEntity.setUser(user);
                reviewLikeEntity.setReview(review);
                reviewLikeEntity.setLiked(true);
                reviewLikeRepository.save(reviewLikeEntity);
                review.setLikeCount(review.getLikeCount() + 1);
            }

            reviewRepository.save(review);

            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

}
