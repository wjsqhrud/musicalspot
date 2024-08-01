package com.housing.back.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.housing.back.dto.request.auth.CheckCertificationRequestDto;
import com.housing.back.dto.request.auth.EmailCertificationRequestDto;
import com.housing.back.dto.request.auth.IdCheckRequestDto;
import com.housing.back.dto.request.auth.SignInRequestDto;
import com.housing.back.dto.request.auth.SignUpRequestDto;
import com.housing.back.dto.response.auth.CheckCertificationResponseDto;
import com.housing.back.dto.response.auth.EmailCertificationResponseDto;
import com.housing.back.dto.response.auth.IdCheckResponseDto;
import com.housing.back.dto.response.auth.SignInResponseDto;
import com.housing.back.dto.response.auth.SignUpResponseDto;
import com.housing.back.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API", description = "비로그인 사용자의 인증 및 인가를 제공하는 컨트롤러")
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/id-check")
    @Operation(summary = "아이디 중복 체크", 
               description = "회원가입 시 사용자가 입력한 아이디가 이미 존재하는지 확인합니다.")
    public ResponseEntity<? super IdCheckResponseDto> idCheck (
        @RequestBody @Valid IdCheckRequestDto requestBody 
    ) {
        ResponseEntity<? super IdCheckResponseDto> response = authService.idCheck(requestBody);
        return response;
    }

    @PostMapping("/email-certification")
    @Operation(summary = "이메일 인증 코드 발송", 
               description = "회원가입 시 사용자가 입력한 이메일로 인증 코드를 발송합니다.")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification (
        @RequestBody @Valid EmailCertificationRequestDto requestBody
    ){
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/check-certification")
    @Operation(summary = "인증 코드 확인", 
               description = "사용자가 입력한 인증 코드가 이메일로 발송된 코드와 일치하는지 확인합니다.")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification (
        @RequestBody @Valid CheckCertificationRequestDto requestBody
    ){
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/sign-up")
    @Operation(summary = "회원 가입", 
               description = "아이디, 이메일, 비밀번호 정보를 사용하여 새로운 사용자를 등록합니다.")
    public ResponseEntity<? super SignUpResponseDto> signUp (
        @RequestBody @Valid SignUpRequestDto requestBody
    ) {
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response; 
    }
    
    @PostMapping("/sign-in")
    @Operation(summary = "로그인", 
               description = "사용자의 아이디와 비밀번호를 사용하여 로그인 절차를 수행합니다.")
    public ResponseEntity<? super SignInResponseDto> signIn(
            @RequestBody @Valid SignInRequestDto requestBody,
            HttpServletRequest request
    ){
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody,request);
        return response;
    }
}
