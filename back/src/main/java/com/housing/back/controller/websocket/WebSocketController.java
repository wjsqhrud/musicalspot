package com.housing.back.controller.websocket;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.housing.back.dto.request.websocket.MessageDTO;
import com.housing.back.dto.request.websocket.MessageDTO.MessageType;

@Controller
public class WebSocketController {
    // 현재 시간
    LocalTime now = LocalTime.now();  
               
    // 포맷 정의하기        
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH : mm");        

    // 포맷 적용하기        
    String formatedNow = now.format(formatter);         

    @MessageMapping("/transmitMessages")
    @SendTo("/topic/chatRoom")
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        

        // 메세지 전송 시간 설정
        messageDTO.setTransmitTime(formatedNow);
        messageDTO.setType(MessageType.CHAT); // enum 메세지 타입에 채팅타입으로 설정
        System.out.println(
            "유저 : " + messageDTO.getNickname() +
            " // 전송된 메세지 : " +  messageDTO.getMessageText() +
            " // 전송 시각 : " + messageDTO.getTransmitTime()
        );
        return messageDTO;
    }

    // 채팅 참여버튼 누른 사용자 환영 메세지 출력 
    // TODO: 채팅 참여 버튼 클릭 시 해당 클라이언트의 토큰검사 & 닉네임 참조
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/chatRoom")
    public MessageDTO addUser(MessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        messageDTO.setMessageText(messageDTO.getNickname() + 
        " 님이 채팅에 참여했습니다.");
        messageDTO.setTransmitTime(formatedNow);
        messageDTO.setType(MessageType.JOIN); // enum 메세지 타입에 채팅참가타입으로 설정
        return messageDTO;
    }
} 