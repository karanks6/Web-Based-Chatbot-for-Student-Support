package com.student.chatbot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_logs")
public class ChatLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ChatSession session;

    @Column(nullable = false, length = 1000)
    private String userMessage;

    @Column(nullable = false, length = 2000)
    private String botResponse;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ChatLogStatus status = ChatLogStatus.ANSWERED;

    @Column(nullable = true)
    private Boolean isHelpful;

    @Builder.Default
    private boolean seenByStudent = true; // Default true, set to false when Admin replies
}
