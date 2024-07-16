package com.housing.back.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TestResponseCode {
    SUCCESS("SU"),
    VALIDATION_FAIL("VF"),
    DUPLICATE_ID("DI"),
    UNAUTHORIZED("UA"),
    FORBIDDEN("FB"),
    SIGN_IN_FAIL("SF"),
    CERTIFICATION_FAIL("CF"),
    MAIL_FAIL("MF"),
    DATABASE_ERROR("DBE"),
    USER_NOT_FOUND("UNF"),//todo: 이거 결국에는 not_Found임 합쳐야돼
    NETWORK_ERROR("NE"),
    GENERAL_ERROR("GE"),
    METHOD_NOT_SUPPORTED("MNS"),
    MEDIA_TYPE_NOT_SUPPORTED("MTS"),
    NOT_FOUND("NF");
    
    private final String code;
}
