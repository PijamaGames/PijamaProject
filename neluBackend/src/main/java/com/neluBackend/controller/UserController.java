package com.neluBackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neluBackend.model.UserModel;
import com.neluBackend.repository.UserRepository;


@RestController
public class UserController {

	@Autowired
	private UserRepository repository;
	
	@PostMapping("/addBook")
	public String SaveUser(UserModel user) {
		repository.save(user);
		return "Added user: " + user.toString();
	}
	
	@GetMapping("/findAllUsers")
	public List<UserModel> getUsers(){
		return repository.findAll();
	}
	
	@GetMapping("/findUser/{id}")
	public Optional<UserModel> getUser(@PathVariable int id){
		return repository.findById(id);
	}
	
	@DeleteMapping("/delete/{id}")
	public String deleteUser(@PathVariable int id) {
		repository.deleteById(id);
		return "user deleted with id: " + id;
	}
}
