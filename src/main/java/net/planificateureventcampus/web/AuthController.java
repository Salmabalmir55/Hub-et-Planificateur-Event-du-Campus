package net.planificateureventcampus.web;

import jakarta.validation.Valid;
import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.LoginDTO;
import net.planificateureventcampus.DTOs.UtilisateurDTO;
import net.planificateureventcampus.entities.Etudiant;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.enums.Role;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import net.planificateureventcampus.security.JwtUtils;
import net.planificateureventcampus.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getMotDePasse()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        LoginDTO response = new LoginDTO();
        response.setLoginReussi(true);
        response.setMessage("Connexion réussie");
        response.setToken(jwt);
        response.setTokenType("Bearer");
        response.setId(userDetails.getId());
        response.setNom(userDetails.getNom());
        response.setPrenom(userDetails.getPrenom());
        response.setEmail(userDetails.getEmail());
        response.setRole(userDetails.getAuthorities().iterator().next().getAuthority());

        return ResponseEntity.ok(ApiResponseDTO.success(response));
    }

    @PostMapping("/register/etudiant")
    public ResponseEntity<?> registerEtudiant(@Valid @RequestBody UtilisateurDTO dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponseDTO.error("Email déjà utilisé"));
        }

        Etudiant etudiant = new Etudiant();
        etudiant.setNom(dto.getNom());
        etudiant.setPrenom(dto.getPrenom());
        etudiant.setEmail(dto.getEmail());
        etudiant.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        etudiant.setRole(Role.ROLE_ETUDIANT);
        etudiant.setMatricule(dto.getMatricule());
        etudiant.setFiliere(dto.getFiliere());
        etudiant.setNiveau(dto.getNiveau());
        etudiant.setTelephone(dto.getTelephone());
        etudiant.setActif(true);
        etudiant.setDateInscription(LocalDateTime.now());

        utilisateurRepository.save(etudiant);
        return ResponseEntity.ok(ApiResponseDTO.success("Étudiant inscrit avec succès"));
    }

    @PostMapping("/register/organisateur")
    public ResponseEntity<?> registerOrganisateur(@Valid @RequestBody UtilisateurDTO dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponseDTO.error("Email déjà utilisé"));
        }

        Organisateur organisateur = new Organisateur();
        organisateur.setNom(dto.getNom());
        organisateur.setPrenom(dto.getPrenom());
        organisateur.setEmail(dto.getEmail());
        organisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        organisateur.setRole(Role.ROLE_ORGANISATEUR);
        organisateur.setDepartement(dto.getDepartement());
        organisateur.setTelephone(dto.getTelephone());
        organisateur.setActif(true);
        organisateur.setEstVerifie(false);
        organisateur.setDateInscription(LocalDateTime.now());

        utilisateurRepository.save(organisateur);
        return ResponseEntity.ok(ApiResponseDTO.success("Organisateur inscrit avec succès"));
    }
    // Ajoute dans AuthController
    @GetMapping("/verify")
    public ResponseEntity<?> verify() {
        return ResponseEntity.ok(ApiResponseDTO.success("Backend fonctionne"));
    }
}