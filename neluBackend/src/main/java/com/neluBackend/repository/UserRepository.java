package com.neluBackend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.neluBackend.model.UserModel;

public interface UserRepository extends MongoRepository<UserModel, String> {
	
	@Override
	public List<UserModel> findAll();
	
}
