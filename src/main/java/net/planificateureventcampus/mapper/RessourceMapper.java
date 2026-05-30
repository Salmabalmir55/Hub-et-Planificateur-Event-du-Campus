package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.RessourceDTO;
import net.planificateureventcampus.entities.Ressource;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RessourceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "quantiteReservee", constant = "0")
    Ressource toEntity(RessourceDTO dto);

    @Mapping(target = "evenementId", source = "evenement.id")
    @Mapping(target = "evenementTitre", source = "evenement.titre")
    @Mapping(target = "quantiteRestante", expression = "java(ressource.getQuantiteDisponible() - ressource.getQuantiteReservee())")
    RessourceDTO toDto(Ressource ressource);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    void updateEntity(@MappingTarget Ressource ressource, RessourceDTO dto);
}
