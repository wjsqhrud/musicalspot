package com.housing.back.controller.musical;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.service.musical.PrivateMusicalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private")
@RequiredArgsConstructor
public class PrivateMusicalController {

    private final PrivateMusicalService privateMusicalService;

    //좋아요누른적있는지
    @GetMapping("/musical-like/{musicalId}")
    public ResponseEntity<TestResponseDto> hasUserLikedMusical(@RequestHeader("Authorization") String authorizationHeader,
                                                 @PathVariable("musicalId") Long musicalId) {
        ResponseEntity<TestResponseDto> response = privateMusicalService.hasUserLikedMusical(authorizationHeader, musicalId);
        return response;
    }


    // 좋아요 토글
    @PostMapping("/toggle-musical-like/{musicalId}")
    public ResponseEntity<TestResponseDto> toggleMusicalLike(@RequestHeader("Authorization") String authorizationHeader,
                                                            @PathVariable("musicalId") Long musicalId) {
        ResponseEntity<TestResponseDto> response = privateMusicalService.toggleMusicalLike(authorizationHeader, musicalId);
        return response;
    }
    
}
