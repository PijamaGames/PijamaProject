package com.neluBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.neluBackend.controller.UserController;
import com.neluBackend.model.User;
import com.neluBackend.repository.UserRepository;



@SpringBootApplication
@EnableWebSocket
public class NeluBackendApplication implements WebSocketConfigurer {

	@Autowired
	private UserRepository repository;
	
	public static void main(String[] args) {
		SpringApplication.run(NeluBackendApplication.class, args);
	}
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(gameHandler(), "/player").setAllowedOrigins("*").withSockJS();
	}
	
	@Bean
	public WebSocketGameHandler gameHandler() {
		return new WebSocketGameHandler();
	}
	
}
