package com.housing.back.handler;

import java.io.IOException;
import java.util.Date;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.housing.back.dto.response.auth.JwtResponseDto;
import com.housing.back.entity.auth.CustomOAuth2User;
import com.housing.back.provider.JwtProvider;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler{

    private final JwtProvider jwtProvider;

    @Override
	public void onAuthenticationSuccess(
        HttpServletRequest request, 
        HttpServletResponse response,
		Authentication authentication
    ) throws IOException, ServletException {
		
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String userId = oAuth2User.getName();
        
        JwtResponseDto accessTokenData = jwtProvider.createAccessToken(userId);
        String accessToken = accessTokenData.getToken();
        Date accessTokenExpirationDate = accessTokenData.getExpirationDate();

        JwtResponseDto refreshTokenData = jwtProvider.createRefreshToken(userId);
        String refreshToken = refreshTokenData.getToken();
        Date refreshTokenExpirationDate = refreshTokenData.getExpirationDate();

        long accessTokenExpirationMillis = accessTokenExpirationDate.getTime();
        long refreshTokenExpirationMillis = refreshTokenExpirationDate.getTime();

        // todo: 로컬환경에서의 oauth 리스폰스 주소
        // response.sendRedirect("http://localhost:3000/auth/oauth-response/" + accessToken + "/" + accessTokenExpirationMillis + "/" + refreshToken + "/" + refreshTokenExpirationMillis);

        // todo: 배포환경에서의 oauth 리스폰스 주소
        response.sendRedirect("https://happy-mud-0f0400300.5.azurestaticapps.net/auth/oauth-response/" + accessToken + "/" + accessTokenExpirationMillis + "/" + refreshToken + "/" + refreshTokenExpirationMillis);
        
	}
    
}
