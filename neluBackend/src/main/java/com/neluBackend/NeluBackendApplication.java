package com.neluBackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.neluBackend.controller.UserController;
import com.neluBackend.model.UserModel;
import com.neluBackend.repository.UserRepository;



@SpringBootApplication
//@EnableMongoRepositories(basePackageClasses=UserRepository.class)
public class NeluBackendApplication implements CommandLineRunner {

	@Autowired
	private UserRepository repository;
	
	public static void main(String[] args) {
		SpringApplication.run(NeluBackendApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {
		repository.save(new UserModel(2, "Alice", 0,0));
	}
	
	
}
