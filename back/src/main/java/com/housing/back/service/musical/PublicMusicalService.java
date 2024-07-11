package com.housing.back.service.musical;

import com.housing.back.dto.response.musical.MusicalDetailResponseDto;
import com.housing.back.entity.musical.MusicalCategoryEntity;
import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.entity.musical.MusicalLinkEntity;
import com.housing.back.entity.musical.MusicalTicketEntity;
import com.housing.back.repository.musical.MusicalCategoryRepository;
import com.housing.back.repository.musical.MusicalLinkRepository;
import com.housing.back.repository.musical.MusicalRepository;
import com.housing.back.repository.musical.MusicalTicketRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicMusicalService {

    private final MusicalCategoryRepository musicalCategoryRepository;
    private final MusicalRepository musicalRepository;
    private final MusicalLinkRepository musicalLinkRepository;
    private final MusicalTicketRepository musicalTicketRepository;

    public List<MusicalCategoryEntity> getCategoryList() {
        return musicalCategoryRepository.findAll();
    }

    public List<MusicalEntity> getMusicalsByCategoryId(Long categoryId) {
        return musicalRepository.findByCategoryId(categoryId);
    }

    public List<MusicalEntity> getMusicalsSortedByStartDate() {
        return musicalRepository.findTop7ByOrderByStartDateDesc();
    }

    public List<MusicalEntity> getMusicalsSortedByViewCount() {
        return musicalRepository.findTop10ByOrderByViewCountDesc();
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByViewCount(Long categoryId) {
        return musicalRepository.findByCategoryIdOrderByViewCountDesc(categoryId);
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByEndDate(Long categoryId) {
        return musicalRepository.findByCategoryIdOrderByEndDateAsc(categoryId);
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByTitle(Long categoryId) {
        return musicalRepository.findByCategoryIdOrderByTitleAsc(categoryId);
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByCreatedDate(Long categoryId) {
        return musicalRepository.findByCategoryIdOrderByStartDateDesc(categoryId);
    }

    public Map<String, Object> getMusicalDetails(Long musicalId) {
        MusicalEntity musical = musicalRepository.findById(musicalId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID"));

        List<Map<String, Object>> tickets = musicalTicketRepository.findByMusicalId(musicalId)
            .stream()
            .map(ticket -> {
                Map<String, Object> ticketMap = new LinkedHashMap<>();
                ticketMap.put("id", ticket.getId());
                ticketMap.put("name", ticket.getName());
                ticketMap.put("price", ticket.getPrice());
                return ticketMap;
            }).collect(Collectors.toList());

        List<Map<String, Object>> links = musicalLinkRepository.findByMusicalId(musicalId)
            .stream()
            .map(link -> {
                Map<String, Object> linkMap = new LinkedHashMap<>();
                linkMap.put("id", link.getId());
                linkMap.put("siteName", link.getSiteName());
                linkMap.put("url", link.getUrl());
                return linkMap;
            }).collect(Collectors.toList());

        Map<String, Object> musicalDetails = new LinkedHashMap<>();
        musicalDetails.put("id", musical.getId()); // id 추가
        musicalDetails.put("title", musical.getTitle());
        musicalDetails.put("startDate", musical.getStartDate());
        musicalDetails.put("endDate", musical.getEndDate());
        musicalDetails.put("venue", musical.getVenue());
        musicalDetails.put("viewCount", musical.getViewCount());
        musicalDetails.put("likeCount", musical.getLikeCount());
        musicalDetails.put("imageUrl", musical.getImageUrl());
        musicalDetails.put("category", musical.getCategory());
        musicalDetails.put("tickets", tickets);
        musicalDetails.put("links", links);

        return musicalDetails;
    }

    public void incrementViewCount(Long musicalId) {
        MusicalEntity musical = musicalRepository.findById(musicalId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID"));
        musical.setViewCount(musical.getViewCount() + 1);
        musicalRepository.save(musical);
    }
}
