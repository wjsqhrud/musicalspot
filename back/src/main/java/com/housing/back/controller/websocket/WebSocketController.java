package com.housing.back.controller.websocket;

import java.util.LinkedList;
import java.util.Queue;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.housing.back.common.TimeFormatter;
import com.housing.back.dto.request.websocket.MessageDTO;
import com.housing.back.dto.request.websocket.MessageDTO.MessageType;
import com.vane.badwordfiltering.BadWordFiltering;


@Controller
public class WebSocketController {

    private MessageDTO tempMsgDTO = new MessageDTO();
    private Queue<Long> messageTimestamps = new LinkedList<>(); // 메시지 전송 시간 기록
    private static final int SPAM_THRESHOLD = 8; // 허용되는 최대 메시지 수
    private static final long TIME_WINDOW = 10000; // 시간 창 (밀리초 단위, 임시로 10초 설정)

    @MessageMapping("/transmitMessages")
    @SendTo("/topic/chatRoom")
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        BadWordFiltering swearFilter = new BadWordFiltering();
        TimeFormatter timeFormatter = new TimeFormatter();

        String prevMsg = (tempMsgDTO.getMessageText() != null) ? tempMsgDTO.getMessageText().trim() : "";  // 이전 메시지
        String transmittedMsg = messageDTO.getMessageText().trim(); // 최신 메시지
        long currentTime = System.currentTimeMillis();

        // 비속어 감지 메서드
        if(swearFilter.blankCheck(transmittedMsg)) {
            messageDTO.setMessageText("비속어");
            return messageDTO;
        } 

        // 무작위 도배 감지 메서드
        // 현재 시간에서 TIME_WINDOW(10초) 보다 오래된 메시지의 타임스탬프는 제거
        while (!messageTimestamps.isEmpty() && currentTime - messageTimestamps.peek() > TIME_WINDOW) {
            messageTimestamps.poll(); // TIME_WINDOW를 벗어난 오래된 메시지 타임스탬프 제거
        }

        // 최근 TIME_WINDOW 동안의 메시지 수가 SPAM_THRESHOLD (여기서는 5개)를 넘는 경우 도배로 간주
        if (messageTimestamps.size() >= SPAM_THRESHOLD) {
            messageDTO.setMessageText("도배감지");
            return messageDTO;
        }

        // 동일 문자열 도배 감지 메서드
        if (prevMsg.equals(transmittedMsg)) {
            messageDTO.setMessageText("동일문자열");
            return messageDTO;
        }
        
        // 모든 조건을 통과한 경우 메시지 전송
        messageTimestamps.offer(currentTime);
        messageDTO.setTransmitTime(timeFormatter.getTime());
        messageDTO.setType(MessageType.CHAT); // enum 메세지 타입에 채팅타입으로 설정

        // 최신 메시지를 tempMsgDTO에 저장
        tempMsgDTO.setMessageText(transmittedMsg);
        return messageDTO;
    }

    // 채팅 참여버튼 누른 사용자 닉네임과 환영 메세지 출력 
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/chatRoom")
    public MessageDTO addUser(MessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {

        TimeFormatter timeFormatter = new TimeFormatter();

        messageDTO.setMessageText(messageDTO.getNickname() + 
        "님이 채팅에 참여했습니다.");
        messageDTO.setTransmitTime(timeFormatter.getTime());
        messageDTO.setType(MessageType.JOIN); // enum 메세지 타입에 채팅참가타입으로 설정
        
        return messageDTO;
    }
}