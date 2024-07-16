package com.housing.back.repository.musical;

import com.housing.back.entity.musical.MusicalTicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MusicalTicketRepository extends JpaRepository<MusicalTicketEntity, Long> {
    List<MusicalTicketEntity> findByMusicalId(Long musicalId);
}
