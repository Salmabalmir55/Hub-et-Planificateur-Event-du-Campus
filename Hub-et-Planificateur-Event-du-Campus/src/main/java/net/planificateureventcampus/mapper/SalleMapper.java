// net.planificateureventcampus/mapper/SalleMapper.java

package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.SalleDTO;
import net.planificateureventcampus.entities.Salle;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SalleMapper {

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "evenements", ignore = true)
  @Mapping(target = "dateCreation", ignore = true)
  @Mapping(target = "dateModification", ignore = true)
  Salle toEntity(SalleDTO dto);

  @Mapping(target = "nombreEvenements", expression = "java(salle.getEvenements() != null ? salle.getEvenements().size() : 0)")
  SalleDTO toDto(Salle salle);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "evenements", ignore = true)
  @Mapping(target = "dateCreation", ignore = true)
  @Mapping(target = "dateModification", ignore = true)
  void updateEntity(@MappingTarget Salle salle, SalleDTO dto);
}
