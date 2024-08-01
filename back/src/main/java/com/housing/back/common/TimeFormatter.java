package com.housing.back.common;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TimeFormatter {

    public String getTime() {

        // 현재 시간
        LocalTime now = LocalTime.now();  
        //todo:  나중에 한번 제대로해봅시다
        // 9시간 추가
        LocalTime updatedTime = now.plusHours(9);
        
        // 포맷 정의하기        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH : mm");        
        
        // 포맷 적용하기
        String formattedNow = updatedTime.format(formatter); 
        
        return formattedNow;
    }

}
