package net.planificateureventcampus.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.StatutInscription;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionDTO {

    private Long id;

    @NotNull(message = "L'ID de l'étudiant est obligatoire")
    private Long etudiantId;
    private String etudiantNom;
    private String etudiantPrenom;
    private String etudiantMatricule;

    @NotNull(message = "L'ID de l'événement est obligatoire")
    private Long evenementId;
    private String evenementTitre;
    private String evenementLieu;
    private LocalDateTime evenementDateDebut;

    private StatutInscription statut;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateInscription;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateAnnulation;

    private String codeQR;
}
