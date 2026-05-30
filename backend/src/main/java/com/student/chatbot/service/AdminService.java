package com.student.chatbot.service;

import com.student.chatbot.dto.AdminStats;
import com.student.chatbot.repository.ChatLogRepository;
import com.student.chatbot.repository.FAQRepository;
import com.student.chatbot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ChatLogRepository chatLogRepository;
    private final FAQRepository faqRepository;
    private final com.student.chatbot.repository.ChatSessionRepository chatSessionRepository;

    public AdminStats getStats() {
        return AdminStats.builder()
                .totalUsers(userRepository.countByRole(com.student.chatbot.entity.Role.STUDENT))
                .totalInteractions(chatLogRepository.count())
                .totalFAQs(faqRepository.count())
                .thumbsUpCount(chatLogRepository.countByIsHelpfulTrue())
                .thumbsDownCount(chatLogRepository.countByIsHelpfulFalse())
                .pendingCount(chatLogRepository.countUnansweredLogs())
                .build();
    }

    public java.util.List<com.student.chatbot.entity.ChatLog> getUnansweredLogs() {
        return chatLogRepository.findUnansweredLogs();
    }

    public java.util.List<com.student.chatbot.entity.User> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != com.student.chatbot.entity.Role.ADMIN)
                .collect(java.util.stream.Collectors.toList());
    }

    // Simple DTO for interaction stats (Username + Count)
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class UserInteractionStat {
        private String username;
        private long interactionCount;
    }

    public java.util.List<UserInteractionStat> getUserInteractionStats() {
        java.util.List<com.student.chatbot.entity.User> users = userRepository.findAll();
        java.util.List<UserInteractionStat> stats = new java.util.ArrayList<>();

        for (com.student.chatbot.entity.User user : users) {
            if (user.getRole() == com.student.chatbot.entity.Role.ADMIN)
                continue;
            // This is N+1, but fine for small scale. For larger scale, use custom query.
            long count = chatLogRepository.findByUserIdOrderByTimestampDesc(user.getId()).size();
            stats.add(new UserInteractionStat(user.getUsername(), count));
        }
        return stats;
    }

    public void toggleUserStatus(Long userId) {
        com.student.chatbot.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long userId) {
        // First delete all chat logs (they depend on session and user)
        chatLogRepository.deleteByUserId(userId);

        // Then delete all chat sessions (they depend on user)
        chatSessionRepository.deleteByUserId(userId);

        // Finally delete the user
        userRepository.deleteById(userId);
    }
}
