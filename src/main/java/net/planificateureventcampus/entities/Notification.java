package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.TypeNotification;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur destinataire;

    @ManyToOne
    @JoinColumn(name = "evenement_id")
    private Evenement evenement;

    private String titre;

    private String message;

    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    private LocalDateTime dateEnvoi;

    private boolean lu = false;

    private LocalDateTime dateLecture;

    @PrePersist
    protected void onCreate() {
        dateEnvoi = LocalDateTime.now();
    }

    public void marquerCommeLu() {
        this.lu = true;
        this.dateLecture = LocalDateTime.now();
    }
}
