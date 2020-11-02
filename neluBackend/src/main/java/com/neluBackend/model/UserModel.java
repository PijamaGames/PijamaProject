package com.neluBackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

@Document(collection="users")
public class UserModel {

	@Id
	private int id;
	private String name;
	private int controlPoint;
	private int points;
}
