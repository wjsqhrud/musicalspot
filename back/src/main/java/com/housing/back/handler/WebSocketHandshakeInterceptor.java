package com.housing.back.handler;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.housing.back.common.JwtUtils;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.repository.auth.UserRepository;

@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // 요청에서 토큰을 추출하여 검증합니다.
        System.out.println("beforeHandshake() Called");

        List<String> protocols = request.getHeaders().get("Sec-WebSocket-Protocol");
        if (protocols != null && protocols.size() > 1) {
            String token = protocols.get(1);
            System.out.println("프로토콜에서 추출한 토큰값 : " + token);

            if (validateToken(token)) {
                String userId = extractIdFromToken(token);
                attributes.put("userID", userId);
                return true;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
        
        System.out.println("afterHandshake() Called");
        String token = request.getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            token = token.substring(7);
            System.out.println("Bearer 접두사 제거 후 토큰값 : " + token);
            String userId = jwtUtils.extractUserId(token);

            Optional<UserEntity> optionalUser = userRepository.findByUserId(userId);
            if (!optionalUser.isPresent()) {
                TestResponseDto.userNotFound();
            }
            UserEntity user = optionalUser.get();
            System.out.println("토큰에 해당하는 유저 아이디 : " + user.getUserId());
        }
    }

    private boolean validateToken(String token) {
        System.out.println("validateToken() Called");
        return true; // 임시로 항상 true 반환
    }

    private String extractIdFromToken(String token) {
        // 토큰에서 아이디 추출.
        return "사용자아이디"; // 임시 반환
    }
}