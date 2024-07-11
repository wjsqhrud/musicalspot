package com.housing.back.repository.musical;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.housing.back.entity.musical.MusicalEntity;

@Repository
public interface MusicalRepository extends JpaRepository<MusicalEntity, Long> {
    List<MusicalEntity> findByCategoryId(Long categoryId);
    List<MusicalEntity> findTop7ByOrderByStartDateDesc();
    List<MusicalEntity> findTop10ByOrderByViewCountDesc();
    List<MusicalEntity> findByCategoryIdOrderByViewCountDesc(Long categoryId);
    List<MusicalEntity> findByCategoryIdOrderByEndDateAsc(Long categoryId);
    List<MusicalEntity> findByCategoryIdOrderByTitleAsc(Long categoryId);
    List<MusicalEntity> findByCategoryIdOrderByStartDateDesc(Long categoryId);
}
