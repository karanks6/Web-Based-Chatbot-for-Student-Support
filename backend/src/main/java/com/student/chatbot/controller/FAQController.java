package com.student.chatbot.controller;

import com.student.chatbot.entity.FAQ;
import com.student.chatbot.service.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FAQController {

    private final FAQService service;

    @GetMapping
    public ResponseEntity<List<FAQ>> getAllFAQs() {
        return ResponseEntity.ok(service.getAllFAQs());
    }

    @PostMapping
    public ResponseEntity<FAQ> createFAQ(@RequestBody FAQ faq) {
        return ResponseEntity.ok(service.createFAQ(faq));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FAQ> updateFAQ(@PathVariable Long id, @RequestBody FAQ faq) {
        return ResponseEntity.ok(service.updateFAQ(id, faq));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFAQ(@PathVariable Long id) {
        service.deleteFAQ(id);
        return ResponseEntity.noContent().build();
    }
}
