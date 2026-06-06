package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.Role;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "administrateurs")
@PrimaryKeyJoinColumn(name = "utilisateur_id")
public class Administrateur extends Utilisateur {

    private String niveauAcces;

    public Administrateur(String nom, String prenom, String email, String motDePasse) {
        super(nom, prenom, email, motDePasse, Role.ROLE_ADMIN);
        this.niveauAcces = "SUPER_ADMIN";
    }
}