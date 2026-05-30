package com.student.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStats {
    private long totalUsers;
    private long totalInteractions;
    private long totalFAQs;
    private long thumbsUpCount;
    private long thumbsDownCount;
    private long pendingCount;
}
