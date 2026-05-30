package com.student.chatbot.repository;

import com.student.chatbot.entity.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    List<ChatLog> findByUserIdOrderByTimestampDesc(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM ChatLog c WHERE c.status = com.student.chatbot.entity.ChatLogStatus.UNANSWERED OR c.botResponse LIKE 'I%sorry%'")
    List<ChatLog> findUnansweredLogs();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(c) FROM ChatLog c WHERE c.status = com.student.chatbot.entity.ChatLogStatus.UNANSWERED OR c.botResponse LIKE 'I%sorry%'")
    long countUnansweredLogs();

    List<ChatLog> findByStatus(com.student.chatbot.entity.ChatLogStatus status);

    long countByIsHelpfulTrue();

    long countByIsHelpfulFalse();

    long countByStatus(com.student.chatbot.entity.ChatLogStatus status);

    List<ChatLog> findBySessionIdOrderByTimestampAsc(Long sessionId);

    void deleteByUserId(Long userId);
}
