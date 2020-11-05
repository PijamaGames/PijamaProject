package com.neluBackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="users")
public class User {

	
	//private int id;
	@Id
	private String id;
	private int controlPoint;
	private int points;
	
	public User(String id, int controlPoint, int points) {
		//this.id= id;
		this.id = id;
		this.controlPoint = controlPoint;
		this.points = points;
	}
	
	/*public int getId() {
		return id;
	}*/
	public String getId() {
		return id;
	}
	public int getControlPoint() {
		return controlPoint;
	}
	public int getPoints() {
		return points;
	}
	
	/*public void setId(int _id) {
		id = _id;
	}*/
	public void setId(String _id) {
		id = _id;
	}
	public void setControlPoint(int _controlPoint) {
		controlPoint = _controlPoint;
	}
	public void setPoints(int _points) {
		points = _points;
	}
	
}
