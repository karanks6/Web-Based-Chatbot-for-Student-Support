package com.student.chatbot.controller;

import com.student.chatbot.dto.ChatRequest;
import com.student.chatbot.dto.ChatResponse;
import com.student.chatbot.entity.ChatLog;
import com.student.chatbot.entity.User;
import com.student.chatbot.repository.UserRepository;
import com.student.chatbot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<com.student.chatbot.entity.ChatSession> startSession(@RequestBody ChatRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(chatService.createSession(request.getCategory(), user));
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        User user = getCurrentUser();
        return ResponseEntity.ok(chatService.processMessage(request.getMessage(), request.getSessionId(), user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatLog>> getHistory() {
        User user = getCurrentUser();
        return ResponseEntity.ok(chatService.getUserHistory(user));
    }

    @PostMapping("/reply/{logId}")
    public ResponseEntity<Void> replyToLog(@PathVariable Long logId,
            @RequestBody com.student.chatbot.dto.ReplyRequest request) {
        // ideally check if user is admin
        chatService.replyToLog(logId, request.getReply());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/feedback/{logId}")
    public ResponseEntity<Void> updateFeedback(@PathVariable Long logId, @RequestParam boolean helpful) {
        chatService.updateFeedback(logId, helpful);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<com.student.chatbot.entity.ChatSession>> getUserSessions() {
        return ResponseEntity.ok(chatService.getUserSessions(getCurrentUser()));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<List<ChatLog>> getSessionMessages(@PathVariable Long sessionId) {
        // Ensure user owns session if necessary, but for now open
        return ResponseEntity.ok(chatService.getSessionMessages(sessionId));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<ChatLog>> getNotifications() {
        return ResponseEntity.ok(chatService.getStudentNotifications(getCurrentUser()));
    }

    @PutMapping("/notifications/{logId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long logId) {
        chatService.markAsRead(logId);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("User not authenticated");
    }
}
