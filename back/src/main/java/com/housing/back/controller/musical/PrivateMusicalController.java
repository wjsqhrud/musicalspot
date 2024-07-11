package com.housing.back.controller.musical;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.service.musical.PrivateMusicalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/private")
@RequiredArgsConstructor
public class PrivateMusicalController {

    private final PrivateMusicalService privateMusicalService;

    //좋아요누른적있는지
    @GetMapping("/musical-like/{musicalId}")
    public ResponseEntity<?> hasUserLikedMusical(@RequestHeader("Authorization") String authorizationHeader,
                                                 @PathVariable("musicalId") Long musicalId) {
        return privateMusicalService.hasUserLikedMusical(authorizationHeader, musicalId);
    }


    //좋아요 클릭 
    //좋아요 누른적있다면 해당 뮤지컬 좋아요-1
    //좋아요 누르적이없다면 해당 뮤지컬 좋아요+1
    @PostMapping("/toggle-musical-like/{musicalId}")
    public ResponseEntity<?> toggleMusicalLike(@RequestHeader("Authorization") String authorizationHeader,
                                               @PathVariable("musicalId") Long musicalId) {
        return privateMusicalService.toggleMusicalLike(authorizationHeader, musicalId);
    }
    
}
