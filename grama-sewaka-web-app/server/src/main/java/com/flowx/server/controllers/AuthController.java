package com.flowx.server.controllers;

import com.flowx.server.models.User;
import com.flowx.server.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/signin")
    public ResponseEntity<?> signin(@RequestParam String email, @RequestParam String password) {
        try {
            return ResponseEntity.ok(authService.signin(email, password));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An internal error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        try {
            return ResponseEntity.ok(authService.signup(newUser));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An internal error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@PathVariable String email, @RequestBody User updateUser) {
        try {
            return ResponseEntity.ok(authService.update(email, updateUser));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An internal error occurred: " + e.getMessage());
        }
    }
}
