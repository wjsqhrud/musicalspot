package com.housing.back.service.implement;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.housing.back.dto.request.websocket.MessageDTO;
import com.housing.back.service.websocket.MessageService;

@Service
public class MessageServiceImplement implements MessageService {
    
   @Override
    public MessageDTO saveMessage(String nickname, String messageText, LocalDateTime transmitTime) {
        // 메시지를 저장하는 로직 구현
        MessageDTO message = new MessageDTO();
        message.setNickname(nickname);
        message.setMessageText(messageText);
        message.setTransmitTime(transmitTime);
        // 메시지를 데이터베이스에 저장하는 로직이 여기에 추가되어야 합니다.
        return message;
    }

    @Override
    public void transmitMessage(String nickname, String messageText, LocalDateTime transmitTime) {
        // 메시지를 전송하는 로직 구현
        MessageDTO message = new MessageDTO();
        message.setNickname(nickname);
        message.setMessageText(messageText);
        message.setTransmitTime(transmitTime);
        // 메시지를 전송하는 로직이 여기에 추가되어야 합니다.
    }
    
}
