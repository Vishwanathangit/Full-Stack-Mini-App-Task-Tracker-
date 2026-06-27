package com.neuranx.Full_Stack.Mini.App.Task.Tracker.dto;

import com.neuranx.Full_Stack.Mini.App.Task.Tracker.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Role role;
}
