package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.FeedbackDTO;
import net.planificateureventcampus.entities.Feedback;
import net.planificateureventcampus.mapper.FeedbackMapper;
import net.planificateureventcampus.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private FeedbackMapper feedbackMapper;

    public FeedbackDTO createFeedback(FeedbackDTO dto) {
        Feedback feedback = feedbackMapper.toEntity(dto);
        feedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(feedback);
    }

    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(feedbackMapper::toDto)
                .collect(Collectors.toList());
    }

    public FeedbackDTO getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback non trouvé avec ID: " + id));
        return feedbackMapper.toDto(feedback);
    }

    public List<FeedbackDTO> getFeedbacksByEvenement(Long evenementId) {
        return feedbackRepository.findByEvenementId(evenementId).stream()
                .map(feedbackMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getApprovedFeedbacks() {
        return feedbackRepository.findByApprouveTrue().stream()
                .map(feedbackMapper::toDto)
                .collect(Collectors.toList());
    }

    public FeedbackDTO approuverFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback non trouvé"));
        feedback.setApprouve(true);
        feedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(feedback);
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new RuntimeException("Feedback non trouvé");
        }
        feedbackRepository.deleteById(id);
    }

    public Double getNoteMoyenneByEvenement(Long evenementId) {
        return feedbackRepository.findNoteMoyenneByEvenement(evenementId);
    }
}