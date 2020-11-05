package com.neluBackend;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neluBackend.model.User;
import com.neluBackend.repository.UserRepository;

public class GameHandler {

	public final static GameHandler INSTANCE = new GameHandler();
	
	public final static int FPS = 30;
	public final static long TICK_DELAY = 1000/FPS;
	//public final static boolean DEBUG_MODE = true;
	
	//ObjectMapper mapper = new ObjectMapper();
	
	private final static int THREAD_POOL_SIZE = 1;
	public static ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(THREAD_POOL_SIZE);
	
	private Map<String, Player> players = new ConcurrentHashMap<>();
	private Map<Integer, Room> rooms = new ConcurrentHashMap<>();
	private Map<Integer, Room> publicRooms = new ConcurrentHashMap<>();
	
	public Room addRoom(Room room) {
		rooms.put(room.getId(), room);
		return room;
	}
	
	public Room addPublicRoom(Room room) {
		publicRooms.put(room.getId(), room);
		return room;
	}
	
	public Room removeRoom(Room room) {
		rooms.remove(room.getId());
		return room;
	}
	
	public Room removePublicRoom(Room room) {
		publicRooms.remove(room.getId());
		return room;
	}
	
	public Collection<Room> getPublicRooms() {
		return publicRooms.values();
	}
	
	public Player addPlayer(Player player) {
		User user = player.getUser();
		if(user != null) {
			players.put(user.getId(), player);
		}
		return player;
	}
	
	public Player removePlayer(Player player) {
		User user = player.getUser();
		if(user != null) {
			players.remove(user.getId());
		}
		return player;
	}
	
	public Player getPlayer(String userName) {
		return players.get(userName);
	}
	
	public boolean hasPlayer(Player player) {
		User user = player.getUser();
		if(user != null) {
			return players.containsKey(user.getId());
		}
		return false;
	}
	
	public boolean hasUser(String userName) {
		return players.containsKey(userName);
	}
}
