package org.personal.taskmanagement.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.personal.taskmanagement.auth.dto.AuthResponse;
import org.personal.taskmanagement.auth.dto.LoginRequest;
import org.personal.taskmanagement.auth.dto.RegisterRequest;
import org.personal.taskmanagement.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }
}