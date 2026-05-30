package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.entities.Evenement;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EvenementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", constant = "EN_ATTENTE")
    @Mapping(target = "inscriptions", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "ressources", ignore = true)
    @Mapping(target = "organisateur", ignore = true)
    @Mapping(target = "categorie", ignore = true)
    @Mapping(target = "salle", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    Evenement toEntity(EvenementDTO dto);

    @Mapping(target = "organisateurId", source = "organisateur.id")
    @Mapping(target = "organisateurNom", ignore = true)
    @Mapping(target = "categorieId", source = "categorie.id")
    @Mapping(target = "categorieNom", source = "categorie.nom")
    @Mapping(target = "salleId", source = "salle.id")
    @Mapping(target = "salleNom", source = "salle.nom")
    @Mapping(target = "placesRestantes", ignore = true)
    @Mapping(target = "estComplet", ignore = true)
    @Mapping(target = "nombreInscriptions", ignore = true)
    @Mapping(target = "noteMoyenne", ignore = true)
    EvenementDTO toDto(Evenement evenement);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "organisateur", ignore = true)
    @Mapping(target = "inscriptions", ignore = true)
    @Mapping(target = "feedbacks", ignore = true)
    @Mapping(target = "ressources", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    void updateEntity(@MappingTarget Evenement evenement, EvenementDTO dto);
}