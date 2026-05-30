package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.CategorieDTO;
import net.planificateureventcampus.entities.Categorie;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategorieMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenements", ignore = true)
    @Mapping(target = "active", constant = "true")
    Categorie toEntity(CategorieDTO dto);

    @Mapping(target = "nombreEvenements", expression = "java(categorie.getEvenements() != null ? categorie.getEvenements().size() : 0)")
    CategorieDTO toDto(Categorie categorie);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evenements", ignore = true)
    void updateEntity(@MappingTarget Categorie categorie, CategorieDTO dto);
}
