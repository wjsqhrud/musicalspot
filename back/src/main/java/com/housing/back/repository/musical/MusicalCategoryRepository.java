package com.housing.back.repository.musical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.housing.back.entity.musical.MusicalCategoryEntity;

@Repository
public interface MusicalCategoryRepository extends JpaRepository<MusicalCategoryEntity, Long> {
    @Query("SELECT m FROM MusicalCategoryEntity m ORDER BY m.id")
    List<MusicalCategoryEntity> findAllOrderedById();
}