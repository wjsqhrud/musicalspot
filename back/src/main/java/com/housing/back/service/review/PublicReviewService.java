package com.housing.back.service.review;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.common.TestResponseMessage;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.dto.response.review.ReviewCommentOwnerResponseDto;
import com.housing.back.dto.response.review.ReviewListResponseDto;
import com.housing.back.dto.response.review.ReviewOwnerResponseDto;
import com.housing.back.entity.auth.NickNameEntity;
import com.housing.back.entity.review.ReviewCommentEntity;
import com.housing.back.entity.review.ReviewEntity;
import com.housing.back.exception.CustomDatabaseException;
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
    public ResponseEntity<TestResponseDto> getReviewDetails(Long reviewId) {
        try {
             Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get();

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

            return TestResponseDto.success(responseDto);

        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional
    public ResponseEntity<TestResponseDto> increaseViewCount(Long reviewId) {
        try {
            Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);
            if(!optionalReview.isPresent()) {
                return TestResponseDto.notFound();
            }
            ReviewEntity review = optionalReview.get(); 

            review.setViewCount(review.getViewCount() + 1);
            reviewRepository.save(review);

            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<TestResponseDto> getRecentReviews(int page) {
        return getReviews(page, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<TestResponseDto> getReviewsByLikes(int page) {
        return getReviews(page, Sort.by(Sort.Direction.DESC, "likeCount"));
    }

    @Transactional(readOnly = true)
    public ResponseEntity<TestResponseDto> getReviewsByViews(int page) {
        return getReviews(page, Sort.by(Sort.Direction.DESC, "viewCount"));
    }

    private ResponseEntity<TestResponseDto> getReviews(int page, Sort sort) {
        try {
            Pageable pageable = PageRequest.of(page, 40, sort);
            List<ReviewEntity> reviews = reviewRepository.findAll(pageable).getContent();
            if(reviews.isEmpty()){
                return TestResponseDto.notFound();
            }

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

            return TestResponseDto.success(reviewList);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<TestResponseDto> getReviewsByMusicalId(Long musicalId) {
        try {
            List<ReviewEntity> reviews = reviewRepository.findByMusicalId(musicalId);
            if (reviews.isEmpty()) {
                return TestResponseDto.notFound();
            }
            // 리뷰를 원하는 형식으로 매핑하고 응답 생성
            List<ReviewListResponseDto> reviewList = reviews.stream().map(review -> {
                String reviewNickname = nicknameRepository.findByUserId(review.getUser().getId())
                    .map(NickNameEntity::getNickname)
                    .orElse("Unknown");

                String musicalImageUrl = review.getMusical().getImageUrl();
                String musicalTitle = review.getMusical().getTitle();
                String musicalCategory = review.getMusical().getCategory().getCategory();

                int commentCount = reviewCommentRepository.countByReviewId(review.getId());

                return new ReviewListResponseDto(
                    review.getId(), review.getTitle(), review.getContent(), review.getMusical().getId(),
                    musicalTitle, musicalImageUrl, musicalCategory, reviewNickname, review.getCreatedAt(),
                    review.getUpdatedAt(), review.getViewCount(), review.getLikeCount(), commentCount);
            }).collect(Collectors.toList());

            return TestResponseDto.success(reviewList);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }
}
