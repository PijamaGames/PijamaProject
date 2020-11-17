package com.neluBackend;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.neluBackend.model.User;

public class Player {
	private final WebSocketSession session;
	private final int playerId;
	private User user;
	
	private boolean isHost;
	private boolean isClient;
	private Room room;
	
	public Player(int playerId, WebSocketSession session) {
		this.session = session;
		this.playerId = playerId;
		this.isClient = false;
		this.isHost = false;
		this.room = null;
	}
	
	public boolean getIsHost() {
		return isHost;
	}
	
	public boolean getIsClient() {
		return isClient;
	}
	
	public Room getRoom() {
		return room;
	}
	
	public void setIsHost(boolean isHost) {
		this.isHost = isHost;
	}
	public void setIsClient(boolean isClient) {
		this.isClient = isClient;
	}
	public void setRoom(Room room) {
		this.room = room;
	}
	
	public User getUser() {
		return user;
	}
	
	public void SetUser(User user) {
		this.user = user;
	}
	
	public int getPlayerId() {
		return playerId;
	}
	public WebSocketSession getSession() {
		return this.session;
	}
	public String getName() {
		if(user != null) {
			return this.user.getId();
		}
		return "";
	}

	public void sendMessage(String msg) throws Exception{
		this.session.sendMessage(new TextMessage(msg));
	}
}
