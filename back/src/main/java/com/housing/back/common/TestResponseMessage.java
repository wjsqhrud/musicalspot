package com.housing.back.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TestResponseMessage {
    SUCCESS("Success"),
    VALIDATION_FAIL("Validation failed"),
    DUPLICATE_ID("Duplicate id"),
    UNAUTHORIZED("Unauthorized"),
    FORBIDDEN("Forbidden"),
    SIGN_IN_FAIL("Login information mismatch"),
    CERTIFICATION_FAIL("Certification failed"),
    MAIL_FAIL("Mail send failed"),
    DATABASE_ERROR("Database error"),
    USER_NOT_FOUND("User not found"), //todo: 이것도결국엔 notFound임 합쳐야돼
    NETWORK_ERROR("Network error occurred"),
    GENERAL_ERROR("General error occurred"),
    METHOD_NOT_SUPPORTED("HTTP method not supported"),  
    MEDIA_TYPE_NOT_SUPPORTED("Media type not supported"),
    NOT_FOUND("Resource not found");

    private final String message;
}
