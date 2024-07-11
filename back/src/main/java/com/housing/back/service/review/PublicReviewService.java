package com.housing.back.service.review;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.dto.response.review.ReviewCommentOwnerResponseDto;
import com.housing.back.dto.response.review.ReviewListResponseDto;
import com.housing.back.dto.response.review.ReviewOwnerResponseDto;
import com.housing.back.entity.auth.NickNameEntity;
import com.housing.back.entity.review.ReviewCommentEntity;
import com.housing.back.entity.review.ReviewEntity;
import com.housing.back.repository.auth.NicknameRepository;
import com.housing.back.repository.musical.MusicalRepository;
import com.housing.back.repository.review.ReviewCommentRepository;
import com.housing.back.repository.review.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PublicReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final MusicalRepository musicalRepository;
    private final NicknameRepository nicknameRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ReviewOwnerResponseDto> getReviewDetails(Long reviewId) {
        try {
            ReviewEntity review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

            List<ReviewCommentEntity> comments = reviewCommentRepository.findByReviewId(reviewId);
            List<ReviewCommentOwnerResponseDto> commentDtos = comments.stream().map(comment -> {
                String nickname = nicknameRepository.findByUserId(comment.getUser().getId())
                                                    .map(NickNameEntity::getNickname)
                                                    .orElse("Unknown");
                return new ReviewCommentOwnerResponseDto(comment.getId(), nickname, comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(), false);
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
                    false,
                    commentDtos
            );

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    public ResponseEntity<?> increaseViewCount(Long reviewId) {
        try {
            ReviewEntity review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid review ID"));

            review.setViewCount(review.getViewCount() + 1);
            reviewRepository.save(review);

            return ResponseEntity.ok("View count increased successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error increasing view count");
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getRecentReviews(int page) {
        return getReviews(page, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getReviewsByLikes(int page) {
        return getReviews(page, Sort.by(Sort.Direction.DESC, "likeCount"));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getReviewsByViews(int page) {
        return getReviews(page, Sort.by(Sort.Direction.DESC, "viewCount"));
    }

    private ResponseEntity<?> getReviews(int page, Sort sort) {
        try {
            Pageable pageable = PageRequest.of(page, 40, sort);
            List<ReviewEntity> reviews = reviewRepository.findAll(pageable).getContent();

            List<ReviewListResponseDto> reviewList = reviews.stream().map(review -> {
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

                int commentCount = reviewCommentRepository.countByReviewId(review.getId());

                return new ReviewListResponseDto(
                        review.getId(), review.getTitle(), review.getContent(), review.getMusical().getId(),
                        musicalTitle, musicalImageUrl, musicalCategory, reviewNickname, review.getCreatedAt(),
                        review.getUpdatedAt(), review.getViewCount(), review.getLikeCount(), commentCount);
            }).collect(Collectors.toList());

            return ResponseEntity.ok(reviewList);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching reviews");
        }
    }

}
