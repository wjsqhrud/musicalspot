package com.housing.back.controller.musical;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.musical.PublicMusicalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicMusicalController {

    private final PublicMusicalService musicalService;

    @GetMapping("/category-list")
    public ResponseEntity<TestResponseDto> categoryList() {
        return musicalService.getCategoryList();
    }
    
    @GetMapping("/category-musical/{categoryId}") // 해당 카테고리 뮤지컬 목록
    public ResponseEntity<TestResponseDto> categoryMusical(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryId(categoryId);
    }

    @GetMapping("/category-musical/sorted-by-start-date") // 뮤지컬 최신등록순 (메인) 7개 - 슬라이드 데이터
    public ResponseEntity<TestResponseDto> sortedMusicalsByStartDate() {
        return musicalService.getMusicalsSortedByStartDate();
    }

    @GetMapping("/category-musical/sorted-by-view-count") // 뮤지컬 조회수순 (메인) 7개 - What's Hot 데이터
    public ResponseEntity<TestResponseDto> sortedMusicalsByViewCount() {
        return musicalService.getMusicalsSortedByViewCount();
    }

    @GetMapping("/category-musical/all") // 모든 뮤지컬
    public ResponseEntity<TestResponseDto> getAllMusicals(){
        return musicalService.getAllMusicals();
    }
 
    @GetMapping("/category-musical/all/sorted-by-view-count") // 모든 뮤지컬 조회수순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByViewCount(){
        return musicalService.getMusicalsByAllByViewCount();
    }

    @GetMapping("/category-musical/all/sorted-by-end-date") // 모든 뮤지컬 종료임박순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByEndDate(){
        return musicalService.getMusicalsByAllByEndDate();
    }

    @GetMapping("/category-musical/all/sorted-by-title") // 모든 뮤지컬 상품명순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByTitle(){
        return musicalService.getMusicalsByAllByTitle();
    }

    @GetMapping("/category-musical/all/sorted-by-start-date") // 모든 뮤지컬 최신등록순
    public ResponseEntity<TestResponseDto> allSortedMusicalsByStartDate(){
        return musicalService.getMusicalsByAllByStartDate();
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-view-count") // 해당 카테고리 뮤지컬 조회수순
    public ResponseEntity<TestResponseDto> sortedMusicalsByViewCount(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByViewCount(categoryId);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-end-date") // 해당 카테고리 뮤지컬 종료임박순
    public ResponseEntity<TestResponseDto> sortedMusicalsByEndDate(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByEndDate(categoryId);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-title") // 해당 카테고리 뮤지컬 상품명순
    public ResponseEntity<TestResponseDto> sortedMusicalsByTitle(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByTitle(categoryId);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-start-date") // 해당 카테고리 뮤지컬 최신등록순
    public ResponseEntity<TestResponseDto> sortedMusicalsByCreatedDate(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByCreatedDate(categoryId);
    }

    @GetMapping("/musical/search-by-title") // 제목으로 뮤지컬 검색
    public ResponseEntity<TestResponseDto> searchMusicalsByTitle(@RequestParam("title") String title) {
        return musicalService.getMusicalsByTitleStartingWith(title);
    }

    @GetMapping("/musical-details/increment-view/{musicalId}") // 뮤지컬 조회수 증가
    public ResponseEntity<TestResponseDto> incrementViewCount(@PathVariable("musicalId") Long musicalId) {
        return musicalService.incrementViewCount(musicalId);
    }

    @GetMapping("/musical-details/{musicalId}") // 뮤지컬 게시글보기 + 티켓 + 링크
    public ResponseEntity<TestResponseDto> getMusicalDetails(@PathVariable("musicalId") Long musicalId) {
        return musicalService.getMusicalDetails(musicalId);
    }
}

