package com.housing.back.repository.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.housing.back.entity.review.ReviewCommentEntity;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewCommentEntity, Long> {
    List<ReviewCommentEntity> findByReviewId(Long reviewId);
    int countByReviewId(Long reviewId);
}
