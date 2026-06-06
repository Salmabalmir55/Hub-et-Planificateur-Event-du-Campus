package net.planificateureventcampus.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.StatutEvenement;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvenementDTO {

  private Long id;

  @NotBlank(message = "Le titre est obligatoire")
  @Size(min = 3, max = 100, message = "Le titre doit contenir entre 3 et 100 caractères")
  private String titre;

  @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
  private String description;

  @NotNull(message = "La date de début est obligatoire")
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")  // ← Changer l'espace par T
  private LocalDateTime dateDebut;

  @NotNull(message = "La date de fin est obligatoire")
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")  // ← Changer l'espace par T
  private LocalDateTime dateFin;

  private String lieu;

  @Min(value = 1, message = "La capacité maximale doit être au moins 1")
  @Max(value = 10000, message = "La capacité maximale ne peut pas dépasser 10000")
  private Integer capaciteMax;

  private String imageUrl;
  private String lienVisio;

  private StatutEvenement statut;
  private LocalDateTime dateCreation;
  private LocalDateTime dateModification;

  private Long organisateurId;
  private String organisateurNom;
  private Long categorieId;
  private String categorieNom;
  private Long salleId;
  private String salleNom;

  private Integer placesRestantes;
  private boolean estComplet;
  private Integer nombreInscriptions;
  private Double noteMoyenne;

  private List<InscriptionDTO> inscriptions;
  private List<FeedbackDTO> feedbacks;

  public String getFormattedDateDebut() {
    return dateDebut != null ? dateDebut.toString() : null;
  }

  public String getPlacesDisponiblesTexte() {
    if (estComplet) return "Complet";
    if (placesRestantes != null && placesRestantes <= 10) return "Plus que " + placesRestantes + " places !";
    return placesRestantes + " places disponibles";
  }
}
