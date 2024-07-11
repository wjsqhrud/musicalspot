package com.housing.back.dto.response.musical;

import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.entity.musical.MusicalLinkEntity;
import com.housing.back.entity.musical.MusicalTicketEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class MusicalDetailResponseDto {
    private MusicalEntity musical;
    private List<MusicalTicketEntity> tickets;
    private List<MusicalLinkEntity> links;
}
