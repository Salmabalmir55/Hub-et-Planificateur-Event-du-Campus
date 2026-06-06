// net.planificateureventcampus/DTOs/SalleDTO.java

package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

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

  private Integer nombreEvenements;
  private LocalDateTime dateCreation;
  private LocalDateTime dateModification;
}
