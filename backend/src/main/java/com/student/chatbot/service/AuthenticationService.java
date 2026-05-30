package com.student.chatbot.service;

import com.student.chatbot.dto.AuthResponse;
import com.student.chatbot.dto.LoginRequest;
import com.student.chatbot.dto.RegisterRequest;
import com.student.chatbot.entity.Role;
import com.student.chatbot.entity.User;
import com.student.chatbot.repository.UserRepository;
import com.student.chatbot.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final CustomUserDetailsService customUserDetailsService;

        public AuthResponse register(RegisterRequest request) {
                var user = User.builder()
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                                .build();

                repository.save(user); // Handle duplicate username exception? For now let it 500 or validation

                // We need UserDetails to generate token.
                // Our CustomUserDetailsService converts User to UserDetails
                var userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());

                var jwtToken = jwtService.generateToken(userDetails);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .fullName(user.getFullName())
                                .role(user.getRole())
                                .build();
        }

        public AuthResponse authenticate(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));
                var user = repository.findByUsername(request.getUsername())
                                .orElseThrow();
                user.setLastLogin(java.time.LocalDateTime.now());
                repository.save(user);

                var userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());
                var jwtToken = jwtService.generateToken(userDetails);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .fullName(user.getFullName())
                                .role(user.getRole())
                                .build();
        }
}
