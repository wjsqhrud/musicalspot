package com.housing.back.exception;

// 커스텀 데이터베이스 예외처리
public class CustomDatabaseException extends RuntimeException {
    public CustomDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
