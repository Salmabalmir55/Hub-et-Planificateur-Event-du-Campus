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
@Table(name = "etudiants")
@PrimaryKeyJoinColumn(name = "utilisateur_id")
public class Etudiant extends Utilisateur {

    @Column(unique = true, nullable = false)
    private String matricule;

    private String filiere;

    private Integer niveau;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private List<Inscription> inscriptions = new ArrayList<>();

    public Etudiant(String nom, String prenom, String email, String motDePasse, String matricule) {
        super.setNom(nom);
        super.setPrenom(prenom);
        super.setEmail(email);
        super.setMotDePasse(motDePasse);
        super.setRole(Role.ROLE_ETUDIANT);
        this.matricule = matricule;
    }
}
