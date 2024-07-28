package com.housing.back.dto.request.websocket;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageDTO {  
    
    @NotBlank
    private MessageType type; // 'JOIN' or 'CHAT' or 'FILTER'
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

