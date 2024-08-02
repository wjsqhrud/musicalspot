package com.housing.back.repository.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.review.ReviewEntity;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    void deleteByUser(UserEntity user);
    List<ReviewEntity> findByMusicalId(Long musicalId);
}
