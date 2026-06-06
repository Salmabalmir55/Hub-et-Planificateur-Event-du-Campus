package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.FeedbackDTO;
import net.planificateureventcampus.entities.Feedback;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "approuve", constant = "false")
    Feedback toEntity(FeedbackDTO dto);

    @Mapping(target = "evenementId", source = "evenement.id")
    @Mapping(target = "evenementTitre", source = "evenement.titre")
    @Mapping(target = "utilisateurId", source = "utilisateur.id")
    @Mapping(target = "utilisateurNom", source = "utilisateur.nom")
    @Mapping(target = "utilisateurPrenom", source = "utilisateur.prenom")
    FeedbackDTO toDto(Feedback feedback);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    void updateEntity(@MappingTarget Feedback feedback, FeedbackDTO dto);
}
