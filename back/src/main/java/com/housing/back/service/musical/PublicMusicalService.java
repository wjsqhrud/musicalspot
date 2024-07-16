package com.housing.back.service.musical;

import com.housing.back.common.TestResponseMessage;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.entity.musical.MusicalCategoryEntity;
import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.exception.CustomDatabaseException;
import com.housing.back.repository.musical.MusicalCategoryRepository;
import com.housing.back.repository.musical.MusicalLinkRepository;
import com.housing.back.repository.musical.MusicalRepository;
import com.housing.back.repository.musical.MusicalTicketRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicMusicalService {

    private final MusicalCategoryRepository musicalCategoryRepository;
    private final MusicalRepository musicalRepository;
    private final MusicalLinkRepository musicalLinkRepository;
    private final MusicalTicketRepository musicalTicketRepository;

    public List<MusicalCategoryEntity> getCategoryList() { // 카테고리 목록요청
        try {
            return musicalCategoryRepository.findAll();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    // todo: 데이터를 간소화해서 보내주자 상의를 해야할듯 
    public List<MusicalEntity> getMusicalsByCategoryId(Long categoryId) { // 해당 카테고리 뮤지컬 목록
        try {
            return musicalRepository.findByCategoryId(categoryId);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsSortedByStartDate() { // 뮤지컬 최신등록순 (메인) 7개 - 슬라이드 데이터
        try {
            return musicalRepository.findTop7ByOrderByStartDateDesc();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsSortedByViewCount() { // 뮤지컬 조회수순 (메인) 7개 - What's Hot 데이터
        try {
            return musicalRepository.findTop10ByOrderByViewCountDesc();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByAllByViewCount() { // 모든 뮤지컬 조회수순
        try {
            return musicalRepository.findAllByOrderByViewCountDesc();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByAllByEndDate() { // 모든 뮤지컬 종료임박순
        try {
            return musicalRepository.findAllByOrderByEndDateAsc();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByAllByTitle() { // 모든 뮤지컬 상품명순
        try {
            return musicalRepository.findAllByOrderByTitleAsc();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByAllByStartDate(){ // 모든 뮤지컬 최신등록순
        try {
            return musicalRepository.findAllByOrderByStartDateDesc();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }


    public List<MusicalEntity> getMusicalsByCategoryIdSortedByViewCount(Long categoryId) { // 해당 카테고리 뮤지컬 조회수순
        try {
            return musicalRepository.findByCategoryIdOrderByViewCountDesc(categoryId);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByEndDate(Long categoryId) { // 해당 카테고리 뮤지컬 종료임박순
        try {
            return musicalRepository.findByCategoryIdOrderByEndDateAsc(categoryId);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByTitle(Long categoryId) { // 해당 카테고리 뮤지컬 상품명순
        try {
            return musicalRepository.findByCategoryIdOrderByTitleAsc(categoryId);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByCategoryIdSortedByCreatedDate(Long categoryId) { // 해당 카테고리 뮤지컬 최신등록순
        try {
            return musicalRepository.findByCategoryIdOrderByStartDateDesc(categoryId);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public List<MusicalEntity> getMusicalsByTitleStartingWith(String title) { // 제목으로 뮤지컬 검색
        try {
            return musicalRepository.findByTitleStartingWith(title);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> incrementViewCount(Long musicalId) { // 뮤지컬 조회수 증가
        try {
            Optional<MusicalEntity> optionalMusical = musicalRepository.findById(musicalId);
            if (!optionalMusical.isPresent()) {
                return TestResponseDto.notFound();
            }
            
            MusicalEntity musical = optionalMusical.get();
            musical.setViewCount(musical.getViewCount() + 1);
            musicalRepository.save(musical);
            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalDetails(Long musicalId) { // 뮤지컬 게시글보기 + 티켓 + 링크
        try {
            Optional<MusicalEntity> optionalMusical = musicalRepository.findById(musicalId);
            if (!optionalMusical.isPresent()) {
                return TestResponseDto.notFound();
            }
            
            MusicalEntity musical = optionalMusical.get();
    
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
            musicalDetails.put("id", musical.getId());
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
    
            return TestResponseDto.success(musicalDetails);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

}
