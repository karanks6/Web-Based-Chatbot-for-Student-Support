package com.student.chatbot.controller;

import com.student.chatbot.dto.AdminStats;
import com.student.chatbot.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    @GetMapping("/unanswered")
    public ResponseEntity<java.util.List<com.student.chatbot.entity.ChatLog>> getUnansweredQueries() {
        return ResponseEntity.ok(service.getUnansweredLogs());
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<com.student.chatbot.entity.User>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/interactions/summary")
    public ResponseEntity<java.util.List<AdminService.UserInteractionStat>> getInteractionStats() {
        return ResponseEntity.ok(service.getUserInteractionStats());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        service.toggleUserStatus(id);
        return ResponseEntity.ok("User status updated");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }
}
