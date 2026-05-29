package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {

    private Long id;

    @NotNull(message = "L'ID de l'événement est obligatoire")
    private Long evenementId;
    private String evenementTitre;

    @NotNull(message = "L'ID de l'utilisateur est obligatoire")
    private Long utilisateurId;
    private String utilisateurNom;
    private String utilisateurPrenom;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer note;

    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String commentaire;

    private LocalDateTime dateCreation;
    private boolean approuve;
}
