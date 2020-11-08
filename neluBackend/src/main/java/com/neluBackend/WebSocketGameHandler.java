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
		public final static String START_GAME = "START_GAME";
		public final static String RECEIVE_ENTITIES = "RECEIVE_ENTITIES";
		public final static String RECEIVE_ENEMY = "RECEIVE_ENEMY";
		public final static String END_GAME = "END_GAME";
	}

	private class BackEndEvents {
		public final static String LOGIN = "LOGIN";
		public final static String CREATE_ROOM = "CREATE_ROOM";
		public final static String JOIN_ROOM = "JOIN_ROOM";
		public final static String GET_PUBLIC_ROOMS = "GET_PUBLIC_ROOMS";
		public final static String LEAVE_ROOM = "LEAVE_ROOM";
		public final static String START_GAME = "START_GAME";
		public final static String SEND_ENTITIES = "SEND_ENTITIES";
		public final static String SEND_ENEMY = "SEND_ENEMY";
		public final static String END_GAME = "END_GAME";
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
				player.sendMessage(outMsg.toString());
				break;
			case BackEndEvents.CREATE_ROOM:
				outMsg = createRoom(inMsg, outMsg, player);
				player.sendMessage(outMsg.toString());
				break;
			case BackEndEvents.JOIN_ROOM:
				outMsg = joinRoom(inMsg, outMsg, player);
				player.sendMessage(outMsg.toString());
				break;
			case BackEndEvents.GET_PUBLIC_ROOMS:
				outMsg = getPublicRooms(inMsg, outMsg, player);
				player.sendMessage(outMsg.toString());
				break;
			case BackEndEvents.LEAVE_ROOM:
				connectionLost(player);
				break;
			case BackEndEvents.START_GAME:
				startGame(inMsg, outMsg, player);
				break;
			case BackEndEvents.SEND_ENTITIES:
				sendEntities(inMsg, outMsg, player);
				break;
			case BackEndEvents.SEND_ENEMY:
				sendEnemy(inMsg, outMsg, player);
				break;
			case BackEndEvents.END_GAME:
				endGame(inMsg, outMsg, player);
				break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message" + message.getPayload());
			e.printStackTrace(System.err);
		}
	}
	
	private void endGame(JsonNode inMsg, ObjectNode outMsg, Player player) throws Exception {
		Room room = player.getRoom();
		if(room != null) {
			Player host = room.getSlaveHost();
			Player client = room.getMasterClient();
			outMsg = mapper.treeToValue(inMsg, ObjectNode.class);
			outMsg.put("event", FrontEndEvents.END_GAME);
			if(host != null) {
				host.sendMessage(outMsg.toString());
			}
			if(client != null) {
				client.sendMessage(outMsg.toString());
			}
			room.stopGame();
		}
	}
	
	private void sendEnemy(JsonNode inMsg, ObjectNode outMsg, Player player) throws Exception {
		Room room = player.getRoom();
		if(room != null) {
			Player host = room.getSlaveHost();
			if(host != null) {
				outMsg = mapper.treeToValue(inMsg, ObjectNode.class);
				outMsg.put("event", FrontEndEvents.RECEIVE_ENEMY);
				host.sendMessage(outMsg.toString());
			}
		}
	}
	
	private void sendEntities(JsonNode inMsg, ObjectNode outMsg, Player player) throws Exception {
		Room room = player.getRoom();
		if(room != null) {
			Player client = room.getMasterClient();
			if(client != null) {
				outMsg = mapper.treeToValue(inMsg, ObjectNode.class);
				outMsg.put("event", FrontEndEvents.RECEIVE_ENTITIES);
				client.sendMessage(outMsg.toString());
			}
		}
	}
	
	private void startGame(JsonNode inMsg, ObjectNode outMsg, Player player) throws Exception {
		
		outMsg.put("event", FrontEndEvents.START_GAME);
		Room room = player.getRoom();
		Player client =  room.getMasterClient();
		if(client != null) {
			player.sendMessage(outMsg.toString());
			client.sendMessage(outMsg.toString());
			room.startGame();
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
		int enviroment = inMsg.get("enviroment").asInt();
		boolean isPrivate = inMsg.get("private").asBoolean();
		int lighting = inMsg.get("lighting").asInt();

		outMsg.put("event", FrontEndEvents.CREATE_ROOM);

		if (!playerAlreadyInRoom) {
			Room room = game.addRoom(new Room(roomId.incrementAndGet(), player, isPrivate, enviroment, lighting));
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
	private ObjectNode joinRoom(JsonNode inMsg, ObjectNode outMsg, Player player) throws Exception {

		boolean playerAlreadyInRoom = player.getRoom() != null;

		String hostName = inMsg.get("hostName").asText();

		outMsg.put("event", FrontEndEvents.JOIN_ROOM);

		if (!playerAlreadyInRoom && game.hasUser(hostName)) {
			
			Player host = game.getPlayer(hostName);
			Room hostRoom = host.getRoom();
			if (hostRoom != null && !hostRoom.hasStarted()) {
				hostRoom.setClient(player);
				//hostRoom.startGame();
				outMsg.put("room", hostRoom.getSlaveHost().getName());
				outMsg.put("enviroment", hostRoom.getEnviroment());
				outMsg.put("lighting", hostRoom.getLighting());
				
				//Indicar al host el nombre del cliente que se le ha conectado
				ObjectNode outMsgForHost = mapper.createObjectNode();
				outMsgForHost.put("event", FrontEndEvents.JOIN_ROOM);
				outMsgForHost.put("clientName", player.getName());
				host.sendMessage(outMsgForHost.toString());
				return outMsg;
			}
		}
		outMsg.put("room", "");
		return outMsg;
	}

	private ObjectNode getPublicRooms(JsonNode inMsg, ObjectNode outMsg, Player player) {
		outMsg.put("event", FrontEndEvents.GET_PUBLIC_ROOMS);

		Collection<Room> publicRooms = game.getPublicRooms();

		int size = 0;
		for (Room room : publicRooms) {
			outMsg.put("room" + size, room.getSlaveHost().getName());
			outMsg.put("enviroment" + size, room.getEnviroment());
			size++;
		}
		outMsg.put("numRooms", size);

		return outMsg;
	}

	private void connectionLost(Player player) throws Exception {
		

		ObjectNode outMsg = mapper.createObjectNode();
		outMsg.put("event", FrontEndEvents.CONNECTION_LOST);
		
		Room room = player.getRoom();
		if(room!= null) {
			if(room.started) {
				room.getMasterClient().sendMessage(outMsg.toString());
				room.getSlaveHost().sendMessage(outMsg.toString());
				//room.getMasterClient().setRoom(null);
				//room.getSlaveHost().setRoom(null);
				
				room.stopGame();
			} else {
				if(player.getIsClient()) {
					room.getSlaveHost().sendMessage(outMsg.toString());
					//room.getMasterClient().sendMessage(outMsg.toString());
					player.setIsClient(false);
					player.setIsHost(false);
					player.setRoom(null);
					room.setClient(null);
				} else if (player.getIsHost()) {
					//room.getSlaveHost().sendMessage(outMsg.toString());
					player.setIsClient(false);
					player.setIsHost(false);
					player.setRoom(null);
					Player client = room.getMasterClient();
					if(client != null) {
						client.sendMessage(outMsg.toString());
						client.setIsClient(false);
						client.setIsHost(false);
						client.setRoom(null);
						room.setClient(null);
					}
					room.stopGame();
					
				}
			}
			
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		Player player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
		game.removePlayer(player);
		connectionLost(player);
		Log("Player disconnected: " + player.getPlayerId());
	}
}
