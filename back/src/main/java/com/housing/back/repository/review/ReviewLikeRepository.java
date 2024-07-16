package com.housing.back.repository.review;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.housing.back.entity.review.ReviewEntity;
import com.housing.back.entity.review.ReviewLikeEntity;
import com.housing.back.entity.auth.UserEntity;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLikeEntity, Long> {
    Optional<ReviewLikeEntity> findByUserAndReview(UserEntity user, ReviewEntity review);
}
