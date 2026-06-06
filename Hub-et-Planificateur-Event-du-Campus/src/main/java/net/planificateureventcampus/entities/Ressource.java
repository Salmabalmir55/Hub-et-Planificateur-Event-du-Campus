package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ressources")
public class Ressource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String type; // projecteur, ordinateur, tableau, etc.

    private Integer quantiteDisponible;

    private Integer quantiteReservee = 0;

    @ManyToOne
    @JoinColumn(name = "evenement_id")
    private Evenement evenement;

    public void reserver(int quantite) {
        if (quantite <= quantiteDisponible - quantiteReservee) {
            this.quantiteReservee += quantite;
        } else {
            throw new RuntimeException("Quantité insuffisante disponible");
        }
    }

    public void liberer() {
        this.quantiteReservee = 0;
    }
}
