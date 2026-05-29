package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorieDTO {

    private Long id;

    @NotBlank(message = "Le nom de la catégorie est obligatoire")
    private String nom;

    private String description;
    private String couleur;
    private String icone;
    private boolean active = true;

    private Integer nombreEvenements;
}