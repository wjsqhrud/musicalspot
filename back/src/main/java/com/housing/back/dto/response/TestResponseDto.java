package com.housing.back.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.housing.back.common.TestResponseCode;
import com.housing.back.common.TestResponseMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestResponseDto {
    private String code;
    private String message;
    private Object data; // 데이터 필드 추가

    public TestResponseDto(String code, String message) {
        this.code = code;
        this.message = message;
    }

    // 성공했을시 data포함해서 응답
    public static ResponseEntity<TestResponseDto> success(Object data) {
        TestResponseDto responseDto = new TestResponseDto(TestResponseCode.SUCCESS.getCode(), TestResponseMessage.SUCCESS.getMessage(), data);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 성공했을시 성공유무만 응답
    public static ResponseEntity<TestResponseDto> success() {
        TestResponseDto responseDto = new TestResponseDto(TestResponseCode.SUCCESS.getCode(), TestResponseMessage.SUCCESS.getMessage());
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 데이터베이스 오류 
    public static ResponseEntity<TestResponseDto> databaseError(){
        TestResponseDto responseBody = new TestResponseDto(TestResponseCode.DATABASE_ERROR.getCode(), TestResponseMessage.DATABASE_ERROR.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }

    public static ResponseEntity<TestResponseDto> unAuthorized(){
        TestResponseDto responseBody = new TestResponseDto(TestResponseCode.UNAUTHORIZED.getCode(), TestResponseMessage.UNAUTHORIZED.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

    public static ResponseEntity<TestResponseDto> forbidden() {
        TestResponseDto responseBody = new TestResponseDto(TestResponseCode.FORBIDDEN.getCode(), TestResponseMessage.FORBIDDEN.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseBody);
    }

    // todo: 이거 고민해야된다
    public static ResponseEntity<TestResponseDto> validationFail(){
        TestResponseDto responseBody = new TestResponseDto(TestResponseCode.VALIDATION_FAIL.getCode(), TestResponseMessage.VALIDATION_FAIL.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    // 데이터가 없을때
    public static ResponseEntity<TestResponseDto> notFound() {
        TestResponseDto responseDto = new TestResponseDto(TestResponseCode.NOT_FOUND.getCode(), TestResponseMessage.NOT_FOUND.getMessage());
        return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
    }

    // 유저가 없을때
    public static ResponseEntity<TestResponseDto> userNotFound() {
        TestResponseDto responseDto = new TestResponseDto(TestResponseCode.USER_NOT_FOUND.getCode(), TestResponseMessage.USER_NOT_FOUND.getMessage());
        return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
    }

    // todo: 이거 고민해야된다
    public static ResponseEntity<TestResponseDto> customValidationFail(String message) {
        TestResponseDto responseDto = new TestResponseDto(TestResponseCode.VALIDATION_FAIL.getCode(), message);
        return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
    }

    
}