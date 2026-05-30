package com.student.chatbot.repository;

import com.student.chatbot.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    // Basic CRUD is provided
    // We might add methods to search by keywords later?
    // For now, we will do in-memory filtering or simple contains query in service
}
