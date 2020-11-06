package com.neluBackend;

import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.scheduling.annotation.Scheduled;

public class Room {
	
	
	private int id;
	private Player masterClient;
	private Player slaveHost;
	boolean started;
	boolean isPrivate;
	int enviroment;
	int lighting;
	
	
	private ScheduledFuture<?> task;
	
	public Room(int id, Player host, boolean isPrivate, int enviroment, int lighting) {
		this.id = id;
		this.slaveHost = host;
		this.lighting=lighting;
		this.enviroment=enviroment;
		this.slaveHost.setRoom(this);
		this.slaveHost.setIsHost(true);
		this.slaveHost.setIsClient(false);
		setPrivate(isPrivate);
	}
	
	public void setPrivate(boolean isPrivate) {
		this.isPrivate = isPrivate;
		if(isPrivate) {
			GameHandler.INSTANCE.removePublicRoom(this);
		} else {
			GameHandler.INSTANCE.addPublicRoom(this);
		}
	}
	
	public boolean isPrivate() {
		return isPrivate;
	}
	
	public Player getMasterClient() {
		return masterClient;
	}
	
	public Player getSlaveHost() {
		return slaveHost;
	}
	
	public boolean hasStarted() {
		return started;
	}
	
	public int getId() {
		return this.id;
	}
	
	public void setClient(Player client) {
		masterClient = client;
		masterClient.setIsClient(true);
		masterClient.setIsHost(false);
		masterClient.setRoom(this);
	}
	
	public void startGame() {
		
		if(!started) {
			started = true;
			task = GameHandler.scheduler.scheduleAtFixedRate(()->this.Update(), 0, GameHandler.TICK_DELAY, TimeUnit.SECONDS);
			Log("started");
		}
	}
	
	public void stopGame() {
		if(started) {
			task.cancel(true);
			masterClient.setIsClient(false);
			masterClient.setIsHost(false);
			slaveHost.setIsClient(false);
			slaveHost.setIsHost(false);
			masterClient.setRoom(null);
			slaveHost.setRoom(null);
			masterClient = null;
			slaveHost = null;
			started = false;
			isPrivate = true;
			Log("stopped");
		}
		
		GameHandler.INSTANCE.removeRoom(this);
	}
	
	public void Update() {
		
		
	}
	
	private static boolean DEBUG_MODE = true;
	private void Log(String msg) {
		if (DEBUG_MODE) {
			System.out.println("[ROOM " + id + "] " + msg);
		}
	}
	
}
