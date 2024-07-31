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

    public ResponseEntity<TestResponseDto> getCategoryList() { // 카테고리 목록요청
        try {
            List<MusicalCategoryEntity> categories = musicalCategoryRepository.findAllOrderedById();
            if (categories.isEmpty()) {
                return TestResponseDto.notFound();
            }

            return TestResponseDto.success(categories);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    // todo: 모든 뮤지컬 반환하는거 작성해야댐
    public ResponseEntity<TestResponseDto> getAllMusicals() { // 모든 뮤지컬 반환
        try {
            List<MusicalEntity> musicals = musicalRepository.findAll();
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }

            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

   
    
    public ResponseEntity<TestResponseDto> getMusicalsByCategoryId(Long categoryId) { // 해당 카테고리 뮤지컬 목록
        try {
            List<MusicalEntity> musicals = musicalRepository.findByCategoryId(categoryId);
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }

            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsSortedByStartDate() { // 뮤지컬 최신등록순 (메인) 7개 - 슬라이드 데이터
        try {
            List<MusicalEntity> musicals = musicalRepository.findTop7ByOrderByStartDateDesc();
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }

            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsSortedByViewCount() { // 뮤지컬 조회수순 (메인) 7개 - What's Hot 데이터
        try {
            List<MusicalEntity> musicals = musicalRepository.findTop10ByOrderByViewCountDesc();
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }

            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByAllByViewCount() { // 모든 뮤지컬 조회수순
        try {
            List<MusicalEntity> musicals = musicalRepository.findAllByOrderByViewCountDesc();
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }

            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByAllByEndDate() { // 모든 뮤지컬 종료임박순
        try {
            List<MusicalEntity> musicals = musicalRepository.findAllByOrderByEndDateAsc();
            if (musicals.isEmpty()){
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByAllByTitle() { // 모든 뮤지컬 상품명순
        try {
            List<MusicalEntity> musicals = musicalRepository.findAllByOrderByTitleAsc();
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByAllByStartDate(){ // 모든 뮤지컬 최신등록순
        try {
            List<MusicalEntity> musicals = musicalRepository.findAllByOrderByStartDateDesc();
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }


    public ResponseEntity<TestResponseDto> getMusicalsByCategoryIdSortedByViewCount(Long categoryId) { // 해당 카테고리 뮤지컬 조회수순
        try {
            List<MusicalEntity> musicals = musicalRepository.findByCategoryIdOrderByViewCountDesc(categoryId);
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByCategoryIdSortedByEndDate(Long categoryId) { // 해당 카테고리 뮤지컬 종료임박순
        try {
            List<MusicalEntity> musicals = musicalRepository.findByCategoryIdOrderByEndDateAsc(categoryId);
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByCategoryIdSortedByTitle(Long categoryId) { // 해당 카테고리 뮤지컬 상품명순
        try {
            List<MusicalEntity> musicals = musicalRepository.findByCategoryIdOrderByTitleAsc(categoryId);
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByCategoryIdSortedByCreatedDate(Long categoryId) { // 해당 카테고리 뮤지컬 최신등록순
        try {
            List<MusicalEntity> musicals = musicalRepository.findByCategoryIdOrderByStartDateDesc(categoryId);
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    public ResponseEntity<TestResponseDto> getMusicalsByTitleStartingWith(String title) { // 제목으로 뮤지컬 검색
        try {
            List<MusicalEntity> musicals = musicalRepository.findByTitleContaining(title);
            if (musicals.isEmpty()) {
                return TestResponseDto.notFound();
            }
            return TestResponseDto.success(musicals);
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