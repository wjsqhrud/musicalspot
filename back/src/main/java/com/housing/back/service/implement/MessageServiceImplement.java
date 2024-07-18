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

        return message;
    }

    @Override
    public MessageDTO transmitMessage(String nickname, String messageText, LocalDateTime transmitTime) {
        // 메시지를 전송하는 로직 구현
        MessageDTO message = new MessageDTO();
        message.setNickname(nickname);
        message.setMessageText(messageText);
        message.setTransmitTime(transmitTime);
        return message;
    }
    
}
