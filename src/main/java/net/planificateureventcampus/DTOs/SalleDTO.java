package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalleDTO {

    private Long id;

    @NotBlank(message = "Le nom de la salle est obligatoire")
    private String nom;

    @Min(value = 1, message = "La capacité doit être au moins 1")
    private Integer capacite;

    private String equipements;
    private String localisation;
    private boolean disponible = true;

    private boolean estReservee;
    private Long evenementReserveId;
    private String evenementReserveTitre;
}
