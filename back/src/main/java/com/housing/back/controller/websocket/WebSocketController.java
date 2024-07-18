package com.housing.back.controller.websocket;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.hibernate.grammars.hql.HqlParser;
import org.springframework.boot.autoconfigure.integration.IntegrationProperties;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.housing.back.dto.request.websocket.MessageDTO;

@Controller
public class WebSocketController {

    @MessageMapping("/transmitMessages")
    @SendTo("/topic/public")
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        
        // 현재 시간
        LocalTime now = LocalTime.now();             
        // 포맷 정의하기        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH : mm");         
        // 포맷 적용하기        
        String formatedNow = now.format(formatter);         

        // 메세지 전송 시간 설정
        messageDTO.setTransmitTime(formatedNow);
        System.out.println(
            "유저 : " + messageDTO.getNickname() +
            "전송된 메세지 : " +  messageDTO.getMessageText() +
            "전송 시각 : " + messageDTO.getTransmitTime()
        );
        return messageDTO;
    }
} 