package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.Role;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "organisateurs")
@PrimaryKeyJoinColumn(name = "utilisateur_id")
public class Organisateur extends Utilisateur {

    private String departement;

    private String telephone;

    @OneToMany(mappedBy = "organisateur", cascade = CascadeType.ALL)
    private List<Evenement> evenementsOrganises = new ArrayList<>();

    private boolean estVerifie = false;

    public Organisateur(String nom, String prenom, String email, String motDePasse, String departement) {
        super.setNom(nom);
        super.setPrenom(prenom);
        super.setEmail(email);
        super.setMotDePasse(motDePasse);
        super.setRole(Role.ROLE_ORGANISATEUR);
        this.departement = departement;
    }
}
