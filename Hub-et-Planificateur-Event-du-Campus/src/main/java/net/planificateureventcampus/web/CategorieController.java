package net.planificateureventcampus.web;

import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.CategorieDTO;
import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.entities.Categorie;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.mapper.CategorieMapper;
import net.planificateureventcampus.mapper.EvenementMapper;
import net.planificateureventcampus.repositories.CategorieRepository;
import net.planificateureventcampus.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategorieController {

  @Autowired
  private EvenementMapper evenementMapper;

  @Autowired
  private CategorieRepository categorieRepository;

  @Autowired
  private CategorieMapper categorieMapper;

  @Autowired
  private CategorieService categorieService;

  // ============================================
  // GET - Toutes les catégories
  // ============================================
  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<CategorieDTO>>> getAllCategories() {
    List<Categorie> categories = categorieRepository.findAll();
    List<CategorieDTO> categorieDTOs = categories.stream()
      .map(categorieMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(categorieDTOs));
  }

  // ============================================
  // GET - Catégorie par ID
  // ============================================
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<CategorieDTO>> getCategorieById(@PathVariable Long id) {
    Categorie categorie = categorieRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + id));
    return ResponseEntity.ok(ApiResponseDTO.success(categorieMapper.toDto(categorie)));
  }

  // ============================================
  // GET - Catégories actives
  // ============================================
  @GetMapping("/actives")
  public ResponseEntity<ApiResponseDTO<List<CategorieDTO>>> getCategoriesActives() {
    List<Categorie> categories = categorieRepository.findByActiveTrue();
    List<CategorieDTO> categorieDTOs = categories.stream()
      .map(categorieMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(categorieDTOs));
  }

  // ============================================
  // GET - Événements par catégorie
  // ============================================
  @GetMapping("/{id}/evenements")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsByCategorie(@PathVariable Long id) {
    Categorie categorie = categorieRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

    List<Evenement> evenements = categorie.getEvenements();
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();

    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // ============================================
  // POST - Créer une catégorie (ADMIN only)
  // ============================================
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<CategorieDTO>> createCategorie(@Valid @RequestBody CategorieDTO dto) {
    if (categorieRepository.findByNom(dto.getNom()).isPresent()) {
      throw new RuntimeException("Une catégorie avec ce nom existe déjà");
    }
    Categorie categorie = categorieMapper.toEntity(dto);
    Categorie savedCategorie = categorieRepository.save(categorie);
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(ApiResponseDTO.success(categorieMapper.toDto(savedCategorie), "Catégorie créée avec succès"));
  }

  // ============================================
  // PUT - Modifier une catégorie (ADMIN only)
  // ============================================
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<CategorieDTO>> updateCategorie(@PathVariable Long id, @Valid @RequestBody CategorieDTO dto) {
    Categorie categorie = categorieRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + id));
    categorieMapper.updateEntity(categorie, dto);
    Categorie updatedCategorie = categorieRepository.save(categorie);
    return ResponseEntity.ok(ApiResponseDTO.success(categorieMapper.toDto(updatedCategorie), "Catégorie modifiée avec succès"));
  }

  // ============================================
  // DELETE - Supprimer une catégorie (ADMIN only)
  // ============================================
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<Void>> deleteCategorie(@PathVariable Long id) {
    if (!categorieRepository.existsById(id)) {
      throw new RuntimeException("Catégorie non trouvée avec ID: " + id);
    }
    // Vérifier si la catégorie a des événements
    Categorie categorie = categorieRepository.findById(id).get();
    if (categorie.getEvenements() != null && !categorie.getEvenements().isEmpty()) {
      throw new RuntimeException("Impossible de supprimer une catégorie qui contient des événements");
    }
    categorieRepository.deleteById(id);
    return ResponseEntity.ok(ApiResponseDTO.success(null, "Catégorie supprimée avec succès"));
  }

  // ============================================
  // PATCH - Activer une catégorie (ADMIN only)
  // ============================================
  @PatchMapping("/{id}/activer")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<CategorieDTO>> activerCategorie(@PathVariable Long id) {
    Categorie categorie = categorieRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + id));

    categorie.setActive(true);
    Categorie savedCategorie = categorieRepository.save(categorie);

    return ResponseEntity.ok(ApiResponseDTO.success(
      categorieMapper.toDto(savedCategorie),
      "Catégorie activée avec succès"
    ));
  }

  // ============================================
  // PATCH - Désactiver une catégorie (ADMIN only)
  // ============================================
  @PatchMapping("/{id}/desactiver")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<CategorieDTO>> desactiverCategorie(@PathVariable Long id) {
    Categorie categorie = categorieRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + id));

    categorie.setActive(false);
    Categorie savedCategorie = categorieRepository.save(categorie);

    return ResponseEntity.ok(ApiResponseDTO.success(
      categorieMapper.toDto(savedCategorie),
      "Catégorie désactivée avec succès"
    ));
  }

  // ============================================
  // POST - Archiver une catégorie (ADMIN only)
  // ============================================
  @PostMapping("/{id}/archiver")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<CategorieDTO>> archiverCategorie(@PathVariable Long id) {
    Categorie categorie = categorieRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + id));

    categorie.setActive(false);
    if (!categorie.getNom().startsWith("[ARCHIVE]")) {
      categorie.setNom("[ARCHIVE] " + categorie.getNom());
    }
    Categorie savedCategorie = categorieRepository.save(categorie);

    return ResponseEntity.ok(ApiResponseDTO.success(
      categorieMapper.toDto(savedCategorie),
      "Catégorie archivée avec succès"
    ));
  }
}
