package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.InscriptionDTO;
import net.planificateureventcampus.entities.Inscription;
import net.planificateureventcampus.mapper.InscriptionMapper;
import net.planificateureventcampus.repositories.InscriptionRepository;
import net.planificateureventcampus.service.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    @Autowired
    private InscriptionService inscriptionService;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private InscriptionMapper inscriptionMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<List<InscriptionDTO>>> getAllInscriptions() {
        List<Inscription> inscriptions = inscriptionRepository.findAll();
        List<InscriptionDTO> inscriptionDTOs = inscriptions.stream()
                .map(inscriptionMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponseDTO.success(inscriptionDTOs));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<InscriptionDTO>> getInscriptionById(@PathVariable Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        return ResponseEntity.ok(ApiResponseDTO.success(inscriptionMapper.toDto(inscription)));
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<List<InscriptionDTO>>> getInscriptionsByEtudiant(@PathVariable Long etudiantId) {
        List<Inscription> inscriptions = inscriptionRepository.findByEtudiantId(etudiantId);
        List<InscriptionDTO> inscriptionDTOs = inscriptions.stream()
                .map(inscriptionMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponseDTO.success(inscriptionDTOs));
    }

    @GetMapping("/evenement/{evenementId}")
    @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<List<InscriptionDTO>>> getInscriptionsByEvenement(@PathVariable Long evenementId) {
        List<Inscription> inscriptions = inscriptionRepository.findByEvenementId(evenementId);
        List<InscriptionDTO> inscriptionDTOs = inscriptions.stream()
                .map(inscriptionMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponseDTO.success(inscriptionDTOs));
    }

    @PostMapping
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<ApiResponseDTO<InscriptionDTO>> createInscription(@RequestParam Long etudiantId, @RequestParam Long evenementId) {
        InscriptionDTO inscription = inscriptionService.createInscription(etudiantId, evenementId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success(inscription, "Inscription réussie"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> annulerInscription(@PathVariable Long id) {
        inscriptionService.annulerInscription(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Inscription annulée"));
    }

    @PutMapping("/{id}/presence")
    @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<InscriptionDTO>> marquerPresence(@PathVariable Long id) {
        InscriptionDTO inscription = inscriptionService.marquerPresence(id);
        return ResponseEntity.ok(ApiResponseDTO.success(inscription, "Présence marquée"));
    }
}