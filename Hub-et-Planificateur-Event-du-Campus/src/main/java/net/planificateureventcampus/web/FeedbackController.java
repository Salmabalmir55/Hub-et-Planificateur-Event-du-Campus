package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.FeedbackDTO;
import net.planificateureventcampus.entities.Feedback;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.mapper.FeedbackMapper;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.FeedbackRepository;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import net.planificateureventcampus.security.UserDetailsImpl;
import net.planificateureventcampus.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

  @Autowired
  private FeedbackRepository feedbackRepository;

  @Autowired
  private FeedbackMapper feedbackMapper;

  @Autowired
  private EvenementRepository evenementRepository;

  @Autowired
  private UtilisateurRepository utilisateurRepository;

  @Autowired
  private FeedbackService feedbackService;  // ← Injecter le service

  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<FeedbackDTO>>> getAll() {
    List<Feedback> feedbacks = feedbackRepository.findAll();
    List<FeedbackDTO> dtos = feedbacks.stream()
      .map(feedbackMapper::toDto)
      .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponseDTO.success(dtos));
  }

  @GetMapping("/evenement/{evenementId}")
  public ResponseEntity<ApiResponseDTO<List<FeedbackDTO>>> getByEvenement(@PathVariable Long evenementId) {
    List<Feedback> feedbacks = feedbackRepository.findByEvenementId(evenementId);
    List<FeedbackDTO> feedbackDTOs = feedbacks.stream()
      .map(feedbackMapper::toDto)
      .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponseDTO.success(feedbackDTOs));
  }

  @GetMapping("/approuves")
  public ResponseEntity<ApiResponseDTO<List<FeedbackDTO>>> getApprouves() {
    List<Feedback> feedbacks = feedbackRepository.findByApprouveTrue();
    List<FeedbackDTO> dtos = feedbacks.stream()
      .map(feedbackMapper::toDto)
      .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponseDTO.success(dtos));
  }

  @PostMapping
  @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<FeedbackDTO>> createFeedback(@RequestBody FeedbackDTO dto) {
    try {
      System.out.println("📝 Création feedback - Événement ID: " + dto.getEvenementId());
      System.out.println("📝 Note: " + dto.getNote());
      System.out.println("📝 Commentaire: " + dto.getCommentaire());

      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

      Utilisateur utilisateur = utilisateurRepository.findById(userDetails.getId())
        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

      Evenement evenement = evenementRepository.findById(dto.getEvenementId())
        .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

      Feedback feedback = new Feedback();
      feedback.setNote(dto.getNote());
      feedback.setCommentaire(dto.getCommentaire());
      feedback.setEvenement(evenement);
      feedback.setUtilisateur(utilisateur);
      feedback.setApprouve(true);

      Feedback savedFeedback = feedbackRepository.save(feedback);
      System.out.println("✅ Feedback créé avec ID: " + savedFeedback.getId());

      return ResponseEntity.ok(ApiResponseDTO.success(
        feedbackMapper.toDto(savedFeedback),
        "Merci pour votre avis !"
      ));

    } catch (Exception e) {
      System.err.println("❌ Erreur: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponseDTO.error("Erreur: " + e.getMessage()));
    }
  }

  // ✅ AJOUTER CET ENDPOINT - Approuver un feedback
  @PutMapping("/{id}/approuver")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<FeedbackDTO>> approuverFeedback(@PathVariable Long id) {
    try {
      FeedbackDTO feedbackDTO = feedbackService.approuverFeedback(id);
      return ResponseEntity.ok(ApiResponseDTO.success(feedbackDTO, "Feedback approuvé avec succès"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  // ✅ AJOUTER CET ENDPOINT - Supprimer un feedback
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<Void>> deleteFeedback(@PathVariable Long id) {
    try {
      feedbackService.deleteFeedback(id);
      return ResponseEntity.ok(ApiResponseDTO.success(null, "Feedback supprimé avec succès"));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(ApiResponseDTO.error(e.getMessage()));
    }
  }
  // FeedbackController.java - Ajouter cet endpoint
  @GetMapping("/organisateur")
  @PreAuthorize("hasRole('ORGANISATEUR')")
  public ResponseEntity<ApiResponseDTO<List<FeedbackDTO>>> getFeedbacksByOrganisateur() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    // Récupérer les événements de l'organisateur
    List<Evenement> evenements = evenementRepository.findByOrganisateurId(userDetails.getId());
    List<Long> evenementIds = evenements.stream()
      .map(Evenement::getId)
      .collect(Collectors.toList());

    // Récupérer les feedbacks approuvés de ces événements
    List<Feedback> feedbacks = feedbackRepository.findByEvenementIdInAndApprouveTrue(evenementIds);
    List<FeedbackDTO> dtos = feedbacks.stream()
      .map(feedbackMapper::toDto)
      .collect(Collectors.toList());

    return ResponseEntity.ok(ApiResponseDTO.success(dtos));
  }
}
