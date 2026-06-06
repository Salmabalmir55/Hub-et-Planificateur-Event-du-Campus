package net.planificateureventcampus.web;


import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.UtilisateurDTO;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.enums.Role;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import net.planificateureventcampus.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/utilisateurs")
@SuppressWarnings("null")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET - Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<?> getAllUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = utilisateurRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponseDTO.success(utilisateurs));
    }

    // GET - Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUtilisateurById(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(ApiResponseDTO.success(convertToDTO(utilisateur)));
    }

    // GET - Récupérer par email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUtilisateurByEmail(@PathVariable String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(ApiResponseDTO.success(convertToDTO(utilisateur)));
    }

    // GET - Récupérer par rôle
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUtilisateursByRole(@PathVariable Role role) {
        List<UtilisateurDTO> utilisateurs = utilisateurRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponseDTO.success(utilisateurs));
    }

    // GET - Utilisateurs actifs
    @GetMapping("/actifs")
    public ResponseEntity<?> getUtilisateursActifs() {
        List<UtilisateurDTO> utilisateurs = utilisateurRepository.findByActifTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponseDTO.success(utilisateurs));
    }

    // PUT - Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUtilisateur(@PathVariable Long id, @RequestBody UtilisateurDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setTelephone(dto.getTelephone());

        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }

        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(ApiResponseDTO.success("Utilisateur mis à jour"));
    }

    // DELETE - Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Utilisateur supprimé"));
    }

    // PUT - Désactiver un utilisateur
    @PutMapping("/{id}/desactiver")
    public ResponseEntity<?> desactiverUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setActif(false);
        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(ApiResponseDTO.success("Utilisateur désactivé"));
    }

    // PUT - Activer un utilisateur
    @PutMapping("/{id}/activer")
    public ResponseEntity<?> activerUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setActif(true);
        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(ApiResponseDTO.success("Utilisateur activé"));
    }

    private UtilisateurDTO convertToDTO(Utilisateur utilisateur) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        dto.setRole(utilisateur.getRole());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setActif(utilisateur.isActif());
        dto.setDateInscription(utilisateur.getDateInscription());
        return dto;
    }
}