package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.DTOs.StatistiquesDTO;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.enums.Role;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.mapper.EvenementMapper;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.InscriptionRepository;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private EvenementRepository evenementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private EvenementMapper evenementMapper;

    @PutMapping("/evenements/{id}/valider")
    public ResponseEntity<?> validerEvenement(@PathVariable Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        evenement.setStatut(StatutEvenement.VALIDE);
        evenement.setDateModification(LocalDateTime.now());
        evenementRepository.save(evenement);
        return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(evenement), "Événement validé"));
    }

    @PutMapping("/evenements/{id}/refuser")
    public ResponseEntity<?> refuserEvenement(@PathVariable Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        evenement.setStatut(StatutEvenement.ANNULE);
        evenement.setDateModification(LocalDateTime.now());
        evenementRepository.save(evenement);
        return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(evenement), "Événement refusé"));
    }

    @GetMapping("/evenements/en-attente")
    public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsEnAttente() {
        List<EvenementDTO> evenementDTOs = evenementRepository.findByStatut(StatutEvenement.EN_ATTENTE).stream()
                .map(evenementMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
    }

    @GetMapping("/statistiques")
    public ResponseEntity<ApiResponseDTO<StatistiquesDTO>> getStatistiques() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0);

        long totalEvenements = evenementRepository.count();
        long evenementsCeMois = evenementRepository.findAll().stream()
                .filter(e -> e.getDateCreation() != null && !e.getDateCreation().isBefore(startOfMonth))
                .count();
        long totalInscriptions = inscriptionRepository.count();
        long totalUtilisateurs = utilisateurRepository.count();

        double tauxParticipation = totalEvenements > 0
                ? Math.min(100.0, (totalInscriptions * 100.0) / Math.max(totalEvenements, 1))
                : 0.0;

        StatistiquesDTO stats = StatistiquesDTO.builder()
                .totalUtilisateurs(totalUtilisateurs)
                .totalEtudiants(utilisateurRepository.findByRole(Role.ROLE_ETUDIANT).size())
                .totalOrganisateurs(utilisateurRepository.findByRole(Role.ROLE_ORGANISATEUR).size())
                .totalAdmins(utilisateurRepository.findByRole(Role.ROLE_ADMIN).size())
                .totalEvenements(totalEvenements)
                .evenementsCeMois(evenementsCeMois)
                .evenementsAVenir(evenementRepository.findByDateDebutAfterOrderByDateDebutAsc(now).size())
                .totalInscriptions(totalInscriptions)
                .tauxParticipationMoyen(tauxParticipation)
                .build();

        return ResponseEntity.ok(ApiResponseDTO.success(stats));
    }

    @GetMapping("/utilisateurs")
    public ResponseEntity<?> getAllUtilisateurs() {
        return ResponseEntity.ok(ApiResponseDTO.success(utilisateurRepository.findAll()));
    }

    @DeleteMapping("/utilisateurs/{id}")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Utilisateur supprimé"));
    }
}
