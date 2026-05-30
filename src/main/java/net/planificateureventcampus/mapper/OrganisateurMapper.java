package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.UtilisateurDTO;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.enums.Role;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public abstract class OrganisateurMapper {

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "motDePasse", expression = "java(passwordEncoder.encode(dto.getMotDePasse()))")
    @Mapping(target = "role", constant = "ROLE_ORGANISATEUR")
    @Mapping(target = "actif", constant = "true")
    @Mapping(target = "estVerifie", constant = "false")
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "derniereConnexion", ignore = true)
    @Mapping(target = "evenementsOrganises", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    public abstract Organisateur toEntity(UtilisateurDTO dto);

    @Mapping(target = "motDePasse", ignore = true)
    @Mapping(target = "matricule", ignore = true)
    @Mapping(target = "filiere", ignore = true)
    @Mapping(target = "niveau", ignore = true)
    public abstract UtilisateurDTO toDto(Organisateur organisateur);
}
