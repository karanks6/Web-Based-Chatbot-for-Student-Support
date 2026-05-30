package com.student.chatbot.service;

import com.student.chatbot.dto.ChatResponse;
import com.student.chatbot.entity.ChatLog;
import com.student.chatbot.entity.ChatLogStatus;
import com.student.chatbot.entity.FAQ;
import com.student.chatbot.entity.User;
import com.student.chatbot.repository.ChatLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final FAQService faqService;
    private final ChatLogRepository chatLogRepository;
    private final com.student.chatbot.repository.ChatSessionRepository chatSessionRepository;

    public com.student.chatbot.entity.ChatSession createSession(String category, User user) {
        com.student.chatbot.entity.ChatSession session = com.student.chatbot.entity.ChatSession.builder()
                .user(user)
                .category(category)
                .title("Support: " + category)
                .build();
        return chatSessionRepository.save(session);
    }

    public ChatResponse processMessage(String userMessage, Long sessionId, User user) {
        com.student.chatbot.entity.ChatSession session = null;
        if (sessionId != null) {
            session = chatSessionRepository.findById(sessionId).orElse(null);
        }

        List<FAQ> faqs = faqService.getAllFAQs();
        String bestAnswer = findBestAnswer(userMessage, faqs, session);

        ChatLogStatus status = ChatLogStatus.ANSWERED;
        if (bestAnswer.startsWith("I'm sorry, I couldn't find an answer")) {
            status = ChatLogStatus.UNANSWERED;
        }

        if (session != null) {
            session.setUpdatedAt(LocalDateTime.now());
            chatSessionRepository.save(session);
        }

        // Log the interaction
        ChatLog log = ChatLog.builder()
                .user(user)
                .session(session)
                .userMessage(userMessage)
                .botResponse(bestAnswer)
                .timestamp(LocalDateTime.now())
                .status(status)
                .build();
        chatLogRepository.save(log);

        return ChatResponse.builder()
                .response(bestAnswer)
                .logId(log.getId())
                .build();
    }

    private String findBestAnswer(String message, List<FAQ> faqs, com.student.chatbot.entity.ChatSession session) {
        String lowerMessage = message.toLowerCase();
        FAQ bestFaq = null;
        int maxMatches = 0;

        String sessionCategory = (session != null) ? session.getCategory() : null;

        for (FAQ faq : faqs) {
            // STRICT FILTERING: If session has a category, skip FAQs that don't match it.
            if (sessionCategory != null && !sessionCategory.equalsIgnoreCase("General")
                    && !sessionCategory.equalsIgnoreCase(faq.getCategory())) {
                continue;
            }

            int matches = 0;

            if (faq.getKeywords() != null && !faq.getKeywords().trim().isEmpty()) {
                String[] keywords = faq.getKeywords().toLowerCase().split(",\\s*");
                for (String keyword : keywords) {
                    if (!keyword.trim().isEmpty() && lowerMessage.contains(keyword.trim())) {
                        matches++;
                    }
                }
            }

            // Also match strictly on question text overlapping
            if (lowerMessage.contains(faq.getQuestion().toLowerCase())) {
                matches += 2;
            }

            if (matches > maxMatches) {
                maxMatches = matches;
                bestFaq = faq;
            }
        }

        if (bestFaq != null && maxMatches > 0) {
            return bestFaq.getAnswer();
        } else {
            return "I'm sorry, I couldn't find an answer. Your query has been logged and you will be notified once support responds, or you can try asking differently.";
        }
    }

    public List<ChatLog> getUserHistory(User user) {
        return chatLogRepository.findByUserIdOrderByTimestampDesc(user.getId());
    }

    public List<ChatLog> getUnansweredLogs() {
        return chatLogRepository.findByStatus(ChatLogStatus.UNANSWERED);
    }

    public void replyToLog(Long logId, String reply) {
        ChatLog log = chatLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        log.setBotResponse(reply);
        log.setStatus(ChatLogStatus.ANSWERED);
        log.setSeenByStudent(false); // Mark as unread for student
        chatLogRepository.save(log);
    }

    public List<ChatLog> getStudentNotifications(User user) {
        return chatLogRepository.findAll().stream()
                .filter(log -> log.getUser().getId().equals(user.getId())
                        && !log.isSeenByStudent()
                        && log.getStatus() == ChatLogStatus.ANSWERED)
                .collect(java.util.stream.Collectors.toList());
        // Optimize: Use repo method findByUserIdAndSeenByStudentFalseAndStatus(id,
        // ANSWERED)
    }

    public void markAsRead(Long logId) {
        ChatLog log = chatLogRepository.findById(logId).orElse(null);
        if (log != null) {
            log.setSeenByStudent(true);
            chatLogRepository.save(log);
        }
    }

    public void updateFeedback(Long logId, boolean isHelpful) {
        ChatLog log = chatLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        log.setIsHelpful(isHelpful);
        chatLogRepository.save(log);
    }

    public List<com.student.chatbot.entity.ChatSession> getUserSessions(User user) {
        return chatSessionRepository.findSessionsWithLogsByUserId(user.getId());
    }

    public List<ChatLog> getSessionMessages(Long sessionId) {
        // Assuming ChatLogRepository has a method to find by session id or we filter
        // manually if not present
        // Best to add it to repository for performance.
        // For now, let's assume we added it or add it to repo in next step if needed.
        // Actually, let's check repo again. I did not add it to repo yet.
        // I will use a custom query or strict naming.
        // Let's rely on JPA naming: findBySessionIdOrderByTimestampAsc
        return chatLogRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
}
