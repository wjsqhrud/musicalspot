package com.housing.back.common;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TimeFormatter {

    public String getTime() {

        // 현재 시간
        LocalTime now = LocalTime.now();  
        
        // 포맷 정의하기        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH : mm");        
        
        // 포맷 적용하기        
        String formatedNow = now.format(formatter);  
        
        return formatedNow;
    }

}
