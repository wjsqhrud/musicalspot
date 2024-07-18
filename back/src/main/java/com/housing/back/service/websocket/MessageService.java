package com.housing.back.service.websocket;

import java.time.LocalDateTime;

import com.housing.back.dto.request.websocket.MessageDTO;

public interface MessageService {

    // 메세지 저장
    MessageDTO saveMessage(String nickname, String messageText, LocalDateTime transmitTime);
    
    // 메세지 전송
    MessageDTO transmitMessage(String nickname, String messageText, LocalDateTime transmitTime);
}
