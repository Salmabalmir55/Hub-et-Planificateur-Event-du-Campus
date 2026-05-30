package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.SalleDTO;
import net.planificateureventcampus.entities.Salle;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SalleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "disponible", constant = "true")
    Salle toEntity(SalleDTO dto);

    @Mapping(target = "estReservee", expression = "java(salle.getEvenement() != null)")
    @Mapping(target = "evenementReserveId", source = "evenement.id")
    @Mapping(target = "evenementReserveTitre", source = "evenement.titre")
    SalleDTO toDto(Salle salle);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    void updateEntity(@MappingTarget Salle salle, SalleDTO dto);
}
