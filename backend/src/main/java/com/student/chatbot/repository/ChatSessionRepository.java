package com.student.chatbot.repository;

import com.student.chatbot.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT s FROM ChatSession s JOIN ChatLog l ON l.session.id = s.id WHERE s.user.id = :userId ORDER BY s.updatedAt DESC")
    List<ChatSession> findSessionsWithLogsByUserId(Long userId);

    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId);

    void deleteByUserId(Long userId);
}
