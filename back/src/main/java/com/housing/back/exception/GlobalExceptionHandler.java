package com.housing.back.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.housing.back.common.TestResponseCode;
import com.housing.back.common.TestResponseMessage;
import com.housing.back.dto.response.TestResponseDto;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    // 커스텀 DB 예외처리
    @ExceptionHandler(CustomDatabaseException.class)
    public ResponseEntity<TestResponseDto> handleCustomDatabaseException(CustomDatabaseException ex, WebRequest request) {
        TestResponseDto response = new TestResponseDto(
                TestResponseCode.DATABASE_ERROR.getCode(),
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 커스텀 네트워크 예외처리
    @ExceptionHandler(CustomNetworkException.class) // todo: 웹소켓용 예외처리 만들어놓음
    public ResponseEntity<TestResponseDto> handleCustomNetworkException(CustomNetworkException ex, WebRequest request) {
        TestResponseDto response = new TestResponseDto(
                TestResponseCode.NETWORK_ERROR.getCode(),
                TestResponseMessage.NETWORK_ERROR.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.GATEWAY_TIMEOUT);
    }

    // Http 메서드 예외처리
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<TestResponseDto> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, WebRequest request) {
        TestResponseDto response = new TestResponseDto(
                TestResponseCode.METHOD_NOT_SUPPORTED.getCode(),
                TestResponseMessage.METHOD_NOT_SUPPORTED.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    // 지원하지않은 미디어타입 예외처리
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class) // todo: 사용할만한 껀덕지가 안나오긴해서 삭제할예정
    public ResponseEntity<TestResponseDto> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, WebRequest request) {
        TestResponseDto response = new TestResponseDto(
                TestResponseCode.MEDIA_TYPE_NOT_SUPPORTED.getCode(),
                TestResponseMessage.MEDIA_TYPE_NOT_SUPPORTED.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    // 예상 밖 예외처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<TestResponseDto> handleGlobalException(Exception ex, WebRequest request) {
        TestResponseDto response = new TestResponseDto(
                TestResponseCode.GENERAL_ERROR.getCode(),
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
