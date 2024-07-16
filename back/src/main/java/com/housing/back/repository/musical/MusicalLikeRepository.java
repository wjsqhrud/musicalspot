package com.housing.back.repository.musical;

import com.housing.back.entity.musical.MusicalLikeEntity;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.musical.MusicalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MusicalLikeRepository extends JpaRepository<MusicalLikeEntity, Long> {
    Optional<MusicalLikeEntity> findByUserAndMusical(UserEntity user, MusicalEntity musical);
}
