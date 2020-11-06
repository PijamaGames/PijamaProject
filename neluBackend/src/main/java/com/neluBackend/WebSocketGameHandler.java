package com.neluBackend;

import java.util.Collection;
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
import com.neluBackend.model.User;
import com.neluBackend.repository.UserRepository;

public class WebSocketGameHandler extends TextWebSocketHandler {

	private class FrontEndEvents {
		public final static String LOGIN = "LOGIN";
		public final static String CREATE_ROOM = "CREATE_ROOM";
		public final static String JOIN_ROOM = "JOIN_ROOM";
		public final static String GET_PUBLIC_ROOMS = "GET_PUBLIC_ROOMS";
		public final static String CONNECTION_LOST = "CONNECTION_LOST";
	}

	private class BackEndEvents {
		public final static String LOGIN = "LOGIN";
		public final static String CREATE_ROOM = "CREATE_ROOM";
		public final static String JOIN_ROOM = "JOIN_ROOM";
		public final static String GET_PUBLIC_ROOMS = "GET_PUBLIC_ROOMS";
	}

	private GameHandler game = GameHandler.INSTANCE;
	private AtomicInteger playerId = new AtomicInteger(0);
	private AtomicInteger roomId = new AtomicInteger(0);
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
				outMsg = login(inMsg, outMsg, player);
				break;
			case BackEndEvents.CREATE_ROOM:
				outMsg = createRoom(inMsg, outMsg, player);
				break;
			case BackEndEvents.JOIN_ROOM:
				outMsg = joinRoom(inMsg, outMsg, player);
				break;
			case BackEndEvents.GET_PUBLIC_ROOMS:
				outMsg = getPublicRooms(inMsg, outMsg, player);
				break;
			}

			player.sendMessage(outMsg.toString());

		} catch (Exception e) {
			System.err.println("Exception processing message" + message.getPayload());
			e.printStackTrace(System.err);
		}
	}

	private ObjectNode login(JsonNode inMsg, ObjectNode outMsg, Player player) {
		String userName = inMsg.get("name").asText();
		boolean hasUser = game.hasUser(userName);

		outMsg.put("event", FrontEndEvents.LOGIN);
		outMsg.put("userAvaible", !hasUser);

		Log("User " + userName + " in use: " + hasUser);
		if (!hasUser) {
			Optional<User> userOpt = repository.findById(userName);
			boolean userExists = userOpt.isPresent();

			User user;
			if (userExists) {
				user = userOpt.get();
			} else {
				user = repository.save(new User(userName, 0, 0));
			}
			player.SetUser(user);
			game.addPlayer(player);

			outMsg.put("controlPoint", user.getControlPoint());
			outMsg.put("points", user.getPoints());
		}

		return outMsg;
	}

	private ObjectNode createRoom(JsonNode inMsg, ObjectNode outMsg, Player player) {
		boolean playerAlreadyInRoom = player.getRoom() != null;
		int  enviroment= inMsg.get("enviroment").asInt();
		boolean  isPrivate= inMsg.get("private").asBoolean();
		int  lighting= inMsg.get("lighting").asInt();
		
		outMsg.put("event", FrontEndEvents.CREATE_ROOM);

		if (!playerAlreadyInRoom) {
			Room room = game.addRoom(new Room(roomId.incrementAndGet(), player,isPrivate,enviroment,lighting));
			outMsg.put("room", room.getId());
		} else {
			outMsg.put("room", -1);
		}

		return outMsg;
	}

	/*
	 * Si el cliente no está en una room y el host sí y su partida no ha empezado,
	 * une al cliente a la partida del host
	 */
	private ObjectNode joinRoom(JsonNode inMsg, ObjectNode outMsg, Player player) {

		boolean playerAlreadyInRoom = player.getRoom() != null;

		String hostName = inMsg.get("hostName").asText();

		outMsg.put("event", FrontEndEvents.JOIN_ROOM);

		if (!playerAlreadyInRoom && game.hasUser(hostName)) {
			Player host = game.getPlayer(hostName);
			Room hostRoom = host.getRoom();
			if (hostRoom != null && !hostRoom.hasStarted()) {
				hostRoom.setClient(player);
				hostRoom.startGame();
				outMsg.put("room", hostRoom.getId());
				return outMsg;
			}
		}
		outMsg.put("room", -1);
		return outMsg;
	}

	private ObjectNode getPublicRooms(JsonNode inMsg, ObjectNode outMsg, Player player) {
		outMsg.put("event", FrontEndEvents.GET_PUBLIC_ROOMS);

		Collection<Room> publicRooms = game.getPublicRooms();

		int size = 0;
		for (Room room : publicRooms) {
			outMsg.put("room" + size, room.getSlaveHost().getName());
			outMsg.put("roomId" + size, room.getId());
			size++;
		}
		outMsg.put("numRooms", size);

		return outMsg;
	}

	private void connectionLost(Player player) throws Exception {
		game.removePlayer(player);

		Room room = player.getRoom();
		if (room != null && room.getMasterClient() != null && room.getSlaveHost() != null) {
			ObjectNode outMsg = mapper.createObjectNode();
			outMsg.put("event", FrontEndEvents.CONNECTION_LOST);
			if (player.getIsHost()) {
				room.getMasterClient().sendMessage(outMsg.asText());
			} else {
				room.getSlaveHost().sendMessage(outMsg.asText());
			}

			room.stopGame();
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		Player player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
		connectionLost(player);
		Log("Player disconnected: " + player.getPlayerId());
	}
}
