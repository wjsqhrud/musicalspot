package com.housing.back.controller.websocket;

import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;

import com.housing.back.common.TimeFormatter;
import com.housing.back.dto.request.websocket.MessageDTO;
import com.housing.back.dto.request.websocket.MessageDTO.MessageType;
import com.vane.badwordfiltering.BadWordFiltering;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private Queue<Long> messageTimestamps = new LinkedList<>(); // 메시지 전송 시간 기록
    private static final int SPAM_THRESHOLD = 8; // 허용되는 최대 메시지 수
    private static final long TIME_WINDOW = 10000; // 시간 창 (밀리초 단위, 임시로 10초 설정)
    
    // 사용자 닉네임과 세션 ID를 매핑하기 위한 맵
    private Map<String, String> userSessionMap = new ConcurrentHashMap<>();

    // 사용자 별로 이전 메시지를 저장하는 맵
    private Map<String, String> userPreviousMessages = new ConcurrentHashMap<>();

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);
    
    @MessageMapping("/transmitMessages")
    @SendTo("/topic/chatRoom")
    public MessageDTO sendMessage(MessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        BadWordFiltering swearFilter = new BadWordFiltering();
        TimeFormatter timeFormatter = new TimeFormatter();

        String transmittedMsg = messageDTO.getMessageText().trim(); // 최신 메시지
        long currentTime = System.currentTimeMillis();
        String userNickname = messageDTO.getNickname(); // 사용자 닉네임을 가져옴
        String sessionId = headerAccessor.getSessionId(); // 클라이언트 세션 ID를 가져옴

        // 사용자 닉네임과 세션 ID 매핑
        userSessionMap.put(userNickname, sessionId);

        // 비속어 감지 메서드
        if(swearFilter.blankCheck(transmittedMsg)) {
            messageDTO.setMessageText("비속어");
            sendMessageToUser(sessionId, messageDTO);
            return null;
        }

        // 무작위 도배 감지 메서드
        while (!messageTimestamps.isEmpty() && currentTime - messageTimestamps.peek() > TIME_WINDOW) {
            messageTimestamps.poll(); // TIME_WINDOW를 벗어난 오래된 메시지 타임스탬프 제거
        }

        if (messageTimestamps.size() >= SPAM_THRESHOLD) {
            messageDTO.setMessageText("도배감지");
            sendMessageToUser(sessionId, messageDTO);
            return null;
        }

        // 사용자별 동일 문자열 도배 감지 메서드
        String prevMsg = userPreviousMessages.getOrDefault(userNickname, "");
        if (prevMsg.equals(transmittedMsg)) {
            messageDTO.setMessageText("동일문자열");
            sendMessageToUser(sessionId, messageDTO);
            return null;
        }
        
        // 모든 조건을 통과한 경우 메시지 전송
        messageTimestamps.offer(currentTime);
        messageDTO.setTransmitTime(timeFormatter.getTime());
        messageDTO.setType(MessageType.CHAT); // enum 메세지 타입에 채팅타입으로 설정

        // 사용자별 이전 메시지 저장
        userPreviousMessages.put(userNickname, transmittedMsg);

        return messageDTO; // 공통 채팅방으로 메시지를 전송
    }

    private void sendMessageToUser(String sessionId, MessageDTO messageDTO) {
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/reply", messageDTO, createHeaders(sessionId));
    }

    private MessageHeaders createHeaders(@Nullable String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        if (sessionId != null) headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }

    // 필터링 메세지 맵핑
    @MessageMapping("/privateMessage")
    public void handlePrivateMessage(MessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = userSessionMap.get(messageDTO.getNickname());
        if (sessionId != null) {
            sendMessageToUser(sessionId, messageDTO);
        }
    }

    // 채팅 참여버튼 누른 사용자 닉네임과 환영 메세지 출력
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/chatRoom")
    public MessageDTO addUser(MessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        TimeFormatter timeFormatter = new TimeFormatter();
        String userNickname = messageDTO.getNickname(); // 사용자 닉네임을 가져옴
        String sessionId = headerAccessor.getSessionId(); // 클라이언트 세션 ID를 가져옴

        // 사용자 닉네임과 세션 ID 매핑
        userSessionMap.put(userNickname, sessionId);

        messageDTO.setMessageText(userNickname + "님이 채팅에 참여했습니다.");
        messageDTO.setTransmitTime(timeFormatter.getTime());
        messageDTO.setType(MessageType.JOIN); // enum 메세지 타입에 채팅참가타입으로 설정
        
        return messageDTO;
    }

    // 클라이언트가 나갔을 때 처리
    @MessageMapping("/chat.removeUser")
    @SendTo("/topic/chatRoom")
    public MessageDTO removeUser(MessageDTO messageDTO) {
        
        String userNickname = messageDTO.getNickname();
        String sessionId = userSessionMap.remove(userNickname);
    
        if (sessionId != null) {
            userPreviousMessages.remove(userNickname);
            messageDTO.setNickname(userNickname);
            messageDTO.setMessageText(userNickname + "님이 채팅을 나갔습니다.");
            messageDTO.setType(MessageType.JOIN);
            
            return messageDTO;
        }

        return null;
    }
}