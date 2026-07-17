package com.dsms.backend.controller;

import com.dsms.backend.domain.User;
import com.dsms.backend.dto.UserDto;
import com.dsms.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto dto) {
        try {
            User user = userService.createUser(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", user
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", Map.of("message", e.getMessage())
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", users
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", user
        ));
    }
}
