package com.neuranx.Full_Stack.Mini.App.Task.Tracker.controller;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.service.AuthService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
}
