package com.housing.back.dto.request.websocket;

import java.time.LocalDateTime;
import java.time.LocalTime;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageDTO {  
    
    @NotBlank
    private MessageType type; // 'JOIN' or 'CHAT'
    @NotBlank
    private String nickname;
    @NotBlank
    private String messageText;
    @NotBlank
    private String transmitTime;

    public enum MessageType {
        CHAT,
        JOIN,
    }

}

