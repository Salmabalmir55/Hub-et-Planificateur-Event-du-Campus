package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.Role;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {

    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50)
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    private Role role;
    private String photoProfil;
    private String telephone;
    private boolean actif = true;
    private LocalDateTime dateInscription;
    private LocalDateTime derniereConnexion;

    // Pour Étudiant
    private String matricule;
    private String filiere;
    private Integer niveau;

    // Pour Organisateur
    private String departement;
    private Boolean estVerifie;

    // ===== POUR ADMINISTRATEUR =====
    private String niveauAcces;  // ← Ajouter cette ligne
}