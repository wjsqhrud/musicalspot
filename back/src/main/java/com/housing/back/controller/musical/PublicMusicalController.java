package com.housing.back.controller.musical;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.musical.PublicMusicalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@Tag(name = "Public Musical API", description = "비로그인 사용자를 위한 뮤지컬 관련 API를 제공하는 컨트롤러")
public class PublicMusicalController {

    private final PublicMusicalService musicalService;

    @GetMapping("/category-list")
    @Operation(summary = "카테고리 목록 조회", description = "모든 뮤지컬 카테고리의 목록을 조회합니다.")
    public ResponseEntity<TestResponseDto> categoryList() {
        return musicalService.getCategoryList();
    }
    
    @GetMapping("/category-musical/{categoryId}")
    @Operation(summary = "카테고리별 뮤지컬 조회", description = "지정된 카테고리에 속한 모든 뮤지컬을 조회합니다.")
    public ResponseEntity<TestResponseDto> categoryMusical(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryId(categoryId);
    }

    @GetMapping("/category-musical/sorted-by-start-date")
    @Operation(summary = "최신 등록 뮤지컬 조회", description = "최근에 등록된 7개의 뮤지컬을 조회합니다. (슬라이드 데이터)")
    public ResponseEntity<TestResponseDto> sortedMusicalsByStartDate() {
        return musicalService.getMusicalsSortedByStartDate();
    }

    @GetMapping("/category-musical/sorted-by-view-count")
    @Operation(summary = "조회수 높은 뮤지컬 조회", description = "조회수가 높은 7개의 뮤지컬을 조회합니다. (What's Hot 데이터)")
    public ResponseEntity<TestResponseDto> sortedMusicalsByViewCount() {
        return musicalService.getMusicalsSortedByViewCount();
    }

    @GetMapping("/category-musical/all")
    @Operation(summary = "모든 뮤지컬 조회", description = "모든 뮤지컬의 목록을 조회합니다.")
    public ResponseEntity<TestResponseDto> getAllMusicals(){
        return musicalService.getAllMusicals();
    }
 
    @GetMapping("/category-musical/all/sorted-by-view-count")
    @Operation(summary = "모든 뮤지컬 조회수 순 정렬", description = "모든 뮤지컬을 조회수 순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> allSortedMusicalsByViewCount(){
        return musicalService.getMusicalsByAllByViewCount();
    }

    @GetMapping("/category-musical/all/sorted-by-end-date")
    @Operation(summary = "모든 뮤지컬 종료 임박 순 정렬", description = "모든 뮤지컬을 종료 임박 순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> allSortedMusicalsByEndDate(){
        return musicalService.getMusicalsByAllByEndDate();
    }

    @GetMapping("/category-musical/all/sorted-by-title")
    @Operation(summary = "모든 뮤지컬 제목순 정렬", description = "모든 뮤지컬을 제목순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> allSortedMusicalsByTitle(){
        return musicalService.getMusicalsByAllByTitle();
    }

    @GetMapping("/category-musical/all/sorted-by-start-date")
    @Operation(summary = "모든 뮤지컬 최신 등록순 정렬", description = "모든 뮤지컬을 최신 등록순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> allSortedMusicalsByStartDate(){
        return musicalService.getMusicalsByAllByStartDate();
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-view-count")
    @Operation(summary = "카테고리별 뮤지컬 조회수 순 정렬", description = "지정된 카테고리의 뮤지컬을 조회수 순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> sortedMusicalsByViewCount(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByViewCount(categoryId);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-end-date")
    @Operation(summary = "카테고리별 뮤지컬 종료 임박 순 정렬", description = "지정된 카테고리의 뮤지컬을 종료 임박 순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> sortedMusicalsByEndDate(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByEndDate(categoryId);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-title")
    @Operation(summary = "카테고리별 뮤지컬 제목순 정렬", description = "지정된 카테고리의 뮤지컬을 제목순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> sortedMusicalsByTitle(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByTitle(categoryId);
    }

    @GetMapping("/category-musical/{categoryId}/sorted-by-start-date")
    @Operation(summary = "카테고리별 뮤지컬 최신 등록순 정렬", description = "지정된 카테고리의 뮤지컬을 최신 등록순으로 정렬하여 조회합니다.")
    public ResponseEntity<TestResponseDto> sortedMusicalsByCreatedDate(@PathVariable("categoryId") Long categoryId) {
        return musicalService.getMusicalsByCategoryIdSortedByCreatedDate(categoryId);
    }

    @GetMapping("/musical/search-by-title")
    @Operation(summary = "뮤지컬 제목 검색", description = "제목을 기준으로 뮤지컬을 검색합니다.")
    public ResponseEntity<TestResponseDto> searchMusicalsByTitle(@RequestParam("title") String title) {
        return musicalService.getMusicalsByTitleStartingWith(title);
    }

    @GetMapping("/musical-details/increment-view/{musicalId}")
    @Operation(summary = "뮤지컬 조회수 증가", description = "지정된 뮤지컬의 조회수를 증가시킵니다.")
    public ResponseEntity<TestResponseDto> incrementViewCount(@PathVariable("musicalId") Long musicalId) {
        return musicalService.incrementViewCount(musicalId);
    }

    @GetMapping("/musical-details/{musicalId}")
    @Operation(summary = "뮤지컬 상세 보기", description = "지정된 뮤지컬의 상세 정보를 조회합니다. 게시글, 티켓, 링크 정보를 포함합니다.")
    public ResponseEntity<TestResponseDto> getMusicalDetails(@PathVariable("musicalId") Long musicalId) {
        return musicalService.getMusicalDetails(musicalId);
    }
}

