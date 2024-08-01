package com.housing.back.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.request.auth.NicknameRequestDto;
import com.housing.back.dto.response.ResponseDto;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.dto.response.auth.NicknameResponseDto;
import com.housing.back.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "User API", description = "로그인 사용자 상태를 관리하는 컨트롤러")
public class UserController {

    @Autowired
    private AuthService authService;

    //todo: 여기는 post가 맞는듯
    @GetMapping("/access")
    @Operation(summary = "엑세스토큰 인증요청", description = "로그인된 사용자가 유효한 엑세스토큰을 사용하여 보호된 영역에 접근할 수 있는지 확인합니다.")
    public ResponseEntity<ResponseDto> accessSecureArea(HttpServletRequest request) {
        ResponseEntity<ResponseDto> response = authService.accessSecureArea(request);
        return response;
    }

    @GetMapping("/logout") // 인증 : 로그아웃
    @Operation(summary = "로그아웃", description = "사용자의 로그인 세션을 종료하고, 엑세스토큰과 리프레시토큰을 Redis 블랙리스트에 등록하여 다시 사용할 수 없게 만듭니다.")
    public ResponseEntity<ResponseDto> logout(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String accessTokenHeader,
        @RequestHeader(value = "Refresh-Token", required = false) String refreshTokenHeader) {

        ResponseEntity<ResponseDto> response = authService.logout(accessTokenHeader, refreshTokenHeader);
        return response;
    }

    @PostMapping("/nickname-check") // 인증 : 닉네임 체크
    @Operation(summary = "닉네임 중복 체크", description = "새로운 닉네임이 기존에 존재하는 닉네임인지 확인합니다. 중복되지 않으면 사용 가능합니다.")
    public ResponseEntity<? super NicknameResponseDto> checkNickName(@RequestBody @Valid NicknameRequestDto requestBody) {
        ResponseEntity<? super NicknameResponseDto> response = authService.checkNickName(requestBody);
        return response;
    }

    @PostMapping("/nickname-create") // 인증 : 닉네임 생성
    @Operation(summary = "닉네임 생성", description = "로그인된 사용자가 새로운 닉네임을 생성합니다. 생성된 닉네임은 유저 ID와 연관됩니다.")
    public ResponseEntity<? super NicknameResponseDto> createNickName(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody @Valid NicknameRequestDto requestBody) {

        // 닉네임 생성 요청 처리
        ResponseEntity<? super NicknameResponseDto> response = authService.createNickName(authorizationHeader, requestBody);
        return response;
    }

    @PostMapping("/nickname-find") // 인증 : 닉네임 찾기
    @Operation(summary = "닉네임 존재 확인", description = "로그인된 사용자가 자신의 닉네임이 존재하는지 확인합니다.")
    public ResponseEntity<? super NicknameResponseDto> findNickName(
        @RequestHeader("Authorization") String authorizationHeader) {

        ResponseEntity<? super NicknameResponseDto> response = authService.findNickName(authorizationHeader);
        return response;
    }
    
    @PostMapping("/refresh-token") // 인증 : 닉네임 찾기
    @Operation(summary = "토큰 재발급", description = "리프레시토큰을 사용하여 새로운 엑세스토큰과 리프레시토큰을 발급받습니다.")
    public ResponseEntity<?> refreshToken(
            @RequestHeader("Authorization") String authorizationHeader, // 요청 헤더에서 Authorization 헤더를 추출
            @RequestBody Map<String, String> requestBody, // requestBody는 deviceInfo 및 기타 매개변수를 포함하는 Map
            HttpServletRequest request) { // IP 주소를 추출하기 위해 HttpServletRequest 사용

            ResponseEntity<?> response = authService.handleTokenRefresh(authorizationHeader, requestBody, request);
            return response;
    }

    @PostMapping("/device-info") // 인증 : OAuth유저 재요청
    @Operation(summary = "OAuth 유저 정보 저장", description = "OAuth2 유저의 리프레시토큰, 디바이스 정보, IP 주소를 저장합니다.")
    public ResponseEntity<?> deviceInfo(
            @RequestHeader("Authorization") String accessToken,
            @RequestHeader("Refresh-Token") String refreshToken,
            @RequestParam("deviceInfo") String deviceInfo,
            HttpServletRequest request){
            ResponseEntity<?> response = authService.processDeviceInfo(accessToken, refreshToken, deviceInfo, request);
        return response;
    }

    @PostMapping("/delete")
    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴 시 닉네임이 유저 ID와 연관된 닉네임인지 확인한 후 탈퇴를 처리합니다.")
    public ResponseEntity<TestResponseDto> deleteUser(HttpServletRequest request, @RequestBody Map<String, String> requestBody) {
        return authService.deleteUserByNickname(request, requestBody);
    }

    @PostMapping("/change-password")
    @Operation(summary = "비밀번호 변경", description = "로그인된 사용자의 비밀번호를 변경합니다. 유저 인증 후 변경이 가능합니다.")
    public ResponseEntity<TestResponseDto> changePassword(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> requestBody) {
        return authService.changePassword(authorizationHeader, requestBody);
    }

    @GetMapping("/user-info")
    @Operation(summary = "유저 정보 조회", description = "유저의 로그인 종류, 이메일, 아이디, 닉네임 정보를 반환합니다.")
    public ResponseEntity<?> getUserInfo(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return authService.getUserInfo(authorizationHeader);
    }
}
