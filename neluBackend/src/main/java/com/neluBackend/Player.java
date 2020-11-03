package com.neluBackend;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.neluBackend.model.UserModel;

public class Player {
	private final WebSocketSession session;
	private final int playerId;
	private UserModel user;
	/*
	private boolean isHost;
	private boolean isClient;
	private int roomId;*/
	
	public Player(int playerId, WebSocketSession session) {
		this.session = session;
		this.playerId = playerId;
	}
	
	public UserModel getUser() {
		return user;
	}
	
	public void SetUser(UserModel user) {
		this.user = user;
	}
	
	public int getPlayerId() {
		return playerId;
	}
	public WebSocketSession getSession() {
		return this.session;
	}

	public void sendMessage(String msg) throws Exception{
		this.session.sendMessage(new TextMessage(msg));
	}
}
