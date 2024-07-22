package com.housing.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  // @Override
  // public void registerStompEndpoints(StompEndpointRegistry registry) {
  //   registry.addEndpoint("/ws")
  //   .setAllowedOriginPatterns("*")
  //   .withSockJS();
  // }
  
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/chatRoom")
    .setAllowedOriginPatterns("*")
    .withSockJS();

    registry.addEndpoint("/ws")
    .setAllowedOriginPatterns("*")
    .withSockJS();
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.setApplicationDestinationPrefixes("/app");
    config.enableSimpleBroker("/topic");
  }

}
