package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.InscriptionDTO;
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

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<List<InscriptionDTO>>> getAllInscriptions() {
    List<InscriptionDTO> inscriptions = inscriptionService.getAllInscriptions();
    return ResponseEntity.ok(ApiResponseDTO.success(inscriptions));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<InscriptionDTO>> getInscriptionById(@PathVariable Long id) {
    InscriptionDTO inscription = inscriptionService.getInscriptionById(id);
    return ResponseEntity.ok(ApiResponseDTO.success(inscription));
  }

  @GetMapping("/etudiant/{etudiantId}")
  @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<List<InscriptionDTO>>> getInscriptionsByEtudiant(@PathVariable Long etudiantId) {
    List<InscriptionDTO> inscriptions = inscriptionService.getInscriptionsByEtudiant(etudiantId);
    return ResponseEntity.ok(ApiResponseDTO.success(inscriptions));
  }

  @GetMapping("/evenement/{evenementId}")
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<List<InscriptionDTO>>> getInscriptionsByEvenement(@PathVariable Long evenementId) {
    List<InscriptionDTO> inscriptions = inscriptionService.getInscriptionsByEvenement(evenementId);
    return ResponseEntity.ok(ApiResponseDTO.success(inscriptions));
  }

  @PostMapping
  @PreAuthorize("hasRole('ETUDIANT')")
  public ResponseEntity<ApiResponseDTO<InscriptionDTO>> createInscription(
    @RequestParam Long etudiantId,
    @RequestParam Long evenementId) {

    System.out.println("=== CONTROLLER INSCRIPTION ===");
    System.out.println("etudiantId reçu: " + etudiantId);
    System.out.println("evenementId reçu: " + evenementId);

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
