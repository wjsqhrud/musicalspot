package com.housing.back.service.implement;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.housing.back.entity.auth.CustomOAuth2User;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.repository.auth.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        
        OAuth2User oAuth2User = super.loadUser(request);
        String oauth2ClientName = request.getClientRegistration().getClientName();

        UserEntity userEntity = null;
        String userId = null;
        String email = null;

        if (oauth2ClientName.equals("kakao")) {
            userId = "kakao_" + oAuth2User.getAttributes().get("id");
            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttributes().get("kakao_account");
            email = (String) kakaoAccount.get("email");
            if (email == null) {
                email = "email@email.com";
            }
        }

        if (oauth2ClientName.equals("naver")) {
            Map<String, String> responseMap = (Map<String, String>) oAuth2User.getAttributes().get("response");
            userId = "naver_" + responseMap.get("id").substring(0, 14);
            email = responseMap.get("email");
            if (email == null) {
                email = "email@email.com";
            }
        }

        // 사용자 중복 확인 및 저장
        Optional<UserEntity> existingUser = userRepository.findByUserId(userId);
        if (existingUser.isPresent()) {
            userEntity = existingUser.get();
        } else {
            userEntity = new UserEntity(userId, email, oauth2ClientName.toLowerCase());
            userRepository.save(userEntity);
        }

        System.out.println("여기까진 성공@@@@@@@@@@@@@@@@@@@@");
        return new CustomOAuth2User(userId);
    }
    
}
