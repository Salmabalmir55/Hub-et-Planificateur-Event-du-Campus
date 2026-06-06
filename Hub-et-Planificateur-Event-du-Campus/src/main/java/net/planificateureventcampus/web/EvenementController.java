package net.planificateureventcampus.web;

import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.entities.Categorie;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.entities.Salle;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.mapper.EvenementMapper;
import net.planificateureventcampus.repositories.CategorieRepository;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.OrganisateurRepository;
import net.planificateureventcampus.repositories.SalleRepository;
import net.planificateureventcampus.security.UserDetailsImpl;
import net.planificateureventcampus.service.EvenementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/evenements")
public class EvenementController {

  @Autowired
  private EvenementRepository evenementRepository;

  @Autowired
  private OrganisateurRepository organisateurRepository;

  @Autowired
  private EvenementMapper evenementMapper;

  @Autowired
  private CategorieRepository categorieRepository;

  @Autowired
  private SalleRepository salleRepository;

  @Autowired
  private EvenementService evenementService;

  // GET - Récupérer tous les événements (avec filtrage selon le rôle)
  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getAllEvenements() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    boolean isAdminOrOrganisateur = authentication.getAuthorities().stream()
      .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_ORGANISATEUR"));

    List<Evenement> evenements;
    if (isAdminOrOrganisateur) {
      evenements = evenementRepository.findAll();
    } else {
      evenements = evenementRepository.findByStatut(StatutEvenement.VALIDE);
    }

    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // GET - Récupérer un événement par ID
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<EvenementDTO>> getEvenementById(@PathVariable Long id) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));
    return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(evenement)));
  }

  // GET - Événements à venir
  @GetMapping("/a-venir")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsAVenir() {
    List<Evenement> evenements = evenementRepository.findByDateDebutAfterOrderByDateDebutAsc(LocalDateTime.now());
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // GET - Événements passés
  @GetMapping("/passes")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsPasses() {
    List<Evenement> evenements = evenementRepository.findByDateFinBeforeOrderByDateFinDesc(LocalDateTime.now());
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // GET - Événements en cours
  @GetMapping("/en-cours")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsEnCours() {
    List<Evenement> evenements = evenementRepository.findEvenementsEnCours(LocalDateTime.now());
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // GET - Par statut
  @GetMapping("/statut/{statut}")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsByStatut(@PathVariable StatutEvenement statut) {
    List<Evenement> evenements = evenementRepository.findByStatut(statut);
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // GET - Par organisateur
  @GetMapping("/organisateur/{organisateurId}")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsByOrganisateur(@PathVariable Long organisateurId) {
    List<Evenement> evenements = evenementRepository.findByOrganisateurId(organisateurId);
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // GET - Par catégorie
  @GetMapping("/categorie/{categorieId}")
  public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getEvenementsByCategorie(@PathVariable Long categorieId) {
    List<Evenement> evenements = evenementRepository.findByCategorieId(categorieId);
    List<EvenementDTO> evenementDTOs = evenements.stream()
      .map(evenementMapper::toDto)
      .toList();
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTOs));
  }

  // ✅ POST - Créer un événement (UN SEUL)
  @PostMapping
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<EvenementDTO>> createEvenement(@Valid @RequestBody EvenementDTO dto) {
    Evenement evenement = evenementMapper.toEntity(dto);

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Organisateur organisateur = organisateurRepository.findById(userDetails.getId())
      .orElseThrow(() -> new RuntimeException("Organisateur non trouvé"));
    evenement.setOrganisateur(organisateur);

    // ✅ GESTION DE LA CATÉGORIE (EXISTANTE OU NOUVELLE)
    if (dto.getCategorieId() != null && dto.getCategorieId() > 0) {
      Categorie categorie = categorieRepository.findById(dto.getCategorieId())
        .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
      evenement.setCategorie(categorie);
    } else if (dto.getCategorieNom() != null && !dto.getCategorieNom().trim().isEmpty()) {
      String nomCategorie = dto.getCategorieNom().trim();
      Categorie categorie = categorieRepository.findByNom(nomCategorie)
        .orElseGet(() -> {
          Categorie nouvelleCategorie = new Categorie();
          nouvelleCategorie.setNom(nomCategorie);
          nouvelleCategorie.setActive(true);
          nouvelleCategorie.setCouleur("#6B7280");
          nouvelleCategorie.setIcone("📌");
          return categorieRepository.save(nouvelleCategorie);
        });
      evenement.setCategorie(categorie);
    }

    // Gestion de la salle
    if (dto.getSalleId() != null) {
      Salle salle = salleRepository.findById(dto.getSalleId())
        .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
      evenement.setSalle(salle);
      if (dto.getLieu() == null || dto.getLieu().isBlank()) {
        evenement.setLieu(salle.getNom());
      }
    }

    evenement.setStatut(StatutEvenement.EN_ATTENTE);
    evenement.setDateCreation(LocalDateTime.now());
    evenement.setDateModification(LocalDateTime.now());

    Evenement savedEvenement = evenementRepository.save(evenement);
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(ApiResponseDTO.success(evenementMapper.toDto(savedEvenement), "Événement créé avec succès"));
  }

  // PUT - Modifier un événement
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<EvenementDTO>> updateEvenement(@PathVariable Long id, @Valid @RequestBody EvenementDTO dto) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    boolean isAdmin = authentication.getAuthorities().stream()
      .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    boolean isOwner = evenement.getOrganisateur().getId().equals(userDetails.getId());

    if (!isAdmin && !isOwner) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(ApiResponseDTO.error("Vous n'êtes pas autorisé à modifier cet événement"));
    }

    evenementMapper.updateEntity(evenement, dto);

    if (dto.getCategorieId() != null) {
      Categorie categorie = categorieRepository.findById(dto.getCategorieId())
        .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
      evenement.setCategorie(categorie);
    }

    if (dto.getSalleId() != null) {
      Salle salle = salleRepository.findById(dto.getSalleId())
        .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
      evenement.setSalle(salle);
    }

    evenement.setDateModification(LocalDateTime.now());

    Evenement updatedEvenement = evenementRepository.save(evenement);
    return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(updatedEvenement), "Événement modifié avec succès"));
  }

  // PUT - Valider un événement (admin)
  @PutMapping("/{id}/valider")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<EvenementDTO>> validerEvenement(@PathVariable Long id) {
    EvenementDTO evenementDTO = evenementService.validerEvenement(id);
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTO, "Événement validé avec succès"));
  }

  // PUT - Refuser un événement (admin)
  @PutMapping("/{id}/refuser")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<EvenementDTO>> refuserEvenement(@PathVariable Long id) {
    EvenementDTO evenementDTO = evenementService.refuserEvenement(id);
    return ResponseEntity.ok(ApiResponseDTO.success(evenementDTO, "Événement refusé avec succès"));
  }

  // PUT - Annuler un événement
  @PutMapping("/{id}/annuler")
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<EvenementDTO>> annulerEvenement(@PathVariable Long id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));

    boolean isAdmin = authentication.getAuthorities().stream()
      .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    boolean isOwner = evenement.getOrganisateur().getId().equals(userDetails.getId());

    if (!isAdmin && !isOwner) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(ApiResponseDTO.error("Vous n'êtes pas autorisé à annuler cet événement"));
    }

    evenement.setStatut(StatutEvenement.ANNULE);
    evenement.setDateModification(LocalDateTime.now());
    Evenement updatedEvenement = evenementRepository.save(evenement);

    return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(updatedEvenement), "Événement annulé avec succès"));
  }

  // DELETE - Supprimer un événement
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<Void>> deleteEvenement(@PathVariable Long id) {
    try {
      evenementRepository.deleteById(id);
      return ResponseEntity.ok(ApiResponseDTO.success(null, "Événement supprimé avec succès"));
    } catch (Exception e) {
      return ResponseEntity.status(404).body(ApiResponseDTO.error("Événement non trouvé"));
    }
  }
}
