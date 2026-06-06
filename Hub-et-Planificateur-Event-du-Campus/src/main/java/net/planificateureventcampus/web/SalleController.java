package net.planificateureventcampus.web;

import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.SalleDTO;
import net.planificateureventcampus.service.SalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
  origins = "http://localhost:4200",
  allowedHeaders = "*",
  methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/api/salles")
public class SalleController {

  @Autowired
  private SalleService salleService;

  // GET - Toutes les salles (accessible à tous)
  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<SalleDTO>>> getAllSalles() {
    return ResponseEntity.ok(ApiResponseDTO.success(salleService.getAllSalles()));
  }

  // GET - Salles disponibles (pour organisateur) - UNE SEULE FOIS
  @GetMapping("/disponibles")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponseDTO<List<SalleDTO>>> getSallesDisponibles() {
    return ResponseEntity.ok(ApiResponseDTO.success(salleService.getSallesDisponibles()));
  }

  // GET - Salle par ID
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<SalleDTO>> getSalleById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(salleService.getSalleById(id)));
  }

  // POST - Créer une salle (admin seulement)
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<SalleDTO>> createSalle(@Valid @RequestBody SalleDTO dto) {
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(ApiResponseDTO.success(salleService.createSalle(dto), "Salle créée avec succès"));
  }

  // PUT - Modifier une salle (admin seulement)
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<SalleDTO>> updateSalle(@PathVariable Long id, @Valid @RequestBody SalleDTO dto) {
    return ResponseEntity.ok(ApiResponseDTO.success(salleService.updateSalle(id, dto), "Salle modifiée avec succès"));
  }

  // DELETE - Supprimer une salle (admin seulement)
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<Void>> deleteSalle(@PathVariable Long id) {
    salleService.deleteSalle(id);
    return ResponseEntity.ok(ApiResponseDTO.success(null, "Salle supprimée avec succès"));
  }

  // PATCH - Activer une salle (admin seulement)
  @PatchMapping("/{id}/activer")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<SalleDTO>> activerSalle(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(salleService.activerSalle(id), "Salle activée avec succès"));
  }

  // PATCH - Désactiver une salle (admin seulement)
  @PatchMapping("/{id}/desactiver")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<SalleDTO>> desactiverSalle(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(salleService.desactiverSalle(id), "Salle désactivée avec succès"));
  }
}
