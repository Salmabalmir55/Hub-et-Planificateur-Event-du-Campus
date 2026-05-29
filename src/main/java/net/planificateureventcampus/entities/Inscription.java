package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.StatutInscription;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "inscriptions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"etudiant_id", "evenement_id"}))
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "evenement_id", nullable = false)
    private Evenement evenement;

    @Enumerated(EnumType.STRING)
    private StatutInscription statut = StatutInscription.CONFIRMEE;

    private LocalDateTime dateInscription;

    private LocalDateTime dateAnnulation;

    private String codeQR; // Pour le check-in

    @PrePersist
    protected void onCreate() {
        dateInscription = LocalDateTime.now();
        // Générer code QR unique
        this.codeQR = java.util.UUID.randomUUID().toString();
    }

    public void annuler() {
        this.statut = StatutInscription.ANNULEE;
        this.dateAnnulation = LocalDateTime.now();
    }
}
