package org.personal.taskmanagement.auth.service;

import lombok.RequiredArgsConstructor;
import org.personal.taskmanagement.auth.dto.AuthResponse;
import org.personal.taskmanagement.auth.dto.LoginRequest;
import org.personal.taskmanagement.auth.dto.RegisterRequest;
import org.personal.taskmanagement.security.JwtTokenProvider;
import org.personal.taskmanagement.user.model.User;
import org.personal.taskmanagement.user.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        User user = userService.getUserByEmail(loginRequest.getEmail());

        return new AuthResponse(jwt, mapUserToDto(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setFullName(registerRequest.getFullName());
        user.setRole(registerRequest.getRole());

        user = userService.createUser(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, mapUserToDto(user));
    }

    private AuthResponse.UserDto mapUserToDto(User user) {
        return new AuthResponse.UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }
}