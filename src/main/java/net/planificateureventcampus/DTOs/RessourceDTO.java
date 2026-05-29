package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RessourceDTO {

    private Long id;

    @NotBlank(message = "Le nom de la ressource est obligatoire")
    private String nom;

    private String type;

    @Min(value = 0, message = "La quantité disponible ne peut pas être négative")
    private Integer quantiteDisponible;

    @Min(value = 0, message = "La quantité réservée ne peut pas être négative")
    private Integer quantiteReservee;

    private Long evenementId;
    private String evenementTitre;

    // Calculé
    private Integer quantiteRestante;

    public Integer getQuantiteRestante() {
        return quantiteDisponible - quantiteReservee;
    }
}
