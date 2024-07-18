package com.housing.back.controller.websocket;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.housing.back.dto.request.websocket.MessageDTO;
import com.housing.back.service.websocket.MessageService;

@Controller
public class WebSocketController {

    @Autowired
    private MessageService messageService;
    
 
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        // 메세지 전송 시간 설정
        messageDTO.setTransmitTime(LocalDateTime.now());
        return messageDTO;
    }
} 