package net.planificateureventcampus.entities;

import net.planificateureventcampus.enums.StatutEvenement;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import net.planificateureventcampus.enums.StatutInscription;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "evenements")
public class Evenement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime dateDebut;

    @Column(nullable = false)
    private LocalDateTime dateFin;

    private String lieu;

    private Integer capaciteMax;

    private String imageUrl;

    private String lienVisio; // Pour les événements en ligne

    @Enumerated(EnumType.STRING)
    private StatutEvenement statut = StatutEvenement.EN_ATTENTE;

    @ManyToOne
    @JoinColumn(name = "organisateur_id", nullable = false)
    private Organisateur organisateur;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @OneToOne
    @JoinColumn(name = "salle_id")
    private Salle salle;

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL)
    private List<Inscription> inscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks = new ArrayList<>();

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL)
    private List<Ressource> ressources = new ArrayList<>();

    private LocalDateTime dateCreation;

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

    public int getPlacesRestantes() {
        if (capaciteMax == null) return -1;
        long inscrits = inscriptions.stream()
                .filter(i -> i.getStatut() == StatutInscription.CONFIRMEE)
                .count();
        return capaciteMax - (int) inscrits;
    }

    public boolean estComplet() {
        return capaciteMax != null && getPlacesRestantes() <= 0;
    }
}
