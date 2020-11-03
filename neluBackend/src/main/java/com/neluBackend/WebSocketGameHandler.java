package com.neluBackend;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.neluBackend.model.UserModel;
import com.neluBackend.repository.UserRepository;

public class WebSocketGameHandler extends TextWebSocketHandler {

	private class FrontEndEvents {
		public final static String LOGIN = "LOGIN";
	}
	
	private class BackEndEvents {
		public final static String LOGIN = "LOGIN";
	}
	
	private NeluGame game = NeluGame.INSTANCE;
	private AtomicInteger playerId = new AtomicInteger(0);
	private static final String PLAYER_ATTRIBUTE = "PLAYER";
	private static final boolean DEBUG_MODE = true;
	private ObjectMapper mapper = new ObjectMapper();
	
	@Autowired
	private UserRepository repository;

	private static void Log(String msg) {
		if (DEBUG_MODE) {
			System.out.println("[WS HANDLER] " + msg);
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player = new Player(playerId.incrementAndGet(), session);
		session.getAttributes().put(PLAYER_ATTRIBUTE, player);
		
		Log("New player connected: " + player.getPlayerId());

		// player.sendMessage("CONNECTION ESTABLISHED");

	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			JsonNode inMsg = mapper.readTree(message.getPayload());
			Player player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);

			ObjectNode outMsg = mapper.createObjectNode();

			String event = inMsg.get("event").asText();
			Log(event);
			
			switch (event) {
			case BackEndEvents.LOGIN:
				String userName = inMsg.get("name").asText();
				boolean hasUser = game.HasUser(userName);
				
				outMsg.put("event", FrontEndEvents.LOGIN);
				outMsg.put("userAvaible", !hasUser);
				
				Log("User "+userName+" in use: " + hasUser);
				if(!hasUser) {
					Optional<UserModel> userOpt =  repository.findById(userName);
					boolean userExists = userOpt.isPresent();
					
					UserModel user;
					if(userExists) {
						user = userOpt.get();
					} else {
						user = repository.save(new UserModel(userName, 0, 0));
					}
					player.SetUser(user);
					game.AddPlayer(player);
					
					outMsg.put("controlPoint", user.getControlPoint());
					outMsg.put("points", user.getPoints());
				}
				player.sendMessage(outMsg.toString());
				break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message" + message.getPayload());
			e.printStackTrace(System.err);
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		Player player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
		game.RemovePlayer(player);
		Log("Player disconnected: " + player.getPlayerId());
	}

}
