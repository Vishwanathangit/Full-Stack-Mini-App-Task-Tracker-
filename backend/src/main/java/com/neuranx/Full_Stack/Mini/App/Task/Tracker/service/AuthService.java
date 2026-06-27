package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.LoginRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.RegisterRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Role;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.User;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();
        
        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        return userRepository.findByUsername(request.getUsername()).orElseThrow();
    }
}
