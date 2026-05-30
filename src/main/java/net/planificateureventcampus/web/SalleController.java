package net.planificateureventcampus.web;

import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.SalleDTO;
import net.planificateureventcampus.entities.Salle;
import net.planificateureventcampus.mapper.SalleMapper;
import net.planificateureventcampus.repositories.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/salles")
public class SalleController {

    @Autowired
    private SalleRepository salleRepository;

    @Autowired
    private SalleMapper salleMapper;

    // GET - Toutes les salles
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<SalleDTO>>> getAllSalles() {
        List<Salle> salles = salleRepository.findAll();
        List<SalleDTO> salleDTOs = salles.stream()
                .map(salleMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponseDTO.success(salleDTOs));
    }

    // GET - Salle par ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<SalleDTO>> getSalleById(@PathVariable Long id) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée avec ID: " + id));
        return ResponseEntity.ok(ApiResponseDTO.success(salleMapper.toDto(salle)));
    }

    // GET - Salles disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<ApiResponseDTO<List<SalleDTO>>> getSallesDisponibles() {
        List<Salle> salles = salleRepository.findByDisponibleTrue();
        List<SalleDTO> salleDTOs = salles.stream()
                .map(salleMapper::toDto)
                .toList();
        return ResponseEntity.ok(ApiResponseDTO.success(salleDTOs));
    }

    // POST - Créer une salle
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<SalleDTO>> createSalle(@Valid @RequestBody SalleDTO dto) {
        if (salleRepository.findByNom(dto.getNom()).isPresent()) {
            throw new RuntimeException("Une salle avec ce nom existe déjà");
        }
        Salle salle = salleMapper.toEntity(dto);
        Salle savedSalle = salleRepository.save(salle);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success(salleMapper.toDto(savedSalle), "Salle créée avec succès"));
    }

    // PUT - Modifier une salle
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<SalleDTO>> updateSalle(@PathVariable Long id, @Valid @RequestBody SalleDTO dto) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée avec ID: " + id));
        salleMapper.updateEntity(salle, dto);
        Salle updatedSalle = salleRepository.save(salle);
        return ResponseEntity.ok(ApiResponseDTO.success(salleMapper.toDto(updatedSalle), "Salle modifiée avec succès"));
    }

    // DELETE - Supprimer une salle
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> deleteSalle(@PathVariable Long id) {
        if (!salleRepository.existsById(id)) {
            throw new RuntimeException("Salle non trouvée avec ID: " + id);
        }
        salleRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Salle supprimée avec succès"));
    }
}