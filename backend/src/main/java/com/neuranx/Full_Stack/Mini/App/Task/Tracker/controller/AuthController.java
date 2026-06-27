package com.neuranx.Full_Stack.Mini.App.Task.Tracker.controller;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.AuthResponse;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.LoginRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto.RegisterRequest;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.User;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.security.JwtUtil;
import com.neuranx.Full_Stack.Mini.App.Task.Tracker.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    private void setJwtCookie(HttpServletResponse response, String token, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token != null ? token : "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        try {
            User user = authService.register(request);
            String token = jwtUtil.generateToken(user);
            setJwtCookie(response, token, jwtExpirationMs / 1000);
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(user.getUsername(), user.getRole()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        User user = authService.login(request);
        String token = jwtUtil.generateToken(user);
        setJwtCookie(response, token, jwtExpirationMs / 1000);
        return ResponseEntity.ok(new AuthResponse(user.getUsername(), user.getRole()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        setJwtCookie(response, "", 0);
        return ResponseEntity.ok("Logged out successfully");
    }
}
