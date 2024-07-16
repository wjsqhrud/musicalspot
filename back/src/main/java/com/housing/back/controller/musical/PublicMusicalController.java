package com.housing.back.controller.musical;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.entity.musical.MusicalCategoryEntity;
import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.service.musical.PublicMusicalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicMusicalController {

    private final PublicMusicalService musicalService;

    @GetMapping("/category-list")
    public ResponseEntity<TestResponseDto> categoryList() {
        List<MusicalCategoryEntity> categoryList = musicalService.getCategoryList();
        return TestResponseDto.success(categoryList);
    }
    
    @GetMapping("/category-musical/{categoryId}") // 해당 카테고리 뮤지컬 목록
    public ResponseEntity<TestResponseDto> categoryMusical(@PathVariable("categoryId") Long categoryId) {
        List<MusicalEntity> response = musicalService.getMusicalsByCategoryId(categoryId);
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/sorted-by-start-date") // 뮤지컬 최신등록순 (메인) 7개 - 슬라이드 데이터
    public ResponseEntity<TestResponseDto> sortedMusicalsByStartDate() {
        List<MusicalEntity> response = musicalService.getMusicalsSortedByStartDate();
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/sorted-by-view-count") // 뮤지컬 조회수순 (메인) 7개 - What's Hot 데이터
    public ResponseEntity<TestResponseDto> sortedMusicalsByViewCount() {
        List<MusicalEntity> response = musicalService.getMusicalsSortedByViewCount();
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/all/sorted-by-view-count") // 모든 뮤지컬 조회수순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByViewCount(){
        List<MusicalEntity> response = musicalService.getMusicalsByAllByViewCount();
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/all/sorted-by-end-date") // 모든 뮤지컬 종료임박순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByEndDate(){
        List<MusicalEntity> response = musicalService.getMusicalsByAllByEndDate();
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/all/sorted-by-title") // 모든 뮤지컬 상품명순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByTitle(){
        List<MusicalEntity> response = musicalService.getMusicalsByAllByTitle();
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/all/sorted-by-start-date") // 모든 뮤지컬 최신등록순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByStartDate(){
        List<MusicalEntity> response = musicalService.getMusicalsByAllByStartDate();
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-view-count") // 해당 카테고리 뮤지컬 조회수순
    public ResponseEntity<TestResponseDto> sortedMusicalsByViewCount(@PathVariable("categoryId") Long categoryId) {
        List<MusicalEntity> response = musicalService.getMusicalsByCategoryIdSortedByViewCount(categoryId);
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-end-date") // 해당 카테고리 뮤지컬 종료임박순
    public ResponseEntity<TestResponseDto> sortedMusicalsByEndDate(@PathVariable("categoryId") Long categoryId) {
        List<MusicalEntity> response = musicalService.getMusicalsByCategoryIdSortedByEndDate(categoryId);
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-title") // 해당 카테고리 뮤지컬 상품명순
    public ResponseEntity<TestResponseDto> sortedMusicalsByTitle(@PathVariable("categoryId") Long categoryId) {
        List<MusicalEntity> response = musicalService.getMusicalsByCategoryIdSortedByTitle(categoryId);
        return TestResponseDto.success(response);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-start-date") // 해당 카테고리 뮤지컬 최신등록순
    public ResponseEntity<TestResponseDto> sortedMusicalsByCreatedDate(@PathVariable("categoryId") Long categoryId) {
        List<MusicalEntity> response = musicalService.getMusicalsByCategoryIdSortedByCreatedDate(categoryId);
        return TestResponseDto.success(response);
    }

    @GetMapping("/musical/search-by-title") // 제목으로 뮤지컬 검색
    public ResponseEntity<TestResponseDto> searchMusicalsByTitle(@RequestParam("title") String title) {
        List<MusicalEntity> response = musicalService.getMusicalsByTitleStartingWith(title);
        return TestResponseDto.success(response);
    }

    @GetMapping("/musical-details/increment-view/{musicalId}") // 뮤지컬 조회수 증가
    public ResponseEntity<TestResponseDto> incrementViewCount(@PathVariable("musicalId") Long musicalId) {
        ResponseEntity<TestResponseDto> response = musicalService.incrementViewCount(musicalId);
        return response;
    }

    @GetMapping("/musical-details/{musicalId}") // 뮤지컬 게시글보기 + 티켓 + 링크
    public ResponseEntity<TestResponseDto> getMusicalDetails(@PathVariable("musicalId") Long musicalId) {
        ResponseEntity<TestResponseDto> response = musicalService.getMusicalDetails(musicalId);
        return response;
    }
}
