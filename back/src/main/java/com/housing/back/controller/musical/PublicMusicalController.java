package com.housing.back.controller.musical;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.repository.musical.MusicalCategoryRepository;
import com.housing.back.service.musical.PublicMusicalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicMusicalController {

    private final MusicalCategoryRepository musicalCategoryRepository;
    private final PublicMusicalService musicalService;

    @GetMapping("/category-list") // 카테고리 목록요청
    public ResponseEntity<?> categoryList() {
        return ResponseEntity.ok(musicalService.getCategoryList());
    }

    @GetMapping("/category-musical/{categoryId}") // 해당 카테고리 뮤지컬 목록
    public ResponseEntity<?> categoryMusical(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(musicalService.getMusicalsByCategoryId(categoryId));
    }

    @GetMapping("/category-musical/sorted-by-start-date") // 뮤지컬 최신등록순 (메인) 7개 - 슬라이드 데이터
    public ResponseEntity<?> sortedMusicalsByStartDate() {
        return ResponseEntity.ok(musicalService.getMusicalsSortedByStartDate());
    }

    @GetMapping("/category-musical/sorted-by-view-count") // 뮤지컬 조회수순 (메인) 7개 - What's Hot 데이터
    public ResponseEntity<?> sortedMusicalsByViewCount() {
        return ResponseEntity.ok(musicalService.getMusicalsSortedByViewCount());
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-view-count") // 해당 카테고리 뮤지컬 조회수순
    public ResponseEntity<?> sortedMusicalsByViewCount(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(musicalService.getMusicalsByCategoryIdSortedByViewCount(categoryId));
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-end-date") // 해당 카테고리 뮤지컬 종료임박순
    public ResponseEntity<?> sortedMusicalsByEndDate(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(musicalService.getMusicalsByCategoryIdSortedByEndDate(categoryId));
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-title") // 해당 카테고리 뮤지컬 상품명순
    public ResponseEntity<?> sortedMusicalsByTitle(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(musicalService.getMusicalsByCategoryIdSortedByTitle(categoryId));
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-start-date") // 해당 카테고리 뮤지컬 최신등록순
    public ResponseEntity<?> sortedMusicalsByCreatedDate(@PathVariable("categoryId") Long categoryId) {
        return ResponseEntity.ok(musicalService.getMusicalsByCategoryIdSortedByCreatedDate(categoryId));
    }

    @GetMapping("/musical-details/{musicalId}") // 뮤지컬 게시글보기 + 티켓 + 링크
    public ResponseEntity<?> getMusicalDetails(@PathVariable("musicalId") Long musicalId) {
        return ResponseEntity.ok(musicalService.getMusicalDetails(musicalId));
    }

    @GetMapping("/musical-details/increment-view/{musicalId}")
    public ResponseEntity<?> incrementViewCount(@PathVariable("musicalId") Long musicalId) {
        musicalService.incrementViewCount(musicalId);
        return ResponseEntity.ok().build();
    }

    
}
