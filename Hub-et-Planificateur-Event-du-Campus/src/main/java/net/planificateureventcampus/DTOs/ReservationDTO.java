package net.planificateureventcampus.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
  private Long id;
  private String titre;
  private String description;
  private Long salleId;
  private String salleNom;
  private Long evenementId;
  private LocalDateTime dateDebut;
  private LocalDateTime dateFin;
  private String statut;
  private Long organisateurId;
  private String organisateurNom;
  private Integer nombreParticipants;
  private String[] equipements;
  private String notes;
  private LocalDateTime dateCreation;
}
