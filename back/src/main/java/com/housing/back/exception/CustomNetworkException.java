package com.housing.back.exception;

// 커스텀 네트워크 예외처리 
public class CustomNetworkException extends RuntimeException {
    public CustomNetworkException(String message, Throwable cause) {
        super(message, cause);
    }
}
