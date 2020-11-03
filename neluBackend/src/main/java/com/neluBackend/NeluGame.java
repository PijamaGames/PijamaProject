package com.neluBackend;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.neluBackend.model.UserModel;
import com.neluBackend.repository.UserRepository;

public class NeluGame {
	
	

	public final static NeluGame INSTANCE = new NeluGame();
	
	public final static int FPS = 30;
	public final static long TICK_DELAY = 1000/FPS;
	//public final static boolean DEBUG_MODE = true;
	
	//ObjectMapper mapper = new ObjectMapper();
	
	//private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	
	private Map<String, Player> players = new ConcurrentHashMap<>();
	
	public void AddPlayer(Player player) {
		UserModel user = player.getUser();
		if(user != null) {
			players.put(user.getId(), player);
		}
	}
	
	public void RemovePlayer(Player player) {
		UserModel user = player.getUser();
		if(user != null) {
			players.remove(user.getId());
		}
	}
	
	public boolean HasPlayer(Player player) {
		UserModel user = player.getUser();
		if(user != null) {
			return players.containsKey(user.getId());
		}
		return false;
	}
	
	public boolean HasUser(String userName) {
		return players.containsKey(userName);
	}
	
}
