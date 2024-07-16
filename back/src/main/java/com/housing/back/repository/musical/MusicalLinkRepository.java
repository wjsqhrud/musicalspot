package com.housing.back.repository.musical;

import com.housing.back.entity.musical.MusicalLinkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MusicalLinkRepository extends JpaRepository<MusicalLinkEntity, Long> {
    List<MusicalLinkEntity> findByMusicalId(Long musicalId);
}
