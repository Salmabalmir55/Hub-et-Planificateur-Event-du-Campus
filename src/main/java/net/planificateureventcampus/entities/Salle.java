package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "salles")
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom;

    private Integer capacite;

    private String equipements; // JSON ou texte séparé par virgules

    private String localisation;

    private boolean disponible = true;

    @OneToOne(mappedBy = "salle")
    private Evenement evenement;

    public boolean isDisponible(LocalDateTime dateDebut, LocalDateTime dateFin) {
        if (evenement == null) return true;
        // Vérifier si la salle n'est pas déjà réservée à cette période
        return evenement.getDateDebut().isAfter(dateFin) ||
                evenement.getDateFin().isBefore(dateDebut);
    }
}