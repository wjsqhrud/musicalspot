package com.housing.back.controller.musical;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.musical.PrivateMusicalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private")
@RequiredArgsConstructor
@Tag(name = "Private Musical API", description = "로그인 사용자의 뮤지컬 관련 기능을 제공하는 API")
public class PrivateMusicalController {

    private final PrivateMusicalService privateMusicalService;

    //좋아요누른적있는지
    @GetMapping("/musical-like/{musicalId}")
    @Operation(summary = "사용자가 해당 뮤지컬에 좋아요를 누른 적이 있는지 확인", 
               description = "로그인된 사용자가 특정 뮤지컬에 대해 좋아요를 누른 적이 있는지 확인합니다. 이 엔드포인트는 액세스 토큰을 통해 인증된 사용자만 접근 가능합니다.")
    public ResponseEntity<TestResponseDto> hasUserLikedMusical(HttpServletRequest request, @PathVariable("musicalId") Long musicalId) {
        return privateMusicalService.hasUserLikedMusical(request, musicalId);
    }

    // 좋아요 토글
    @PostMapping("/toggle-musical-like/{musicalId}")
    @Operation(summary = "사용자의 좋아요 상태 토글", 
               description = "로그인된 사용자가 특정 뮤지컬에 대해 좋아요 상태를 토글합니다. 이 엔드포인트는 액세스 토큰을 통해 인증된 사용자만 접근 가능합니다.")
    public ResponseEntity<TestResponseDto> toggleMusicalLike(HttpServletRequest request, @PathVariable("musicalId") Long musicalId) {
        return privateMusicalService.toggleMusicalLike(request, musicalId);
    }
}

