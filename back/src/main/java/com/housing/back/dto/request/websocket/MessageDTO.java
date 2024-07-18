package com.housing.back.dto.request.websocket;

import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {  
     
    @NotBlank
    private String nickname;
    @NotBlank
    private String messageText;
    @NotBlank
    private String transmitTime;

}

