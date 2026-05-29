package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "evenement_id", nullable = false)
    private Evenement evenement;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    private Integer note; // 1-5

    @Column(length = 1000)
    private String commentaire;

    private LocalDateTime dateCreation;

    private boolean approuve = false; // Modéré par admin

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }
}
