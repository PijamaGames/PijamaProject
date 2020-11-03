package com.neluBackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="users")
public class UserModel {

	@Id
	private int id;
	private String name;
	private int controlPoint;
	private int points;
	
	public UserModel(int id, String name, int controlPoint, int points) {
		this.id= id;
		this.name = name;
		this.controlPoint = controlPoint;
		this.points = points;
	}
	
	public int getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public int getControlPoint() {
		return controlPoint;
	}
	public int getPoints() {
		return points;
	}
	
	public void setId(int _id) {
		id = _id;
	}
	public void setName(String _name) {
		name = _name;
	}
	public void setControlPoint(int _controlPoint) {
		controlPoint = _controlPoint;
	}
	public void setPoints(int _points) {
		points = _points;
	}
	
}
