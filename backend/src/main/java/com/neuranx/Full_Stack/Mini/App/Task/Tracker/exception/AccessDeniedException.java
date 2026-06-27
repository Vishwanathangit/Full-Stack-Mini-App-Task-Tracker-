package com.neuranx.Full_Stack.Mini.App.Task.Tracker.exception;

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
