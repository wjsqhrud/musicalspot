package com.housing.back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


import com.housing.back.handler.WebSocketHandshakeInterceptor;

@Configuration
@EnableWebSocketMessageBroker
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Autowired
  private final WebSocketHandshakeInterceptor handshakeInterceptor;

  public WebSocketConfig(WebSocketHandshakeInterceptor handshakeInterceptor) {
    this.handshakeInterceptor = handshakeInterceptor;
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
    .setAllowedOriginPatterns("*")
    // .addInterceptors(new WebSocketHandshakeInterceptor())
    .withSockJS();
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.setApplicationDestinationPrefixes("/app");
    config.enableSimpleBroker("/topic", "/queue");
    config.setUserDestinationPrefix("/user");
  }

}
