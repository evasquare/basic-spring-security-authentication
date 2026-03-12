package com.evasquare.jwt_authentication.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evasquare.jwt_authentication.entity.User;
import com.evasquare.jwt_authentication.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> userDtos = users.stream()
                .map(user -> Map.<String, Object>of(
                "id", user.getId(),
                "email", user.getUsername(),
                "roles", user.getRoles(),
                "enabled", user.isEnabled()
        ))
                .toList();

        return ResponseEntity.ok(userDtos);
    }
}
