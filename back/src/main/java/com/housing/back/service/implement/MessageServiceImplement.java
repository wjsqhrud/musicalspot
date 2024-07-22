package com.housing.back.service.implement;

import org.springframework.stereotype.Service;
import com.housing.back.dto.request.websocket.MessageDTO;
import com.housing.back.service.websocket.MessageService;

@Service
public class MessageServiceImplement implements MessageService {

    @Override
    public MessageDTO saveMessage(String nickname, String messageText, String transmitTime) {
        return null;
    }

    @Override
    public MessageDTO transmitMessage(String nickname, String messageText, String transmitTime) {
        // 메시지를 전송하는 로직 구현
        MessageDTO message = new MessageDTO();
        message.setNickname(nickname);
        message.setMessageText(messageText);
        message.setTransmitTime(transmitTime);
        return message;
    }
    
}
