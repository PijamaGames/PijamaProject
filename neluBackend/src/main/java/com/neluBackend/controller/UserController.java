package com.neluBackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.neluBackend.model.UserModel;
import com.neluBackend.repository.UserRepository;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserRepository repository;
	
	@PostMapping("/addUser")
	public String SaveUser(@RequestBody String userName) {
		Optional<UserModel> auxUser = repository.findById(userName);
		if(auxUser.isPresent()) {
			return "FAILURE";
		} else {
			UserModel user = new UserModel(userName,0,0);
			repository.save(user);
			return "SUCCESS";
		}
	}
	
	@PutMapping("/putUser")
	public String UpdateUser(@RequestBody UserModel user) {
		if(getUser(user.getId()) != null) {
			repository.save(user);
			return "Updated user: " + user.getId();
		} else {
			return "USER DOES NOT EXIST";
		}
	}
	
	@GetMapping("/findAllUsers")
	public List<UserModel> getUsers(){
		return repository.findAll();
	}
	
	@GetMapping("/findUser/{id}")
	public Optional<UserModel> getUser(@PathVariable String id){
		System.out.println(repository.findById(id).get().getId());
		return repository.findById(id);
	}
	
	@DeleteMapping("/delete/{id}")
	public String deleteUser(@PathVariable String id) {
		repository.deleteById(id);
		return "user deleted: " + id;
	}
}
