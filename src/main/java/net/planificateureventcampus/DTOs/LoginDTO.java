package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;


    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String nom;
    private String prenom;
    private String role;
    private String matricule;
    private String departement;
    private boolean loginReussi;
    private String message;

    public LoginDTO(boolean loginReussi, String message) {
        this.loginReussi = loginReussi;
        this.message = message;
    }
}
