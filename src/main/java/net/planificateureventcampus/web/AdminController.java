package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/evenements/{id}/valider")
    public ResponseEntity<?> validerEvenement(@PathVariable Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        evenement.setStatut(StatutEvenement.VALIDE);
        evenementRepository.save(evenement);
        return ResponseEntity.ok(ApiResponseDTO.success("Événement validé"));
    }

    @GetMapping("/evenements/en-attente")
    public ResponseEntity<?> getEvenementsEnAttente() {
        List<Evenement> evenements = evenementRepository.findByStatut(StatutEvenement.EN_ATTENTE);
        return ResponseEntity.ok(ApiResponseDTO.success(evenements));
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