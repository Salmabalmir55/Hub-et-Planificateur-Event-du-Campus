package net.planificateureventcampus.web;

import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.mapper.EvenementMapper;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.OrganisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // GET - Récupérer tous les événements
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<EvenementDTO>>> getAllEvenements() {
        List<Evenement> evenements = evenementRepository.findAll();
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

    // POST - Créer un événement
    @PostMapping
    @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<EvenementDTO>> createEvenement(@Valid @RequestBody EvenementDTO dto) {
        Evenement evenement = evenementMapper.toEntity(dto);

        // Récupérer l'organisateur connecté (à modifier selon ton auth)
        Organisateur organisateur = organisateurRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Organisateur non trouvé"));
        evenement.setOrganisateur(organisateur);

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

        evenementMapper.updateEntity(evenement, dto);
        evenement.setDateModification(LocalDateTime.now());

        Evenement updatedEvenement = evenementRepository.save(evenement);
        return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(updatedEvenement), "Événement modifié avec succès"));
    }

    // PUT - Valider un événement (admin)
    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<EvenementDTO>> validerEvenement(@PathVariable Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));
        evenement.setStatut(StatutEvenement.VALIDE);
        evenement.setDateModification(LocalDateTime.now());
        Evenement updatedEvenement = evenementRepository.save(evenement);
        return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(updatedEvenement), "Événement validé avec succès"));
    }

    // PUT - Annuler un événement
    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<EvenementDTO>> annulerEvenement(@PathVariable Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));
        evenement.setStatut(StatutEvenement.ANNULE);
        evenement.setDateModification(LocalDateTime.now());
        Evenement updatedEvenement = evenementRepository.save(evenement);
        return ResponseEntity.ok(ApiResponseDTO.success(evenementMapper.toDto(updatedEvenement), "Événement annulé avec succès"));
    }

    // DELETE - Supprimer un événement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> deleteEvenement(@PathVariable Long id) {
        if (!evenementRepository.existsById(id)) {
            throw new RuntimeException("Événement non trouvé avec ID: " + id);
        }
        evenementRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Événement supprimé avec succès"));
    }
}