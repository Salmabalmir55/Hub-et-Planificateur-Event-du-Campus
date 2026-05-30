package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.entities.Feedback;
import net.planificateureventcampus.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ApiResponseDTO.success(feedbackRepository.findAll()));
    }

    @GetMapping("/evenement/{evenementId}")
    public ResponseEntity<?> getByEvenement(@PathVariable Long evenementId) {
        List<Feedback> feedbacks = feedbackRepository.findByEvenementId(evenementId);
        return ResponseEntity.ok(ApiResponseDTO.success(feedbacks));
    }

    @GetMapping("/approuves")
    public ResponseEntity<?> getApprouves() {
        List<Feedback> feedbacks = feedbackRepository.findByApprouveTrue();
        return ResponseEntity.ok(ApiResponseDTO.success(feedbacks));
    }
}