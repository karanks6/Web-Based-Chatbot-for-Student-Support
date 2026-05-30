package com.student.chatbot.config;

import com.student.chatbot.entity.Role;
import com.student.chatbot.entity.User;
import com.student.chatbot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Admin Logic
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Admin")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Default Admin user created: admin / admin123");
        } else {
            User admin = userRepository.findByUsername("admin").get();
            if (!admin.isActive()) {
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("Existing Admin user activated.");
            }
        }

    }
}
