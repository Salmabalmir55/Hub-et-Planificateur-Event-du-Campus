// net.planificateureventcampus/entities/Salle.java

package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "salles")
public class Salle {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String nom;

  private Integer capacite;

  @Column(length = 500)
  private String equipements;  // Projecteur, Tableau, Wifi, etc.

  private String localisation;

  private boolean disponible = true;

  @OneToMany(mappedBy = "salle")
  private List<Evenement> evenements = new ArrayList<>();

  @Column(name = "date_creation")
  private LocalDateTime dateCreation;

  @Column(name = "date_modification")
  private LocalDateTime dateModification;

  @PrePersist
  protected void onCreate() {
    dateCreation = LocalDateTime.now();
    dateModification = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    dateModification = LocalDateTime.now();
  }
}
