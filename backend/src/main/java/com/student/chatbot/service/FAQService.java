package com.student.chatbot.service;

import com.student.chatbot.entity.FAQ;
import com.student.chatbot.repository.FAQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FAQService {

    private final FAQRepository repository;

    public List<FAQ> getAllFAQs() {
        return repository.findAll();
    }

    public FAQ createFAQ(FAQ faq) {
        return repository.save(faq);
    }

    public FAQ updateFAQ(Long id, FAQ updatedFAQ) {
        return repository.findById(id)
                .map(faq -> {
                    faq.setQuestion(updatedFAQ.getQuestion());
                    faq.setAnswer(updatedFAQ.getAnswer());
                    faq.setKeywords(updatedFAQ.getKeywords());
                    faq.setCategory(updatedFAQ.getCategory());
                    return repository.save(faq);
                })
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
    }

    public void deleteFAQ(Long id) {
        repository.deleteById(id);
    }

    // Helper to search (simple matching)
    public List<FAQ> getFAQs() {
        return repository.findAll();
    }
}
