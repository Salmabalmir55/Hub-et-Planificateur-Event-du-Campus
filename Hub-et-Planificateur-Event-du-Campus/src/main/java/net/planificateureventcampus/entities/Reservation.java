package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String titre;

  @Column(length = 500)
  private String description;

  @Column(name = "salle_id", nullable = false)
  private Long salleId;

  // ✅ NOUVEAU CHAMP
  @Column(name = "evenement_id")
  private Long evenementId;

  @Column(name = "date_debut", nullable = false)
  private LocalDateTime dateDebut;

  @Column(name = "date_fin", nullable = false)
  private LocalDateTime dateFin;

  @Column(nullable = false)
  private String statut;

  @Column(name = "organisateur_id", nullable = false)
  private Long organisateurId;

  @Column(name = "nombre_participants")
  private Integer nombreParticipants;

  @Column(length = 1000)
  private String equipements;

  @Column(length = 1000)
  private String notes;

  @Column(name = "date_creation")
  private LocalDateTime dateCreation;

  @PrePersist
  protected void onCreate() {
    dateCreation = LocalDateTime.now();
    if (statut == null) {
      statut = "en_attente";
    }
  }
}
