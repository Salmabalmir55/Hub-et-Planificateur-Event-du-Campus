package net.planificateureventcampus.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.planificateureventcampus.enums.TypeNotification;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;

    @NotNull(message = "L'ID du destinataire est obligatoire")
    private Long destinataireId;
    private String destinataireNom;
    private String destinataireEmail;

    private Long evenementId;
    private String evenementTitre;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "Le message est obligatoire")
    private String message;

    @NotNull(message = "Le type est obligatoire")
    private TypeNotification type;

    private LocalDateTime dateEnvoi;
    private boolean lu;
    private LocalDateTime dateLecture;
}
