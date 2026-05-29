package net.planificateureventcampus.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "categories")
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom;

    private String description;

    private String couleur;

    private String icone;

    @OneToMany(mappedBy = "categorie")
    private List<Evenement> evenements = new ArrayList<>();

    private boolean active = true;
}
