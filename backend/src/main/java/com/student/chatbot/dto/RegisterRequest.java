package com.student.chatbot.dto;

import com.student.chatbot.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private Role role; // Optional, defaults to STUDENT if null usually, but we'll see
}
