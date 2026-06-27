package com.neuranx.Full_Stack.Mini.App.Task.Tracker.service;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.LoginRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.RegisterRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Role;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.User;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldSaveUser_WhenUsernameNotTaken() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        
        User savedUser = new User();
        savedUser.setUsername("testuser");
        savedUser.setRole(Role.ROLE_USER);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals(Role.ROLE_USER, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrow_WhenUsernameTaken() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        User existingUser = new User();
        existingUser.setUsername("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldReturnUser_WhenCredentialsValid() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        User user = new User();
        user.setUsername("testuser");
        user.setRole(Role.ROLE_USER);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act
        User response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals(Role.ROLE_USER, response.getRole());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
