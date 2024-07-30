package com.housing.back.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDto {
    private String userId;
    private String email;
    private String nickname;
    private int passwordLength;
}
