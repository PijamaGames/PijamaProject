package com.neluBackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.neluBackend.model.User;
import com.neluBackend.repository.UserRepository;
import com.mongodb.client.MongoClient;



@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserRepository repository;
	
	@PostMapping("/addUser")
	public String SaveUser(@RequestBody String userName) {
		Optional<User> auxUser = repository.findById(userName);
		if(auxUser.isPresent()) {
			return "FAILURE";
		} else {
			User user = new User(userName,0,0);
			repository.save(user);
			return "SUCCESS";
		}
	}
	
	@PutMapping("/putUser")
	public String UpdateUser(@RequestBody User user) {
		if(getUser(user.getId()) != null) {
			repository.save(user);
			return "Updated user: " + user.getId();
		} else {
			return "USER DOES NOT EXIST";
		}
	}
	
	@GetMapping("/findAllUsers")
	public List<User> getUsers(){
		return repository.findAll();
	}

	@GetMapping("/ranking")
	public List<User> ranking(){
		List<User> users = repository.findAll();
		users.sort((a,b)->{
			return Integer.compare(-a.getPoints(), -b.getPoints());
		});
		return users;
	}
	
	@GetMapping("/findUser/{id}")
	public Optional<User> getUser(@PathVariable String id){
		System.out.println(repository.findById(id).get().getId());
		return repository.findById(id);
	}
	
	@DeleteMapping("/delete/{id}")
	public String deleteUser(@PathVariable String id) {
		repository.deleteById(id);
		return "user deleted: " + id;
	}
}
